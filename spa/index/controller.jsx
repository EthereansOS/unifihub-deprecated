var IndexController = function (view) {
    var context = this;
    context.view = view;

    context.loadData = async function loadData() {
        context.view.setState({
            newVotingTokenAddress : window.newToken.token.options.address,
            newVotingTokenSupply : await context.loadSupplies(window.newToken.token, window.context.newTokenExcludeAddresses),
            oldVotingTokenSupply : await context.loadSupplies(window.oldToken.token, window.context.oldTokenExcludeAddresses)
        });

        var currentBlock = parseInt(await window.web3.eth.getBlockNumber());
        var startBlock = parseInt(await window.blockchainCall(window.vasaPowerSwitch.methods.startBlock));
        var approved = !window.walletAddress ? false : parseInt(await window.blockchainCall(window.oldToken.token.methods.allowance, window.walletAddress, window.vasaPowerSwitch.options.address)) > 0;
        var balanceOf = !window.walletAddress ? '0' : await window.blockchainCall(window.oldToken.token.methods.balanceOf, window.walletAddress);
        var totalMintable = await window.blockchainCall(window.vasaPowerSwitch.methods.totalMintable);

        context.view.setState({
            startBlock,
            currentBlock,
            approved,
            balanceOf,
            totalMintable
        });

        var length = await window.blockchainCall(window.vasaPowerSwitch.methods.length);
        var slots = [];
        var currentSlot = null;
        for(var i = 0; i < length; i++) {
            var data = await window.blockchainCall(window.vasaPowerSwitch.methods.timeWindow, i);
            slots.push(data);
            currentBlock >= startBlock && !currentSlot && currentBlock <= parseInt(data[0]) && (currentSlot = data);
        }
        context.view.setState({
            slots,
            currentSlot
        });
    };

    context.loadSupplies = async function loadSupplies(token, exclude) {
        try {
            var totalSupply = window.web3.utils.toBN(await window.blockchainCall(token.methods.totalSupply));
            if(exclude && exclude.length > 0) {
                for(var ex of exclude) {
                    totalSupply = totalSupply.sub(window.web3.utils.toBN(await window.blockchainCall(token.methods.balanceOf, ex)));
                }
            }
            return totalSupply.toString();
        } catch(e) {
            return '0';
        }
    };
};