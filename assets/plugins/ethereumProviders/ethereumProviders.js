var EthereumProviders = function EthereumProviders() {
    return {
        "list": [{
            "name" : "Metamask"
        }, {
            "name" : "WalletConnect",
            "reconnectionNotSupported": true
        }, {
            "name" : "Fortmatic",
            "disabled" : true
        }, {
            "name" : "Portis",
            "disabled" : true
        }, {
            "name" : "Coinbase",
            "disabled" : true
        }],
        activate(wallet) {
            if (!wallet) {
                return;
            }
            return new Promise(function(ok, ko) {
                try {
                    wallet.script = wallet.script || "assets/plugins/ethereumProviders/" + wallet.name.split(' ').join('').firstLetterToLowerCase() + ".js";
                    wallet.scriptName = wallet.scriptName || wallet.name.split(' ').join('') + 'EthereumProvider';
                    ScriptLoader.load({
                        scripts: [wallet.script],
                        async callback() {
                            try {
                                var provider = await window[wallet.scriptName].retrieveProvider();
                                delete window.networkId;
                                await window.onEthereumUpdate(provider);
                                return ok();
                            } catch (e) {
                                return ko(e);
                            }
                        }
                    });
                } catch (e) {
                    return ko(e);
                }
            });
        }
    }
}();