var UusdController = function (view) {
    var context = this;
    context.view = view;

    context.loadData = async function loadData() {
        context.loadPairs();
    };

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

    context.approve = async function approve(pairData, token, originalToken0Value, originalToken1Value) {
        context.view.setState({ approving: token, performing: null }, () => context.view.updateAmounts(originalToken0Value, originalToken1Value));
        var errorMessage;
        var state = { approving: null };
        try {
            await window.blockchainCall(pairData["token" + token].token.methods.approve, window.stableCoin.address, window.numberToString(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff));
            state['token' + token + 'Approved'] = true;
        } catch (e) {
            var message = e.message || e;
            if(message.toLowerCase().indexOf('user denied') === -1) {
                errorMessage = message;
            }
        }
        context.view.setState(state, () => {
            context.view.updateAmounts(originalToken0Value, originalToken1Value);
            errorMessage && setTimeout(() => alert(errorMessage));
        });
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
        token0Value = window.toDecimals(token0Value.split(',').join(''), pairData.token0.decimals);
        token1Value = window.toDecimals(token1Value.split(',').join(''), pairData.token1.decimals);
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
        var originalToken0Value = token0Value;
        var originalToken1Value = token1Value;
        context.view.setState({ approving: null, performing: true }, () => context.view.updateAmounts(originalToken0Value, originalToken1Value));
        var errorMessage;
        try {
            token0Value = window.toDecimals(token0Value.split(',').join(''), pairData.token0.decimals);
            if(parseInt(token0Value) <= 0) {
                throw `You must insert a positive ${pairData.token0.symbol} amount`;
            }
            token1Value = window.toDecimals(token1Value.split(',').join(''), pairData.token1.decimals);
            if(parseInt(token1Value) <= 0) {
                throw `You must insert a positive ${pairData.token1.symbol} amount`;
            }
            var myBalance = await window.blockchainCall(pairData.token0.token.methods.balanceOf, window.walletAddress);
            if(parseInt(token0Value) > parseInt(myBalance)) {
                throw `You have insufficient ${pairData.token0.symbol}`;
            }
            myBalance = await window.blockchainCall(pairData.token1.token.methods.balanceOf, window.walletAddress);
            if(parseInt(token1Value) > parseInt(myBalance)) {
                throw `You have insufficient ${pairData.token1.symbol}`;
            }
            var token0Slippage = window.numberToString(parseInt(token0Value) * window.context.slippageAmount).split(',').join('').split('.')[0];
            var token1Slippage = window.numberToString(parseInt(token1Value) * window.context.slippageAmount).split(',').join('').split('.')[0];
            token0Slippage = window.web3.utils.toBN(token0Value).sub(window.web3.utils.toBN(token0Slippage)).toString();
            token1Slippage = window.web3.utils.toBN(token1Value).sub(window.web3.utils.toBN(token1Slippage)).toString();
            await window.blockchainCall(window.stableCoin.token.methods.mint, pairData.index, token0Value, token1Value, token0Slippage, token1Slippage);
        } catch (e) {
            var message = e.message || e;
            if(message.toLowerCase().indexOf('user denied') === -1) {
                errorMessage = message;
            }
        }
        context.view.setState({ approving: null, performing: null }, () => {
            context.view.updateAmounts(originalToken0Value, originalToken1Value);
            errorMessage && setTimeout(() => alert(errorMessage));
        });
    };

    context.performBurn = async function performBurn(pairData, token0Value, token1Value) {
        var originalToken0Value = token0Value;
        var originalToken1Value = token1Value;
        context.view.setState({ approving: null, performing: true }, () => context.view.updateAmounts(originalToken0Value, originalToken1Value));
        var errorMessage;
        try {
            var stableCoinOutput = await context.getStableCoinOutput(pairData, token0Value, token1Value);
            token0Value = window.toDecimals(token0Value.split(',').join(''), pairData.token0.decimals);
            if(parseInt(token0Value) <= 0) {
                throw `You must insert a positive ${pairData.token0.symbol} amount`;
            }
            token1Value = window.toDecimals(token1Value.split(',').join(''), pairData.token1.decimals);
            if(parseInt(token1Value) <= 0) {
                throw `You must insert a positive ${pairData.token1.symbol} amount`;
            }
            var myBalance = await window.blockchainCall(window.stableCoin.token.methods.balanceOf, window.walletAddress);
            if(parseInt(stableCoinOutput) > parseInt(myBalance)) {
                throw `You have insufficient ${window.stableCoin.symbol}`;
            }
            var reserves = await window.blockchainCall(pairData.pair.methods.getReserves);
            var amount = parseInt(token0Value) / parseInt(reserves[0]);
            var totalSupply = await window.blockchainCall(pairData.pair.methods.totalSupply);
            var supplyInPercentage = window.numberToString(parseInt(totalSupply) * amount).split(',').join('').split('.')[0];
            var balance = await window.blockchainCall(pairData.pair.methods.balanceOf, window.stableCoin.address);
            if (parseInt(supplyInPercentage) > parseInt(balance)) {
                return alert(window.stableCoin.symbol + " has insufficient balance to perform this operation");
            }
            var token0Slippage = window.numberToString(parseInt(token0Value) * window.context.slippageAmount).split(',').join('').split('.')[0];
            var token1Slippage = window.numberToString(parseInt(token1Value) * window.context.slippageAmount).split(',').join('').split('.')[0];
            token0Slippage = window.web3.utils.toBN(token0Value).sub(window.web3.utils.toBN(token0Slippage)).toString();
            token1Slippage = window.web3.utils.toBN(token1Value).sub(window.web3.utils.toBN(token1Slippage)).toString();
            await window.blockchainCall(window.stableCoin.token.methods.burn, pairData.index, supplyInPercentage, token0Slippage, token1Slippage);
        } catch (e) {
            var message = e.message || e;
            if(message.toLowerCase().indexOf('user denied') === -1) {
                errorMessage = message;
            }
        }
        context.view.setState({ approving: null, performing: null }, () => {
            context.view.updateAmounts(originalToken0Value, originalToken1Value);
            errorMessage && setTimeout(() => alert(errorMessage));
        });
    };
};