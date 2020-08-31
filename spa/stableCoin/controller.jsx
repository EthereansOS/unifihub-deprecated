var StableCoinController = function (view) {
    var context = this;
    context.view = view;

    context.loadData = async function loadData() {
        await window.loadEthereumStuff(context.view.oldStableCoin);
        window.stableFarming = window.newContract(window.context.UnifiedStableFarmingAbi, window.context.farmingContractAddress);
        delete window.addressBarParams.useOldStableCoin;
        context.view.forceUpdate();
        context.loadPairs();
        context.loadEconomicData();
        context.view.economicDataInterval = context.view.economicDataInterval || setInterval(context.loadEconomicData, window.context.refreshDataPollingInterval);
    };

    context.loadEconomicData = async function loadEconomicData() {
        context.view.setState({ differences : await context.loadDifferences() });
        context.view.setState({ totalSupply: await window.blockchainCall(window.stableCoin.token.methods.totalSupply) });
        context.view.setState({ availableToMint: await window.blockchainCall(window.stableCoin.token.methods.availableToMint) });
        context.view.setState({myBalance : await context.getMyBalance()});
        context.getTotalCoins();
        context.calculatePriceInDollars();
        context.view.state && context.view.state.selectedPair && context.getBalance(context.view.state.selectedPair);
    };

    context.loadDifferences = async function loadDifferences() {
        var differences = await window.blockchainCall(window.stableCoin.token.methods.differences);
        if(parseInt(differences[0]) < (10**parseInt(window.stableCoin.decimals))) {
            differences[0] = '0';
        }
        if(parseInt(differences[1]) < (10**parseInt(window.stableCoin.decimals))) {
            differences[1] = '0';
        }
        return differences;
    }

    context.loadPairs = async function loadPairs() {
        context.view.setState({ pairs: null, token0Approved: null, token1Approved: null, selectedPair : null });
        var pairs = [];
        var tokensInPairs = {};
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
            if(total < window.context.uSDPoolLimit) {
                pairData.disabled = true;
            } else {
                if(await window.blockchainCall(window.uniswapV2Factory.methods.getPair, window.stableCoin.address, pairData.token0.address) !== window.voidEthereumAddress) {
                    tokensInPairs[pairData.token0.address] = tokensInPairs[pairData.token0.address] || pairData.token0;
                }
                if(await window.blockchainCall(window.uniswapV2Factory.methods.getPair, window.stableCoin.address, pairData.token1.address) !== window.voidEthereumAddress) {
                    tokensInPairs[pairData.token1.address] = tokensInPairs[pairData.token1.address] || pairData.token1;
                }
            }
            pairs.push(pairData);
        }
        context.view.setState({ tokensInPairs, selectedTokenInPairs: Object.values(tokensInPairs)[0], pairs, selectedPair: context.firstNonDisabledPair(pairs), selectedFarmPair: context.firstNonDisabledPair(pairs), token0Approved: null, token1Approved: null }, function () {
            context.checkApprove(context.view.state.selectedPair);
            context.getTotalCoins();
        });
    };

    context.firstNonDisabledPair = function firstNonDisabledPair(pairs) {
        for(var pairData of pairs) {
            if(!pairData.disabled) {
                return pairData;
            }
        }
    };

    context.getBalance = async function getBalance(selectedPair) {
        selectedPair.token0 && (selectedPair.token0.balance = !window.walletAddress ? '0' : await window.blockchainCall(selectedPair.token0.token.methods.balanceOf, window.walletAddress));
        selectedPair.token1 && (selectedPair.token1.balance = !window.walletAddress ? '0' : await window.blockchainCall(selectedPair.token1.token.methods.balanceOf, window.walletAddress));
        selectedPair.token && (selectedPair.balance = !window.walletAddress ? '0' : await window.blockchainCall(selectedPair.token.methods.balanceOf, window.walletAddress));
        context.view.setState(selectedPair);
    };

    context.checkApprove = async function checkApprove(pairData) {
        context.getBalance(pairData);
        var token0Approved = null;
        var token1Approved = null;
        var selectedTokenInPairsApproved = null;
        context.view.setState({ selectedTokenInPairsApproved, token0Approved, token1Approved });
        if (!window.walletAddress) {
            return;
        }
        pairData.token0 && (token0Approved = parseInt(await window.blockchainCall(pairData.token0.token.methods.allowance, window.walletAddress, window.stableCoin.address)) > 0);
        pairData.token1 && (token1Approved = parseInt(await window.blockchainCall(pairData.token1.token.methods.allowance, window.walletAddress, window.stableCoin.address)) > 0);
        pairData.token && (selectedTokenInPairsApproved = parseInt(await window.blockchainCall(pairData.token.methods.allowance, window.walletAddress, window.stableFarming.options.address)) > 0);
        context.view.setState({ selectedTokenInPairsApproved, token0Approved, token1Approved });
    };

    context.approve = async function approve(pairData, token) {
        context.view.setState({ approving: token, performing: null });
        var errorMessage;
        var state = { approving: null };
        try {
            await window.blockchainCall((token !== 'selectedTokenInPairs' ? pairData["token" + token] : context.view.state.selectedTokenInPairs).token.methods.approve, (token !== 'selectedTokenInPairs' ? window.stableCoin.address : window.stableFarming.options.address), window.numberToString(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff));
            state[(token !== 'selectedTokenInPairs' ? ('token' + token) : 'selectedTokenInPairs') + 'Approved'] = true;
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
            token0 : '0',
            token1 : '0'
        };
        var reserves = await context.getComplexReservePairData(pairData);

        reserves.token0AmountInStable = parseInt(context.fromTokenToStable(pairData.token0.decimals, reserves[0]));
        reserves.token1AmountInStable = parseInt(context.fromTokenToStable(pairData.token1.decimals, reserves[1]));
        reserves.firstSecond = reserves.token0AmountInStable / reserves.token1AmountInStable;
        reserves.secondFirst = reserves.token1AmountInStable / reserves.token0AmountInStable;
        value = parseInt(value);
        burnValue.token0 = (value * reserves.firstSecond) / 2;
        burnValue.token1 = (value * reserves.secondFirst) / 2;
        burnValue.token0 = context.fromStableToToken(pairData.token0.decimals, window.numberToString(burnValue.token0).split(',').join('').split('.')[0]);
        burnValue.token1 = context.fromStableToToken(pairData.token1.decimals, window.numberToString(burnValue.token1).split(',').join('').split('.')[0]);
        var stableCoinOutput = await context.getStableCoinOutput(pairData, burnValue.token0, burnValue.token1);
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
        context.view.setState({ approving: null, performing: true });
        var errorMessage;
        try {
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
        } catch (e) {
            var message = e.message || e;
            if (message.toLowerCase().indexOf('user denied') === -1) {
                errorMessage = message;
            }
        }
        context.view.setState({ approving: null, performing: null }, () => errorMessage && setTimeout(() => alert(errorMessage)));
    };

    context.performBurn = async function performBurn(pairData, token0Value, token1Value) {
        context.view.setState({ approving: null, performing: true });
        var errorMessage;
        try {
            var oldStableCoinOutput = token0Value;
            var burnValue = await context.calculateBurnValue(pairData, token0Value);
            token0Value = burnValue.token0;
            token1Value = burnValue.token1;
            var stableCoinOutput = await context.getStableCoinOutput(pairData, token0Value, token1Value);
            if (isNaN(parseInt(token0Value)) || parseInt(token0Value) <= 0) {
                throw `You must insert a positive ${pairData.token0.symbol} amount`;
            }
            if (isNaN(parseInt(token1Value)) || parseInt(token1Value) <= 0) {
                throw `You must insert a positive ${pairData.token1.symbol} amount`;
            }
            var myBalance = await window.blockchainCall(window.stableCoin.token.methods.balanceOf, window.walletAddress);
            if (parseInt(stableCoinOutput) > parseInt(myBalance)) {
                throw `You have insufficient ${window.stableCoin.symbol}`;
            }
            var reserves = await window.blockchainCall(pairData.pair.methods.getReserves);
            var ratePool0 = parseInt(token0Value) / parseInt(reserves[0]);
            var ratePool1 = parseInt(token1Value) / parseInt(reserves[1]);
            token0Value = parseInt(token0Value) * ratePool0;
            token0Value = window.numberToString(token0Value).split(',').join('').split('.')[0];
            token1Value = parseInt(token1Value) * ratePool0;
            token1Value = window.numberToString(token1Value).split(',').join('').split('.')[0];
            var ratePool = ratePool0 < ratePool1 ? ratePool0 : ratePool1;
            var totalSupply = await window.blockchainCall(pairData.pair.methods.totalSupply);
            var supplyInPercentage = window.numberToString(parseInt(totalSupply) * ratePool).split(',').join('').split('.')[0];
            var balance = await window.blockchainCall(pairData.pair.methods.balanceOf, window.stableCoin.address);
            if (parseInt(supplyInPercentage) > parseInt(balance)) {
                throw window.stableCoin.symbol + " has insufficient balance in pool to perform this operation";
            }
            var token0Slippage = window.numberToString(parseInt(token0Value) * window.context.slippageAmount).split(',').join('').split('.')[0];
            var token1Slippage = window.numberToString(parseInt(token1Value) * window.context.slippageAmount).split(',').join('').split('.')[0];
            token0Slippage = window.web3.utils.toBN(token0Value).sub(window.web3.utils.toBN(token0Slippage)).toString();
            token1Slippage = window.web3.utils.toBN(token1Value).sub(window.web3.utils.toBN(token1Slippage)).toString();
            await window.blockchainCall(window.stableCoin.token.methods.burn, pairData.index, supplyInPercentage, token0Slippage, token1Slippage);
            context.loadEconomicData();
            context.view.openSuccessMessage(`burnt your ${window.stableCoin.symbol} tokens`);
        } catch (e) {
            var message = e.message || e;
            if (message.toLowerCase().indexOf('user denied') === -1) {
                errorMessage = message;
            }
        }
        context.view.setState({ approving: null, performing: null }, () => errorMessage && setTimeout(() => alert(errorMessage)));
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
            if(isNaN(parseInt(amount)) || parseInt(amount) <= 0) {
                throw `Inserted amount must be a positive number`;
            }
            var differences = await context.loadDifferences();
            var debt = parseInt(differences[1]);
            if(parseInt(amount) > debt) {
                throw `Inserted amount is greater than the debt`;
            }
            var balanceOf = parseInt(await window.blockchainCall(window.stableCoin.token.methods.balanceOf, window.walletAddress));
            if(parseInt(amount) > balanceOf) {
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
        if(!window.walletAddress) {
            return null;
        }
        return await window.blockchainCall(window.stableCoin.token.methods.balanceOf, window.walletAddress);
    };

    context.calculateRebalanceByDebtReward = async function calculateRebalanceByDebtReward(amount) {
        amount = window.toDecimals(amount.split(',').join(''), window.stableCoin.decimals);
        return await window.blockchainCall(window.stableCoin.token.methods.calculateRebalanceByDebtReward, amount);
    };

    context.getTotalCoins = async function getTotalCoins() {
        if(!context.view.state || !context.view.state.pairs) {
            return;
        }
        var totalCoins = {
            balanceOf : '0',
            list : {
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
                balanceOf : '0',
                address : pairData.token0.address,
                decimals: pairData.token0.decimals
            };
            totalCoins.list[pairData.token0.address].balanceOf = window.web3.utils.toBN(reserves.token0InStable).add(window.web3.utils.toBN(totalCoins.list[pairData.token0.address].balanceOf)).toString();
            totalCoins.list[pairData.token1.address] = totalCoins.list[pairData.token1.address] ||  {
                symbol: pairData.token1.symbol,
                name: pairData.token1.name,
                balanceOf : '0',
                address : pairData.token1.address,
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
        if(isNaN(parseInt(totalCoins.regularPercentage)) || (balanceOf === 0 && totalSupply === 0)) {
            totalCoins.regularPercentage = '100';
            totalCoins.healthPercentage = '50';
        }
        context.view.setState({totalCoins});
    };

    context.calculatePriceInDollars = async function calculatePriceInDollars() {
        var ethereumPrice = await window.getEthereumPrice();
        try {
            var priceInDollars = window.fromDecimals((await window.blockchainCall(window.uniswapV2Router.methods.getAmountsOut, window.toDecimals('1', window.stableCoin.decimals), [window.stableCoin.address, window.wethAddress]))[1], 18, true);
            priceInDollars = parseFloat(priceInDollars) * ethereumPrice;
            context.view.setState({priceInDollars});
        } catch (e) {}
    };

    context.earnByPump = async function earnByPump() {

    };

    context.earnByDump = async function earnByDump() {

    };

    context.calculateEarnByPumpData = async function calculateEarnByPumpData(selectedTokenInPairs, selectedFarmPair, value) {
        if(isNaN(parseInt(value)) || parseInt(value) === 0) {
            return null;
        }
        var earnByPumpData = {};
        earnByPumpData.output = (await window.blockchainCall(window.uniswapV2Router.methods.getAmountsOut, value, [selectedTokenInPairs.address, window.stableCoin.address]))[1];
        earnByPumpData.valueInStable = context.fromTokenToStable(selectedTokenInPairs.decimals, value);
        var diff = window.web3.utils.toBN(earnByPumpData.output).sub(window.web3.utils.toBN(earnByPumpData.valueInStable)).toString();
        var burnValueData = await context.calculateBurnValue(selectedFarmPair, diff);
        Object.entries(burnValueData).forEach(it => earnByPumpData[it[0]] = it[1]);
        return earnByPumpData;
    };
};