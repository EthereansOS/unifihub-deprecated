var EthereumWalletProvider = React.createClass({
    requiredScripts: [
        'assets/plugins/ethereumProviders/ethereumProviders.js'
    ],
    changeWallet(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        var i = parseInt(e.currentTarget.dataset.index);
        var _this = this;
        window.EthereumProviders.activate(this.state.wallets[i]).then(function (error) {
            if (error) {
                return alert(error);
            }
            _this.setState({ selected: i });
        });
    },
    componentDidMount() {
        window.EthereumProviders && this.setState({
            wallets: window.EthereumProviders.list,
            selected: parseInt(window.localStorage.selectedEthereumProvider)
        })
    },
    render() {
        return (
            <section className="coverMenu">
                <section>
                    {this.state && this.state.wallets.map((it, i) => {
                        return !it.disabled && <li key={it.name}>
                            <section>
                                {this.state.selected === i && <img src={window.resolveImageURL("mk")} />}
                                <a href="javascript:;" data-index={i} onClick={this.changeWallet}>{it.name}</a>
                            </section>
                        </li>
                    })}
                </section>
            </section>);
    }
});