var EthereumWalletProvider = React.createClass({
    requiredScripts: [
        'assets/plugins/ethereumProviders/ethereumProviders.js'
    ],
    changeWallet(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        var i = parseInt(e.currentTarget.dataset.index);
        var _this = this;
        window.localStorage.removeItem("selectedEthereumProvider");
        window.EthereumProviders.activate(this.state.wallets[i]).then(function(error) {
            if(error) {
                return alert(error);
            }
            _this.setState({selected : i}, function() {
                !_this.state.wallets[i].reconnectionNotSupported && window.localStorage.setItem("selectedEthereumProvider", i + '');
            });
        });
    },
    componentDidMount() {
        window.EthereumProviders && this.setState({
            wallets: window.EthereumProviders.list,
            selected : parseInt(window.localStorage.selectedEthereumProvider)
        }, function() {
            window.EthereumProviders.activate(this.state.wallets[this.state.selected]);
        })
    },
    render() {
        return (
        <section>
            <h3>Choose Your Ethereum Connection Provider:</h3>
            <section>
                <ul>
                    {this.state && this.state.wallets.map((it, i) => {return !it.disabled && <li key={it.name}>
                        <section>
                            {this.state.selected === i && <img src={window.resolveImageURL("mk")}/>}
                            <a href="javascript:;" data-index={i} onClick={this.changeWallet}>{it.name}</a>
                        </section>
                    </li>})}
                </ul>
            </section>
        </section>);
    }
});