var SwapBazarController = function (view) {
    var context = this;
    context.view = view;

    context.oldDfoDeployedEvent = "DFODeployed(address_indexed,address)";
    context.dfoDeployedEvent = "DFODeployed(address_indexed,address_indexed,address,address)";
    context.proxyChangedEvent = "ProxyChanged(address)";

    context.blockSearchSize = 40000;
    context.dfoDeployedEvent = "DFODeployed(address_indexed,address)";
    context.newDfoDeployedEvent = "DFODeployed(address_indexed,address_indexed,address,address)";

    context.loadData = async function loadData() {
        await window.loadEthereumStuff();
        context.view.setState({inputToken : null, outputToken : null, inputPrice : null, outputPrice: null, uniswap: null});
        try {
            context.view.setState({
                tokensList: {
                    "Prog. Equities": (await window.AJAXRequest(window.context.programmableEquitiesURL)).tokens.map(it => it.chainId === window.networkId && it),
                    "Tokens": (await window.AJAXRequest(window.context.uniswapTokensURL)).tokens.map(it => it.chainId === window.networkId && it),
                    Indexes: (await window.AJAXRequest(window.context.indexesURL)).tokens.map(it => it.chainId === window.networkId && it)
                }
            });
        } catch (e) {
            await context.loadDataOnChain();
        }
        context.readAddressBarParams();
    };

    context.readAddressBarParams = async function readAddressBarParams() {
        var token0 = window.addressBarParams.inputCurrency;
        var token1 = window.addressBarParams.outputCurrency;
        var uniswap = window.addressBarParams.action;
        delete window.addressBarParams.token0;
        delete window.addressBarParams.token1;
        delete window.addressBarParams.action;
        if(!token0 && !token1) {
            return;
        }
        token0 && (token0 = window.web3.utils.toChecksumAddress(token0));
        token1 && (token1 = window.web3.utils.toChecksumAddress(token1));
        token1 === token0 && (token1 = undefined);
        uniswap = token1 ? uniswap : undefined;
        var selection = function selection(tokenAddress) {
            if(!tokenAddress) {
                return;
            }
            var keys = Object.keys(context.view.state.tokensList);
            for(var key of keys) {
                var tokens = context.view.state.tokensList[key];
                for(var selected = 0; selected < tokens.length; selected++) {
                    if(window.web3.utils.toChecksumAddress(tokens[selected].address) === tokenAddress) {
                        return {
                            key,
                            selected,
                            token: tokens[selected]
                        }
                    }
                }
            }
        };
        var setState = async function setState(tokenName, tokenAddress) {
            if(!tokenAddress) {
                return;
            }
            var find = selection(tokenAddress);
            if(!find) {
                return;
            }
            var tokenPrice = tokenName + "Price";
            tokenName += "Token";
            var state = {};
            state[tokenName] = find.token;
            state[tokenPrice] = await context.calculatePriceInDollars(state[tokenName]);
            delete find.token;
            context.view.setState(state, function() {
                context.view[tokenName] && context.view[tokenName].setState(find);
            });
        };
        await setState("input", token0);
        await setState("output", token1);
        uniswap && context.view.setState({uniswap});
    };

    context.loadDataOnChain = async function loadDataOnChain() {
        var dfoHub = await window.loadDFO(window.getNetworkElement("dfoAddress"));
        context.dfoHubAddresses = dfoHub.options.allAddresses;
        context.list = {
            dfoHub: {
                key: 'dfoHub',
                token: await window.loadTokenInfos(await window.blockchainCall(dfoHub.methods.getToken), undefined, true)
            }
        };
        context.alreadyLoaded = {};
        await context.loadEvents();
        delete context.alreadyLoaded;
        context.view.setState({ tokensList: null });

        var programmableEquities = Object.values(context.list).map(it => it.token);
        var uniswapTokens = await context.loadUniswapTokens(programmableEquities);
        var indexes = {};

        for (var token of uniswapTokens) {
            await window.loadUniswapPairs(token, indexes);
        }

        for (var token of programmableEquities) {
            await window.loadUniswapPairs(token, indexes);
        }

        await context.recursiveLoadPair(indexes);

        var tokensList = {
            "Prog. Equities": programmableEquities,
            "Tokens": uniswapTokens,
            Indexes: Object.values(indexes)
        };

        context.view.setState({
            tokensList
        });
    };

    context.recursiveLoadPair = async function recursiveLoadPair(globalIndex, localIndex) {
        localIndex = localIndex || globalIndex;
        if (Object.keys(localIndex).length === 0) {
            return;
        }
        var indexes = {};
        for (var pair of Object.values(localIndex)) {
            await window.loadUniswapPairs(pair.address, indexes);
        }
        Object.entries(indexes).forEach(entry => globalIndex[entry[0]] = entry[1]);
        await context.recursiveLoadPair(globalIndex, indexes);
    }

    context.loadUniswapTokens = async function loadUniswapTokens(except) {
        except = except || [];
        var uniwapTokens = [];
        var tokens = (await window.AJAXRequest(window.context.uniwsapOfficialTokensList)).tokens;
        for (var token of tokens) {
            if (window.networkId !== token.chainId) {
                continue;
            }
            uniwapTokens.push({
                key: window.web3.utils.toChecksumAddress(token.address),
                address: window.web3.utils.toChecksumAddress(token.address),
                name: token.name,
                symbol: token.symbol,
                decimals: window.numberToString(token.decimals),
                logo: token.icon
            });
        }
        return uniwapTokens;
    };

    context.contains = function contains(list, address) {
        for (var element of list) {
            if (window.web3.utils.toChecksumAddress(element.address) === window.web3.utils.toChecksumAddress(address)) {
                return true;
            }
        }
        return false;
    };

    context.loadEvents = async function loadEvents(topics, toBlock, lastBlockNumber) {
        if (toBlock === window.getNetworkElement("deploySearchStart")) {
            return;
        }
        lastBlockNumber = lastBlockNumber || await web3.eth.getBlockNumber();
        toBlock = toBlock || lastBlockNumber;
        var fromBlock = toBlock - context.blockSearchSize;
        var startBlock = window.getNetworkElement("deploySearchStart");
        fromBlock = fromBlock > startBlock ? startBlock : toBlock;
        var newEventLogs = await context.getLogs(fromBlock, toBlock, context.newDfoDeployedEvent);
        var oldEventLogs = await context.getLogs(fromBlock, toBlock, context.dfoDeployedEvent);
        (newEventLogs.length > 0 || oldEventLogs.length > 0) && setTimeout(() => {
            try {
                context.view.forceUpdate();
            } catch (e) {
            }
        });
        setTimeout(() => context.loadEvents(topics, fromBlock, lastBlockNumber));
    }

    context.getLogs = async function getLogs(fromBlock, toBlock, event) {
        var logs = await window.getDFOLogs({
            address: context.dfoHubAddresses,
            event,
            fromBlock: '' + fromBlock,
            toBlock: '' + toBlock
        });
        for (var log of logs) {
            if (context.alreadyLoaded[log.data[0].toLowerCase()]) {
                continue;
            }
            context.alreadyLoaded[log.data[0].toLowerCase()] = true;
            var key = log.blockNumber + '_' + log.id;
            var dFO = await window.loadDFO(log.data[0]);
            !context.list[key] && (context.list[key] = {
                key,
                startBlock: log.blockNumber,
                token: await window.loadTokenInfos(await window.blockchainCall(dFO.methods.getToken), undefined, true)
            });
        }
        return logs;
    };

    context.getLatestSearchBlock = function getLatestSearchBlock() {
        return (context.list && Object.keys(context.list).length > 0 && Math.max(...Object.keys(context.list).map(it => parseInt(it.split('_')[0])))) || window.getNetworkElement('deploySearchStart');
    };

    context.calculatePriceInDollars = async function calculatePriceInDollars(token) {
        var ethereumPrice = await window.getEthereumPrice();
        try {
            var priceInDollars = window.fromDecimals((await window.blockchainCall(window.uniswapV2Router.methods.getAmountsOut, window.toDecimals('1', token.decimals), [token.address, window.wethAddress]))[1], 18, true);
            priceInDollars = parseFloat(priceInDollars) * ethereumPrice;
            priceInDollars = window.numberToString(priceInDollars);
            var priceString = window.formatMoney(priceInDollars, 4);
            return priceString === '0' ? priceInDollars : priceString;
        } catch (e) {
            return "notFound";
        }
    };
};