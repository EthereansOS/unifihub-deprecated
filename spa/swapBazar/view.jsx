var SwapBazar = React.createClass({
    requiredScripts: [
        'spa/loaderMini.jsx'
    ],
    getDefaultSubscriptions() {
        return {
            'ethereum/update': this.controller.loadData
        }
    },
    componentDidMount() {
        this.controller.loadData();
    },
    onClick(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
    },
    renderTokenList(type) {
        return([
            <h4>{type}:</h4>,
            <ul>
                {this.state.tokensList.map((it, i) => <li key={it.key}>
                    <a href="javascript:;" data-type={type} data-index={i} onClick={this.onClick}>{it.name}</a>
                </li>)}
            </ul>
        ]);
    },
    render() {
        return (<section>
            {<iframe ref={ref => window.uniswap = ref} src="https://app.uniswap.org"></iframe>}
            <section className="floatingMenu">
                <h3>Tokens list</h3>
                {!this.state || !this.state.tokensList && <section className="loader">
                    Loading... <LoaderMini />
                </section>}
                {this.state && this.state.tokensList && <section className="tokensList">
                    {this.renderTokenList("From")}
                </section>}
                {this.state && this.state.tokensList && <section className="tokensList">
                    {this.renderTokenList("To")}
                </section>}
            </section>
        </section>);
    }
});