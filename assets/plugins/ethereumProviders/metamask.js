var MetamaskEthereumProvider = function MetamaskEthereumProvider() {
    return {
        async retrieveProvider() {
            window.ethereum && window.ethereum.enable();
            var provider = window.web3 && window.web3.currentProvider;
            window.ethereum && window.ethereum.autoRefreshOnNetworkChange && (window.ethereum.autoRefreshOnNetworkChange = false);
            window.ethereum && window.ethereum.on && window.ethereum.on('networkChanged', () => window.onEthereumUpdate(provider));
            window.ethereum && window.ethereum.on && window.ethereum.on('accountsChanged', () => window.onEthereumUpdate(provider));
            return provider;
        }
    };
}();