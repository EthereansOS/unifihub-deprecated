var StableCoinController = function (view) {
    var context = this;
    context.view = view;

    context.loadData = async function loadData() {
        context.loadPairs();
        context.loadEconomicData();
    };

    context.loadEconomicData = async function loadEconomicData() {
        context.view.setState({ differences : await context.loadDifferences() });
        context.view.setState({ totalSupply: await window.blockchainCall(window.stableCoin.token.methods.totalSupply) });
        context.view.setState({ availableToMint: await window.blockchainCall(window.stableCoin.token.methods.availableToMint) });
        context.getTotalCoins();
        context.calculatePriceInDollars();
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
        context.view.setState({ pairs: null, token0Approved: null, token1Approved: null });
        var pairs = [];
        for (var pairAddress of await window.blockchainCall(window.stableCoin.token.methods.allowedPairs)) {
            var pair = window.newContract(window.context.UniswapV2PairAbi, pairAddress);
            var pairData = {
                index: pairs.length,
                address: pairAddress,
                pair: pair,
                token0: await window.loadTokenInfos(await window.blockchainCall(pair.methods.token0), window.wethToken.options.address),
                token1: await window.loadTokenInfos(await window.blockchainCall(pair.methods.token1), window.wethToken.options.address)
            };
            pairData.name = pairData.token0.symbol + ' / ' + pairData.token1.symbol;
            pairs.push(pairData);
        }
        context.view.setState({ pairs, selectedPair: pairs[0], token0Approved: null, token1Approved: null }, function () {
            context.checkApprove(pairs[0]);
            context.getTotalCoins();
        });
    };

    context.checkApprove = async function checkApprove(pairData) {
        var token0Approved = null;
        var token1Approved = null;
        context.view.setState({ token0Approved, token1Approved });
        if (!window.walletAddress) {
            return;
        }
        token0Approved = parseInt(await window.blockchainCall(pairData.token0.token.methods.allowance, window.walletAddress, window.stableCoin.address)) > 0;
        token1Approved = parseInt(await window.blockchainCall(pairData.token1.token.methods.allowance, window.walletAddress, window.stableCoin.address)) > 0;
        context.view.setState({ token0Approved, token1Approved });
    };

    context.approve = async function approve(pairData, token) {
        context.view.setState({ approving: token, performing: null });
        var errorMessage;
        var state = { approving: null };
        try {
            await window.blockchainCall(pairData["token" + token].token.methods.approve, window.stableCoin.address, window.numberToString(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff));
            state['token' + token + 'Approved'] = true;
        } catch (e) {
            var message = e.message || e;
            if (message.toLowerCase().indexOf('user denied') === -1) {
                errorMessage = message;
            }
        }
        context.view.setState(state, () => errorMessage && setTimeout(() => alert(errorMessage)));
    }

    context.calculateOtherPair = async function calculateOtherPair(pairData, token, firstValue) {
        var firstToken = pairData["token" + token];
        firstValue = window.toDecimals(firstValue.split(',').join(''), firstToken.decimals);
        var reserves = await window.blockchainCall(pairData.pair.methods.getReserves);
        var firstReserve = reserves[token];
        var secondReserve = reserves[token === "0" ? "1" : "0"];
        var amount = parseInt(firstValue) / parseInt(firstReserve);
        var secondValue = window.numberToString(parseInt(secondReserve) * amount).split(',').join('').split('.')[0];
        return secondValue;
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
            var amount = parseInt(token0Value) / parseInt(reserves[0]);
            var totalSupply = await window.blockchainCall(pairData.pair.methods.totalSupply);
            var supplyInPercentage = window.numberToString(parseInt(totalSupply) * amount).split(',').join('').split('.')[0];
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

    context.rebalanceByDebt = async function rebalanceByDebt(amount) {
        try {
            amount = window.toDecimals(amount.split(',').join(''), window.stableCoin.decimals);
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
        } catch (e) {
            var message = e.message || e;
            if (message.toLowerCase().indexOf('user denied') === -1) {
                alert(message);
            }
        }
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
            amount : '0',
            list : {
            }
        };
        for (var pairData of context.view.state.pairs) {
            var reserves = await window.blockchainCall(pairData.pair.methods.getReserves);
            reserves.poolBalance = parseInt(await window.blockchainCall(pairData.pair.methods.balanceOf, window.stableCoin.address));
            var totalSupply = parseInt(await window.blockchainCall(pairData.pair.methods.totalSupply));
            var amount = reserves.poolBalance / totalSupply;
            reserves.token0 = parseInt(reserves[0]) * amount;
            reserves.token1 = parseInt(reserves[1]) * amount;
            reserves.token0 = window.numberToString(reserves.token0).split(',').join('').split('.')[0];
            reserves.token1 = window.numberToString(reserves.token1).split(',').join('').split('.')[0];
            reserves.token0InStable = context.fromTokenToStable(pairData.token0.decimals, reserves.token0);
            reserves.token1InStable = context.fromTokenToStable(pairData.token1.decimals, reserves.token1);
            totalCoins.amount = window.web3.utils.toBN(reserves.token0InStable).add(window.web3.utils.toBN(reserves.token1InStable)).add(window.web3.utils.toBN(totalCoins.amount)).toString();
            totalCoins.list[pairData.token0.address] = totalCoins.list[pairData.token0.address] || {
                symbol: pairData.token0.symbol,
                name: pairData.token0.name,
                amount : '0',
                address : pairData.token0.address,
                decimals: pairData.token0.decimals
            };
            totalCoins.list[pairData.token0.address].amount = window.web3.utils.toBN(reserves.token0InStable).add(window.web3.utils.toBN(totalCoins.list[pairData.token0.address].amount)).toString();
            totalCoins.list[pairData.token1.address] = totalCoins.list[pairData.token1.address] ||  {
                symbol: pairData.token1.symbol,
                name: pairData.token1.name,
                amount : '0',
                address : pairData.token1.address,
                decimals: pairData.token1.decimals
            };
            totalCoins.list[pairData.token1.address].amount = window.web3.utils.toBN(reserves.token1InStable).add(window.web3.utils.toBN(totalCoins.list[pairData.token1.address].amount)).toString();
        }
        var totalSupply = parseInt(context.view.state.totalSupply);
        var amount = parseInt(totalCoins.amount);
        var first = totalSupply < amount ? totalSupply : amount;
        var second = totalSupply > amount ? totalSupply : amount;
        var percentage = (first / second) * 100;
        totalSupply > amount && (percentage *= -1);
        totalCoins.healthPercentage = window.numberToString(percentage / 2).split(',').join('').split('.')[0];
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
};