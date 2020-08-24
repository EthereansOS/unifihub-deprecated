var SwapBazar = React.createClass({
    requiredScripts: [
        'spa/loader.jsx',
        'spa/swapBazar/uniswapTokenPicker.jsx'
    ],
    getDefaultSubscriptions() {
        return {
            'ethereum/update': this.controller.loadData
        }
    },
    componentDidMount() {
        this.controller.loadData();
    },
    openUniswap(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        this.setState({ uniswap: e.currentTarget.innerHTML.toLowerCase() });
    },
    close(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        this.setState({ uniswap: null });
    },
    onInputToken(inputToken) {
        var state = { inputToken };
        if (inputToken && this.state.outputToken && this.state.outputToken.address === inputToken.address) {
            state.outputToken = null;
            this.outputToken.setState({ key: null, selected: null });
        }
        this.setState(state);
    },
    onOutputToken(outputToken) {
        var state = { outputToken };
        if (outputToken && this.state.inputToken && this.state.inputToken.address === outputToken.address) {
            state.inputToken = null;
            this.inputToken.setState({ key: null, selected: null });
        }
        this.setState(state);
    },
    render() {
        var _this = this;
        return (<section>
            {this.state && this.state.uniswap && this.state.inputToken && this.state.outputToken && <section>
                <a href="javascript:;" onClick={this.close}>X</a>
                <iframe src={window.context.uniswapDappLinkTemplate.format(this.state.uniswap, this.state.inputToken.address, this.state.outputToken.address)}></iframe>
            </section>}
            {(!this.state || !this.state.tokensList) && <Loader />}
            {this.state && this.state.tokensList && <section className="UniBox">
                <section className="UniTitle">
                </section>
                <section className="UniTierQuantity">
                    <h5>Input</h5>
                    <label className="UniActiveQuantityTier">
                        <UniswapTokenPicker ref={ref => this.inputToken = ref} tokensList={this.state.tokensList} onChange={this.onInputToken} />
                    </label>
                    <h5>Output</h5>
                    <label className="UniDisactiveQuantityTier">
                        <UniswapTokenPicker ref={ref => this.outputToken = ref} tokensList={this.state.tokensList} onChange={this.onOutputToken} />
                    </label>
                </section>
                <a href="javascript:;" onClick={this.openUniswap} className={"StableITBTN" + ((!this.state || !this.state.inputToken || !this.state.outputToken) && " Disabled")}>Swap</a>
                <a href="javascript:;" onClick={this.openUniswap} className={"StableITBTN" + ((!this.state || !this.state.inputToken || !this.state.outputToken) && " Disabled")}>Pool</a>
            </section>}
        </section>);
    }
});