var StableCoinController = function (view) {
    var context = this;
    context.view = view;

    context.loadData = async function loadData() {
        context.view.setState({connectionUnavailable : null});
        try {
            await window.loadEthereumStuff(context.view.oldStableCoin);
        } catch(e) {
            return context.view.setState({connectionUnavailable : true, selectedPair : null});
        }
        window.stableFarming = window.newContract(window.context.UnifiedStableFarmingAbi, window.context.farmingContractAddress);
        delete window.addressBarParams.useOldStableCoin;
        context.view.forceUpdate();
        context.loadPairs();
        context.loadEconomicData();
        context.view.economicDataInterval = context.view.economicDataInterval || setInterval(context.loadEconomicData, window.context.refreshDataPollingInterval);
    };

    context.loadEconomicData = async function loadEconomicData() {
        context.view.setState({ differences: await context.loadDifferences() });
        context.view.setState({ totalSupply: await window.blockchainCall(window.stableCoin.token.methods.totalSupply) });
        context.view.setState({ availableToMint: await window.blockchainCall(window.stableCoin.token.methods.availableToMint) });
        context.view.setState({ myBalance: await context.getMyBalance() });
        context.getTotalCoins();
        context.calculatePriceInDollars();
        context.view.state && context.view.state.selectedPair && context.getBalance(context.view.state.selectedPair);
    };

    context.loadDifferences = async function loadDifferences() {
        var differences = await window.blockchainCall(window.stableCoin.token.methods.differences);
        if (parseInt(differences[0]) < (10 ** parseInt(window.stableCoin.decimals))) {
            differences[0] = '0';
        }
        if (parseInt(differences[1]) < (10 ** parseInt(window.stableCoin.decimals))) {
            differences[1] = '0';
        }
        return differences;
    }

    context.loadPairs = async function loadPairs() {
        context.loadTokensInPairs(window.stableCoin);
        context.view.setState({ pairs: null, token0Approved: null, token1Approved: null, selectedPair: null });
        var pairs = [];
        for (var pairAddress of await window.blockchainCall(window.stableCoin.token.methods.allowedPairs)) {
            var pair = window.newContract(window.context.UniswapV2PairAbi, pairAddress);
            var pairData = {
                index: pairs.length,
                address: pairAddress,
                pair: pair,
                token0: await window.loadTokenInfos(await window.blockchainCall(pair.methods.token0)),
                token1: await window.loadTokenInfos(await window.blockchainCall(pair.methods.token1))
            };
            pairData.name = pairData.token0.symbol + ' / ' + pairData.token1.symbol;
            var reserves = await window.blockchainCall(pair.methods.getReserves);
            reserves[0] = context.fromTokenToStable(pairData.token0.decimals, reserves[0]);
            reserves[1] = context.fromTokenToStable(pairData.token1.decimals, reserves[1]);
            var total = window.web3.utils.toBN(reserves[0]).add(window.web3.utils.toBN(reserves[1])).toString();
            total = window.fromDecimals(total, window.stableCoin.decimals, true);
            total = parseFloat(total);
            if (total < window.context.uSDPoolLimit) {
                pairData.disabled = true;
            } else {
                if (await window.blockchainCall(window.uniswapV2Factory.methods.getPair, window.stableCoin.address, pairData.token0.address) !== window.voidEthereumAddress) {
                    pairData.token0.pairWithStable = true;
                }
                if (await window.blockchainCall(window.uniswapV2Factory.methods.getPair, window.stableCoin.address, pairData.token1.address) !== window.voidEthereumAddress) {
                    pairData.token1.pairWithStable = true;
                }
            }
            pairs.push(pairData);
        }
        context.view.setState({pairs, selectedPair: context.firstNonDisabledPair(pairs), selectedFarmPair: context.firstNonDisabledPair(pairs), token0Approved: null, token1Approved: null }, async function () {
            context.checkApprove(context.view.state.selectedPair);
            context.checkApprove(context.view.state.selectedFarmPair, true);
            context.getTotalCoins();
            context.view.setState({ selectedFarmPairToken: context.view.state.selectedFarmPair.token0 });
            context.view.setState({ selectedFarmPairTokenPrice: '0', selectedFarmPairTokenSinglePrice: await context.calculateFarmDumpValue(context.view.state.selectedFarmPair, "0", window.toDecimals("1", window.stableCoin.decimals)) });
        });
    };

    context.loadTokensInPairs = async function loadTokensInPairs(token) {
        var uniswapTokens = await window.loadUniswapPairs(token);
        var tokensInPairs = {};
        for(var uniswapToken of uniswapTokens) {
            tokensInPairs[window.web3.utils.toChecksumAddress(uniswapToken.token0.address)] = uniswapToken.token0;
            tokensInPairs[window.web3.utils.toChecksumAddress(uniswapToken.token1.address)] = uniswapToken.token1;
        }
        delete tokensInPairs[window.web3.utils.toChecksumAddress(token.address)];
        context.view.setState({ tokensInPairs, selectedTokenInPairs: Object.values(tokensInPairs)[0]}, function () {
            context.checkApprove(context.view.state.selectedTokenInPairs);
        });
    };

    context.firstNonDisabledPair = function firstNonDisabledPair(pairs) {
        for (var pairData of pairs) {
            if (!pairData.disabled) {
                return pairData;
            }
        }
    };

    context.getBalance = async function getBalance(selectedPair) {
        selectedPair.token0 && (selectedPair.token0.balance = !window.walletAddress ? '0' : selectedPair.token0.address === window.wethAddress ? await window.web3.eth.getBalance(window.walletAddress) : await window.blockchainCall(selectedPair.token0.token.methods.balanceOf, window.walletAddress));
        selectedPair.token1 && (selectedPair.token1.balance = !window.walletAddress ? '0' : selectedPair.token1.address === window.wethAddress ? await window.web3.eth.getBalance(window.walletAddress) : await window.blockchainCall(selectedPair.token1.token.methods.balanceOf, window.walletAddress));
        selectedPair.token && (selectedPair.balance = !window.walletAddress ? '0' : (selectedPair.token.address || selectedPair.address) === window.wethAddress ? await window.web3.eth.getBalance(window.walletAddress) : await window.blockchainCall(selectedPair.token.methods.balanceOf, window.walletAddress));
        context.view.setState(selectedPair);
    };

    context.checkApprove = async function checkApprove(pairData, forFarm) {
        context.getBalance(pairData);
        var state = {};
        if (!window.walletAddress) {
            if (!pairData.token && !forFarm) {
                state.token0Approved = null;
                state.token1Approved = null;
            }
            else {
                pairData.token && (state.selectedTokenInPairsApproved = null);
                !pairData.token && (state.farmToken0Approved = null);
                !pairData.token && (state.farmToken1Approved = null);
            }
            return context.view.setState(state);
        }
        pairData.token0 && !forFarm && (state.token0Approved = pairData.token0.address === window.wethAddress ? true : parseInt(await window.blockchainCall(pairData.token0.token.methods.allowance, window.walletAddress, window.stableCoin.address)) > 0);
        pairData.token1 && !forFarm && (state.token1Approved = pairData.token1.address === window.wethAddress ? true : parseInt(await window.blockchainCall(pairData.token1.token.methods.allowance, window.walletAddress, window.stableCoin.address)) > 0);
        pairData.token && (state.selectedTokenInPairsApproved = (pairData.token.address || pairData.address) === window.wethAddress ? true : parseInt(await window.blockchainCall(pairData.token.methods.allowance, window.walletAddress, window.stableFarming.options.address)) > 0);
        pairData.token0 && forFarm && (state.farmToken0Approved = pairData.token0.address === window.wethAddress ? true : parseInt(await window.blockchainCall(pairData.token0.token.methods.allowance, window.walletAddress, window.stableFarming.options.address)) > 0);
        pairData.token1 && forFarm && (state.farmToken1Approved = pairData.token1.address === window.wethAddress ? true : parseInt(await window.blockchainCall(pairData.token1.token.methods.allowance, window.walletAddress, window.stableFarming.options.address)) > 0);
        context.view.setState(state);
    };

    context.approve = async function approve(pairData, token) {
        context.view.setState({ approving: token, performing: null });
        var errorMessage;
        var state = { approving: null };
        var isFarm = token.indexOf('farm') !== -1;
        token = token.split('farm').join('');
        try {
            await window.blockchainCall((token !== 'selectedTokenInPairs' ? pairData["token" + token] : context.view.state.selectedTokenInPairs).token.methods.approve, ((token === 'selectedTokenInPairs' || isFarm) ? window.stableFarming.options.address : window.stableCoin.address), window.numberToString(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff));
            !isFarm && (state[(token !== 'selectedTokenInPairs' ? ('token' + token) : 'selectedTokenInPairs') + 'Approved'] = true);
            isFarm && (state['farmToken' + token + 'Approved'] = true);
        } catch (e) {
            var message = e.message || e;
            if (message.toLowerCase().indexOf('user denied') === -1) {
                errorMessage = message;
            }
        }
        context.view.setState(state, () => errorMessage && setTimeout(() => alert(errorMessage)));
    }

    context.calculateOtherPair = async function calculateOtherPair(pairData, token, firstValue, noDecimals) {
        var firstToken = pairData["token" + token];
        firstValue = noDecimals === true ? firstValue : window.toDecimals(firstValue.split(',').join(''), firstToken.decimals);
        var reserves = await window.blockchainCall(pairData.pair.methods.getReserves);
        var firstReserve = reserves[token];
        var secondReserve = reserves[token === "0" ? "1" : "0"];
        var amount = parseInt(firstValue) / parseInt(firstReserve);
        var secondValue = window.numberToString(parseInt(secondReserve) * amount).split(',').join('').split('.')[0];
        return secondValue;
    };

    context.calculateBurnValue = async function calculateBurnValue(pairData, value) {
        var burnValue = {
            token0: '0',
            token1: '0'
        };
        if (isNaN(parseInt(value)) || parseInt(value) === 0) {
            return burnValue;
        }
        var reserves = await context.getComplexReservePairData(pairData);

        reserves.token0AmountInStable = parseInt(context.fromTokenToStable(pairData.token0.decimals, reserves[0]));
        reserves.token1AmountInStable = parseInt(context.fromTokenToStable(pairData.token1.decimals, reserves[1]));
        reserves.firstSecond = reserves.token0AmountInStable / reserves.token1AmountInStable;
        reserves.secondFirst = reserves.token1AmountInStable / reserves.token0AmountInStable;
        value = parseInt(value);
        burnValue.token0 = (value * reserves.firstSecond) / 2;
        burnValue.token0 = context.fromStableToToken(pairData.token0.decimals, window.numberToString(burnValue.token0).split(',').join('').split('.')[0]);
        burnValue.token1 = await context.calculateOtherPair(pairData, '0', burnValue.token0, true);
        var stableCoinOutput = await context.getStableCoinOutput(pairData, burnValue.token0, burnValue.token1);
        burnValue.stableCoinOutput = stableCoinOutput;
        var rate = value / parseInt(stableCoinOutput);
        burnValue.token0 = parseInt(burnValue.token0) * rate;
        burnValue.token0 = window.numberToString(burnValue.token0).split(',').join('').split('.')[0];
        burnValue.token1 = parseInt(burnValue.token1) * rate;
        burnValue.token1 = window.numberToString(burnValue.token1).split(',').join('').split('.')[0];
        return burnValue;
    };

    context.getStableCoinOutput = function getStableCoinOutput(pairData, token0Value, token1Value) {
        token0Value = context.fromTokenToStable(pairData.token0.decimals, token0Value);
        token1Value = context.fromTokenToStable(pairData.token1.decimals, token1Value);
        var result = window.web3.utils.toBN(token0Value).add(window.web3.utils.toBN(token1Value)).toString();
        return result;
    };

    context.fromTokenToStable = function fromTokenToStable(decimals, value) {
        var remainingDecimals = parseInt(window.stableCoin.decimals) - parseInt(decimals);
        if (remainingDecimals === 0) {
            return value;
        }
        return window.toDecimals(value, remainingDecimals);
    };

    context.fromStableToToken = function fromStableToToken(decimals, value) {
        var remainingDecimals = parseInt(window.stableCoin.decimals) - parseInt(decimals);
        if (remainingDecimals === 0) {
            return value;
        }
        return window.fromDecimals(value, remainingDecimals, true).split('.')[0];
    };

    context.performMint = async function performMint(pairData, token0Value, token1Value) {
        if (isNaN(parseInt(token0Value)) || parseInt(token0Value) <= 0) {
            throw `You must insert a positive ${pairData.token0.symbol} amount`;
        }
        if (isNaN(parseInt(token1Value)) || parseInt(token1Value) <= 0) {
            throw `You must insert a positive ${pairData.token1.symbol} amount`;
        }
        var myBalance = await window.blockchainCall(pairData.token0.token.methods.balanceOf, window.walletAddress);
        if (parseInt(token0Value) > parseInt(myBalance)) {
            throw `You have insufficient ${pairData.token0.symbol}`;
        }
        myBalance = await window.blockchainCall(pairData.token1.token.methods.balanceOf, window.walletAddress);
        if (parseInt(token1Value) > parseInt(myBalance)) {
            throw `You have insufficient ${pairData.token1.symbol}`;
        }
        var stableCoinOutput = await context.getStableCoinOutput(pairData, token0Value, token1Value);
        var availableToMint = parseInt(await window.blockchainCall(window.stableCoin.token.methods.availableToMint));
        if (availableToMint < parseInt(stableCoinOutput)) {
            throw `Cannot mint ${window.fromDecimals(stableCoinOutput, window.stableCoin.decimals)} ${window.stableCoin.symbol}`;
        }

        var token0Slippage = window.numberToString(parseInt(token0Value) * window.context.slippageAmount).split(',').join('').split('.')[0];
        var token1Slippage = window.numberToString(parseInt(token1Value) * window.context.slippageAmount).split(',').join('').split('.')[0];
        token0Slippage = window.web3.utils.toBN(token0Value).sub(window.web3.utils.toBN(token0Slippage)).toString();
        token1Slippage = window.web3.utils.toBN(token1Value).sub(window.web3.utils.toBN(token1Slippage)).toString();
        await window.blockchainCall(window.stableCoin.token.methods.mint, pairData.index, token0Value, token1Value, token0Slippage, token1Slippage);
        context.loadEconomicData();
        context.view.openSuccessMessage(`minted new ${window.stableCoin.symbol} tokens`);
    };

    context.performBurn = async function performBurn(pairData, stableCoinOutput) {
        var burnData = await context.getBurnData(pairData, stableCoinOutput);
        if (isNaN(parseInt(burnData.token0Value)) || parseInt(burnData.token0Value) <= 0) {
            throw `You must insert a positive ${pairData.token0.symbol} amount`;
        }
        if (isNaN(parseInt(burnData.token1Value)) || parseInt(burnData.token1Value) <= 0) {
            throw `You must insert a positive ${pairData.token1.symbol} amount`;
        }
        var myBalance = await window.blockchainCall(window.stableCoin.token.methods.balanceOf, window.walletAddress);
        if (parseInt(stableCoinOutput) > parseInt(myBalance)) {
            throw `You have insufficient ${window.stableCoin.symbol}`;
        }
        var balance = await window.blockchainCall(pairData.pair.methods.balanceOf, window.stableCoin.address);
        if (parseInt(burnData.supplyInPercentage) > parseInt(balance)) {
            throw window.stableCoin.symbol + " has insufficient balance in pool to perform this operation";
        }
        await window.blockchainCall(window.stableCoin.token.methods.burn, burnData.pairDataIndex, burnData.supplyInPercentage, burnData.token0Slippage, burnData.token1Slippage);
        context.loadEconomicData();
        context.view.openSuccessMessage(`burnt your ${window.stableCoin.symbol} tokens`);
    };

    context.getBurnData = async function getBurnData(pairData, stableCoinOutput) {
        var burnValue = await context.calculateBurnValue(pairData, stableCoinOutput);
        var token0Value = burnValue.token0;
        var token1Value = burnValue.token1;
        var reserves = await window.blockchainCall(pairData.pair.methods.getReserves);
        var ratePool0 = parseInt(token0Value) / parseInt(reserves[0]);
        var ratePool1 = parseInt(token1Value) / parseInt(reserves[1]);
        var ratePool = ratePool0 < ratePool1 ? ratePool0 : ratePool1;
        var totalSupply = await window.blockchainCall(pairData.pair.methods.totalSupply);
        var supplyInPercentage = window.numberToString(parseInt(totalSupply) * ratePool).split(',').join('').split('.')[0];
        var token0Slippage = window.numberToString(parseInt(token0Value) * window.context.slippageAmount).split(',').join('').split('.')[0];
        var token1Slippage = window.numberToString(parseInt(token1Value) * window.context.slippageAmount).split(',').join('').split('.')[0];
        token0Slippage = window.web3.utils.toBN(token0Value).sub(window.web3.utils.toBN(token0Slippage)).toString();
        token1Slippage = window.web3.utils.toBN(token1Value).sub(window.web3.utils.toBN(token1Slippage)).toString();
        return {
            pairDataIndex: pairData.index,
            supplyInPercentage,
            token0Value,
            token1Value,
            token0Slippage,
            token1Slippage
        };
    };

    context.rebalanceByCredit = async function rebalanceByCredit() {
        try {
            var differences = await context.loadDifferences();
            var { pairData, reserves } = await context.getBestRebalanceByCreditPair();
            var redeemable = parseInt(differences[0]);
            var balanceOf = parseInt(await window.blockchainCall(window.stableCoin.token.methods.balanceOf, window.walletAddress));
            redeemable = redeemable > balanceOf ? balanceOf : redeemable;
            var reallyRedeemable = reserves.token0InStable + reserves.token1InStable;
            redeemable = redeemable > reallyRedeemable ? reallyRedeemable : redeemable;

            var rate0 = reserves.token0InStable / reallyRedeemable;
            var token0Amount = redeemable * rate0;
            token0Amount = token0Amount / reserves.token0InStable;
            var token0Value = parseInt(reserves.token0) * token0Amount;
            token0Value = window.numberToString(token0Value).split(',').join('').split('.')[0];

            var rate1 = reserves.token1InStable / reallyRedeemable;
            var token1Amount = redeemable * rate1;
            token1Amount = token1Amount / reserves.token1InStable;
            var token1Value = parseInt(reserves.token1) * token1Amount;
            token1Value = window.numberToString(token1Value).split(',').join('').split('.')[0];

            var ratePool0 = parseInt(token0Value) / parseInt(reserves.token0);
            var ratePool1 = parseInt(token1Value) / parseInt(reserves.token1);
            var ratePool = ratePool0 < ratePool1 ? ratePool0 : ratePool1;
            var poolAmount = reserves.poolBalance * ratePool;
            poolAmount = window.numberToString(poolAmount).split(',').join('').split('.')[0];
            var token0Slippage = window.numberToString(parseInt(token0Value) * window.context.slippageAmount).split(',').join('').split('.')[0];
            var token1Slippage = window.numberToString(parseInt(token1Value) * window.context.slippageAmount).split(',').join('').split('.')[0];
            token0Slippage = window.web3.utils.toBN(token0Value).sub(window.web3.utils.toBN(token0Slippage)).toString();
            token1Slippage = window.web3.utils.toBN(token1Value).sub(window.web3.utils.toBN(token1Slippage)).toString();
            await window.blockchainCall(window.stableCoin.token.methods.rebalanceByCredit, pairData.index, poolAmount, token0Slippage, token1Slippage);
            context.loadEconomicData();
            context.view.openSuccessMessage(`rebalanced by credit the ${window.stableCoin.symbol}`);
        } catch (e) {
            var message = e.message || e;
            if (message.toLowerCase().indexOf('user denied') === -1) {
                alert(message);
            }
        }
    };

    context.getBestRebalanceByCreditPair = async function getBestRebalanceByCreditPair() {
        var max = 0;
        var selectedPairData = context.view.state.pairs[0];
        var selectedReserves;
        for (var pairData of context.view.state.pairs) {
            var reserves = await context.getComplexReservePairData(pairData);
            var localMax = reserves.token0InStable > reserves.token1InStable ? reserves.token0InStable : reserves.token1InStable;
            if (localMax > max) {
                max = localMax;
                selectedPairData = pairData;
                selectedReserves = reserves;
            }
        }
        return {
            pairData: selectedPairData,
            reserves: selectedReserves
        };
    };

    context.getComplexReservePairData = async function getComplexReservePairData(pairData) {
        var reserves = await window.blockchainCall(pairData.pair.methods.getReserves);
        reserves.poolBalance = parseInt(await window.blockchainCall(pairData.pair.methods.balanceOf, window.stableCoin.address));
        var totalSupply = parseInt(await window.blockchainCall(pairData.pair.methods.totalSupply));
        var amount = reserves.poolBalance / totalSupply;
        reserves.token0 = parseInt(reserves[0]) * amount;
        reserves.token1 = parseInt(reserves[1]) * amount;
        reserves.token0 = window.numberToString(reserves.token0).split(',').join('').split('.')[0];
        reserves.token1 = window.numberToString(reserves.token1).split(',').join('').split('.')[0];
        reserves.token0InStable = parseInt(context.fromTokenToStable(pairData.token0.decimals, reserves.token0));
        reserves.token1InStable = parseInt(context.fromTokenToStable(pairData.token1.decimals, reserves.token1));
        reserves.amount = amount;
        return reserves;
    };

    context.rebalanceByDebt = async function rebalanceByDebt(amount) {
        try {
            amount = window.toDecimals(amount.split(',').join(''), window.stableCoin.decimals);
            if (isNaN(parseInt(amount)) || parseInt(amount) <= 0) {
                throw `Inserted amount must be a positive number`;
            }
            var differences = await context.loadDifferences();
            var debt = parseInt(differences[1]);
            if (parseInt(amount) > debt) {
                throw `Inserted amount is greater than the debt`;
            }
            var balanceOf = parseInt(await window.blockchainCall(window.stableCoin.token.methods.balanceOf, window.walletAddress));
            if (parseInt(amount) > balanceOf) {
                throw `You don't have enough ${window.stableCoin.symbol} to perform this operation`;
            }
            await window.blockchainCall(window.stableCoin.token.methods.rebalanceByDebt, amount);
            context.loadEconomicData();
            context.view.openSuccessMessage(`rebalanced by debt the ${window.stableCoin.symbol}`);
        } catch (e) {
            var message = e.message || e;
            if (message.toLowerCase().indexOf('user denied') === -1) {
                alert(message);
            }
        }
    };

    context.getMyBalance = async function getMyBalance() {
        if (!window.walletAddress) {
            return null;
        }
        return await window.blockchainCall(window.stableCoin.token.methods.balanceOf, window.walletAddress);
    };

    context.calculateRebalanceByDebtReward = async function calculateRebalanceByDebtReward(amount) {
        amount = window.toDecimals(amount.split(',').join(''), window.stableCoin.decimals);
        return await window.blockchainCall(window.stableCoin.token.methods.calculateRebalanceByDebtReward, amount);
    };

    context.getTotalCoins = async function getTotalCoins() {
        if (!context.view.state || !context.view.state.pairs) {
            return;
        }
        var totalCoins = {
            balanceOf: '0',
            list: {
            }
        };
        for (var pairData of context.view.state.pairs) {
            var reserves = await window.blockchainCall(pairData.pair.methods.getReserves);
            reserves.poolBalance = parseInt(await window.blockchainCall(pairData.pair.methods.balanceOf, window.stableCoin.address));
            var totalSupply = parseInt(await window.blockchainCall(pairData.pair.methods.totalSupply));
            var balanceOf = reserves.poolBalance / totalSupply;
            reserves.token0 = parseInt(reserves[0]) * balanceOf;
            reserves.token1 = parseInt(reserves[1]) * balanceOf;
            reserves.token0 = window.numberToString(reserves.token0).split(',').join('').split('.')[0];
            reserves.token1 = window.numberToString(reserves.token1).split(',').join('').split('.')[0];
            reserves.token0InStable = context.fromTokenToStable(pairData.token0.decimals, reserves.token0);
            reserves.token1InStable = context.fromTokenToStable(pairData.token1.decimals, reserves.token1);
            totalCoins.balanceOf = window.web3.utils.toBN(reserves.token0InStable).add(window.web3.utils.toBN(reserves.token1InStable)).add(window.web3.utils.toBN(totalCoins.balanceOf)).toString();
            totalCoins.list[pairData.token0.address] = totalCoins.list[pairData.token0.address] || {
                symbol: pairData.token0.symbol,
                name: pairData.token0.name,
                balanceOf: '0',
                address: pairData.token0.address,
                decimals: pairData.token0.decimals
            };
            totalCoins.list[pairData.token0.address].balanceOf = window.web3.utils.toBN(reserves.token0InStable).add(window.web3.utils.toBN(totalCoins.list[pairData.token0.address].balanceOf)).toString();
            totalCoins.list[pairData.token1.address] = totalCoins.list[pairData.token1.address] || {
                symbol: pairData.token1.symbol,
                name: pairData.token1.name,
                balanceOf: '0',
                address: pairData.token1.address,
                decimals: pairData.token1.decimals
            };
            totalCoins.list[pairData.token1.address].balanceOf = window.web3.utils.toBN(reserves.token1InStable).add(window.web3.utils.toBN(totalCoins.list[pairData.token1.address].balanceOf)).toString();
        }
        var balanceOf = totalCoins.balanceOf;
        var totalSupply = context.view.state.totalSupply;
        totalSupply = parseInt(totalSupply);
        balanceOf = parseInt(balanceOf);
        var first = totalSupply < balanceOf ? totalSupply : balanceOf;
        var second = totalSupply > balanceOf ? totalSupply : balanceOf;
        var percentage = (first / second) * 100;
        percentage = parseInt(window.formatMoney(percentage, 0));
        balanceOf > totalSupply && (percentage = percentage === 200 ? 200 : percentage > 200 ? 201 : 200 - percentage);
        totalCoins.regularPercentage = window.numberToString(percentage).split(',').join('').split('.')[0];
        totalCoins.healthPercentage = window.numberToString(percentage / 2).split(',').join('').split('.')[0];
        parseInt(totalCoins.regularPercentage) > 200 && (totalCoins.regularPercentage = '200+');
        parseInt(totalCoins.healthPercentage) > 100 && (totalCoins.healthPercentage = '100');
        if (isNaN(parseInt(totalCoins.regularPercentage)) || (balanceOf === 0 && totalSupply === 0)) {
            totalCoins.regularPercentage = '100';
            totalCoins.healthPercentage = '50';
        }
        context.view.setState({ totalCoins });
    };

    context.calculatePriceInDollars = async function calculatePriceInDollars() {
        context.view.setState({ priceInDollars: await context.getPriceInDollars(window.stableCoin) });
    };

    context.getPriceInDollars = async function getPriceInDollars(token, value) {
        var ethereumPrice = await window.getEthereumPrice();
        try {
            var priceInDollars = window.fromDecimals(token.address === window.wethAddress ? value || window.toDecimals(1, 18) : (await window.blockchainCall(window.uniswapV2Router.methods.getAmountsOut, value || window.toDecimals('1', token.decimals), [token.address, window.wethAddress]))[1], 18, true);
            priceInDollars = parseFloat(priceInDollars) * ethereumPrice;
            return priceInDollars;
        } catch (e) { }
        return 0;
    }

    context.setDumpPricesInDollars = async function setDumpPricesInDollars(pairToken, token0Value, token1Value, outputStable, outputToken, outputTokenPrice) {
        var token0ValueInDollars = parseInt(await context.fromTokenToStable(pairToken.token0.decimals, token0Value));
        var token1ValueInDollars = parseInt(await context.fromTokenToStable(pairToken.token1.decimals, token1Value));

        var input = token0ValueInDollars + token1ValueInDollars;
        context.view.setState({farmDumpPay : window.fromDecimals(input, window.stableCoin.decimals)});

        var outputStableInDollars = parseInt(window.toDecimals(outputStable.split(',').join(''), window.stableCoin.decimals));
        var outputTokenInDollars = parseInt(await context.fromTokenToStable(outputToken.decimals, outputTokenPrice));

        var output = outputStableInDollars + outputTokenInDollars;
        context.view.setState({farmDumpDifference : window.fromDecimals(output - input, window.stableCoin.decimals)});
    };

    context.performEarnByPump = async function performEarnByPump(selectedTokenInPairs, selectedFarmPair, value) {
        if(isNaN(parseInt(value)) || parseInt(value) <= 0) {
            throw `The ${selectedTokenInPairs.symbol} amount must be a number greater than 0`;
        }
        var myBalance = (selectedTokenInPairs.token.address || selectedTokenInPairs.address) === window.wethAddress ? await window.web3.eth.getBalance(window.walletAddress) : await window.blockchainCall(selectedTokenInPairs.token.methods.balanceOf, window.walletAddress);
        if(parseInt(value) > parseInt(myBalance)) {
            throw `You don't have sufficient ${selectedTokenInPairs.symbol} to swap`;
        }
        var earnByPumpData = await context.calculateEarnByPumpData(selectedTokenInPairs, selectedFarmPair, value);
        if (parseInt(earnByPumpData.token0) < 1 || parseInt(earnByPumpData.token1) < 1) {
            throw `Cannot pump: ${window.stableCoin.symbol} value is higher than ${selectedTokenInPairs.symbol}`;
        }
        if(earnByPumpData.farmPumpDifference.indexOf("-") !== -1 || earnByPumpData.token0Value.indexOf("-") !== -1 || earnByPumpData.token1Value.indexOf("-") !== -1) {
            throw `Arbitrage earns cannot be negative`;
        }
        var eth = (selectedTokenInPairs.token.address || selectedTokenInPairs.address) === window.wethAddress ? value : undefined;
        await window.blockchainCall(eth, window.stableFarming.methods.earnByPump, window.stableCoin.address, earnByPumpData.pairDataIndex, earnByPumpData.supplyInPercentage, earnByPumpData.token0Slippage, earnByPumpData.token1Slippage, selectedTokenInPairs.address, eth ? '0' : value);
        context.loadEconomicData();
        context.view.openSuccessMessage(`Pumped ${window.stableCoin.symbol} Token`);
    };

    context.calculateEarnByPumpData = async function calculateEarnByPumpData(selectedTokenInPairs, selectedFarmPair, value) {
        if (isNaN(parseInt(value)) || parseInt(value) === 0) {
            return null;
        }
        var earnByPumpData = {};
        earnByPumpData.inputInDollars = await context.getPriceInDollars(selectedTokenInPairs, value);
        earnByPumpData.input = window.toDecimals(window.numberToString(earnByPumpData.inputInDollars).split(',').join(''), window.stableCoin.decimals);
        earnByPumpData.output = (await window.blockchainCall(window.uniswapV2Router.methods.getAmountsOut, value, [selectedTokenInPairs.address, window.stableCoin.address]))[1];
        earnByPumpData.valueInStable = context.fromTokenToStable(selectedTokenInPairs.decimals, value);
        earnByPumpData.diff = window.web3.utils.toBN(earnByPumpData.output).sub(window.web3.utils.toBN(earnByPumpData.input)).toString();//.split('-').join('');
        var burnValueData = await context.getBurnData(selectedFarmPair, earnByPumpData.diff);
        Object.entries(burnValueData).forEach(it => earnByPumpData[it[0]] = it[1]);

        var token0ValueInDollars = parseInt(await context.fromTokenToStable(selectedFarmPair.token0.decimals, earnByPumpData.token0Value));
        var token1ValueInDollars = parseInt(await context.fromTokenToStable(selectedFarmPair.token1.decimals, earnByPumpData.token1Value));

        var output = token0ValueInDollars + token1ValueInDollars;
        earnByPumpData.farmPumpDifference = window.fromDecimals(output, window.stableCoin.decimals);

        return earnByPumpData;
    };

    context.calculateFarmDumpValue = async function calculateFarmDumpValue(selectedFarmPair, token, value) {
        if (isNaN(parseInt(value)) || parseInt(value) === 0) {
            return '0';
        }
        try {
            return (await window.blockchainCall(window.uniswapV2Router.methods.getAmountsOut, value, [window.stableCoin.address, selectedFarmPair['token' + token].address]))[1];
        } catch(e) {
            return "0";
        }
    };

    context.performEarnByDump = async function performEarnByDump(selectedFarmPair, token0Value, token1Value, swapToken, swapTokenValue) {
        if (isNaN(parseInt(token0Value)) || parseInt(token0Value) <= 0) {
            throw `You must insert a positive ${selectedFarmPair.token0.symbol} amount`;
        }
        if (isNaN(parseInt(token1Value)) || parseInt(token1Value) <= 0) {
            throw `You must insert a positive ${selectedFarmPair.token1.symbol} amount`;
        }
        var myBalance = await window.blockchainCall(selectedFarmPair.token0.token.methods.balanceOf, window.walletAddress);
        if (parseInt(token0Value) > parseInt(myBalance)) {
            throw `You have insufficient ${selectedFarmPair.token0.symbol}`;
        }
        myBalance = await window.blockchainCall(selectedFarmPair.token1.token.methods.balanceOf, window.walletAddress);
        if (parseInt(token1Value) > parseInt(myBalance)) {
            throw `You have insufficient ${selectedFarmPair.token1.symbol}`;
        }
        var stableCoinOutput = await context.getStableCoinOutput(selectedFarmPair, token0Value, token1Value);
        var availableToMint = parseInt(await window.blockchainCall(window.stableCoin.token.methods.availableToMint));
        if (availableToMint < parseInt(stableCoinOutput)) {
            throw `Cannot mint ${window.fromDecimals(stableCoinOutput, window.stableCoin.decimals)} ${window.stableCoin.symbol}`;
        }
        var indices = [swapToken];

        if (indices.length === 0) {
            throw `You must choose at least one of the two tokens to swap`;
        }

        var values = [swapTokenValue];

        var calculus = '0';

        for (var i = 0; i < values.length; i++) {
            var val = values[i];
            if (isNaN(parseInt(val)) || parseInt(val) <= 0) {
                throw `The ${selectedFarmPair['token' + indices[i]].symbol} amount must be a number greater than 0`;
            }
            calculus = window.web3.utils.toBN(calculus).add(window.web3.utils.toBN(val)).toString();
        }

        if (parseInt(calculus) > parseInt(stableCoinOutput)) {
            throw `The total value of ${window.stableCoin.symbol} to swap is greater than the one that will be minted`
        }

        var token0Slippage = window.numberToString(parseInt(token0Value) * window.context.slippageAmount).split(',').join('').split('.')[0];
        var token1Slippage = window.numberToString(parseInt(token1Value) * window.context.slippageAmount).split(',').join('').split('.')[0];
        token0Slippage = window.web3.utils.toBN(token0Value).sub(window.web3.utils.toBN(token0Slippage)).toString();
        token1Slippage = window.web3.utils.toBN(token1Value).sub(window.web3.utils.toBN(token1Slippage)).toString();

        await window.blockchainCall(window.stableFarming.methods.earnByDump, window.stableCoin.address, selectedFarmPair.index, token0Value, token1Value, token0Slippage, token1Slippage, indices, values);
        context.loadEconomicData();
        context.view.openSuccessMessage(`Dumped ${window.stableCoin.symbol} Token`);
    };
};