var SwapBazarController = function (view) {
    var context = this;
    context.view = view;

    context.oldDfoDeployedEvent = "DFODeployed(address_indexed,address)";
    context.dfoDeployedEvent = "DFODeployed(address_indexed,address_indexed,address,address)";

    context.loadData = async function loadData() {
        context.view.setState({tokensList : null});
        var log = window.getDFOLog({
            event : context.dfoDeployedEvent,
            topics : [(await window.dfo.proxy).options.allAddresses.map(it => window.web3.utils.sha3(window.web3.utils.toChecksumAddress(it)))]
        });
        console.log(log);
    }
};