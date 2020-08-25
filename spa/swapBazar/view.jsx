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
        if (e.currentTarget.className.toLowerCase().indexOf('disabled') !== -1) {
            return;
        }
        var uniswap = e.currentTarget.innerHTML.toLowerCase();
        var _this = this;
        this.setState({
            uniswap: null
        }, function () {
            _this.setState({ uniswap });
        });
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
    onToken(token, tokenName) {
        var otherTokenName = (tokenName === 'input' ? 'output' : 'input') + 'Token';
        var otherToken = this.state && this.state[otherTokenName];
        tokenName += "Token";
        var state = {};
        state[tokenName] = token;
        if (token && otherToken && otherToken.address === token.address) {
            state[otherTokenName] = null;
            this[otherTokenName].setState({ key: null, selected: null });
        }
        var _this = this;
        this.setState(state, function () {
            if ((!_this.state.inputToken || !_this.state.outputToken) && _this.state.uniswap) {
                _this.setState({ uniswap: null });
            }
        });
    },
    render() {
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
                        <UniswapTokenPicker ref={ref => this.inputToken = ref} tokensList={this.state.tokensList} onChange={inputToken => this.onToken(inputToken, "input")} />
                    </label>
                    <h5>Output</h5>
                    <label className="UniDisactiveQuantityTier">
                        <UniswapTokenPicker ref={ref => this.outputToken = ref} tokensList={this.state.tokensList} onChange={outputToken => this.onToken(outputToken, "output")} />
                    </label>
                </section>
                <a href="javascript:;" onClick={this.openUniswap} className={"StableITBTN" + ((!this.state || !this.state.inputToken || !this.state.outputToken) && " Disabled")}>Swap</a>
                <a href="javascript:;" onClick={this.openUniswap} className={"StableITBTN" + ((!this.state || !this.state.inputToken || !this.state.outputToken) && " Disabled")}>Pool</a>
            </section>}
        </section>);
    }
});