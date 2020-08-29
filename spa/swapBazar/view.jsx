var SwapBazar = React.createClass({
    requiredScripts: [
        'spa/loader.jsx',
        'spa/swapBazar/uniswapTokenPicker.jsx',
        'spa/grimoire/grimBazar.jsx'
    ],
    getDefaultSubscriptions() {
        return {
            'ethereum/update': this.controller.loadData
        }
    },
    componentDidMount() {
        this.mounted = true;
        this.controller.loadData();
    },
    componentWillUnmount() {
        delete this.mounted;
    },
    openUniswap(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        if (e.currentTarget.className.toLowerCase().indexOf('disabled') !== -1) {
            return;
        }
        var uniswap = e.currentTarget.dataset.action;
        var _this = this;
        this.setState({
            uniswap: null
        }, function () {
            _this.setState({ uniswap });
        });
    },
    closeUniswap(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        this.setState({ uniswap: null });
    },
    onToken(token, tokenName) {
        var otherTokenPrice = (tokenName === 'input' ? 'output' : 'input') + 'Price';
        var otherTokenName = (tokenName === 'input' ? 'output' : 'input') + 'Token';
        var otherToken = this.state && this.state[otherTokenName];
        var tokenPrice = tokenName + 'Price';
        tokenName += "Token";
        var state = {};
        state[tokenName] = token;
        state[tokenPrice] = null;
        if (token && otherToken && otherToken.address === token.address) {
            state[otherTokenName] = null;
            state[otherTokenPrice] = null;
            this[otherTokenName].setState({ key: null, selected: null });
        }
        var _this = this;
        this.setState(state, function () {
            if ((!_this.state.inputToken || !_this.state.outputToken) && _this.state.uniswap) {
                _this.setState({ uniswap: null });
            }
            if(!token) {
                return;
            }
            _this.controller.calculatePriceInDollars(token).then(function(priceInDollars) {
                var state = {};
                state[tokenPrice] = priceInDollars;
                _this.setState(state);
            });
        });
    },
    toggleGrimoire(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        this.setState({ grimoire: !(this.state && this.state.grimoire) });
    },
    renderUniswapLink() {
        return window.context[this.state.uniswap === 'swap' ? "uniswapDappLinkTemplate" : "uniswapDappLinkTemplatePool"].format(this.state.uniswap, this.state.inputToken.address, this.state.outputToken.address, window.localStorage.boomerMode === 'true' ? 'light' : 'dark');
    },
    componentDidUpdate() {
        var _this = this;
        _this.state && _this.state.uniswap && _this.uniswapLoader && setTimeout(function() {
            $(_this.uniswapLoader).css('display', 'none');
        }, 2000);
    },
    render() {
        return (<section className="unifiDapp">
            <DappMenu />
            <section className="CallToGrim">
                <section>
                    <a href="javascript:;" onClick={this.toggleGrimoire}>
                        {this.state && this.state.grimoire && <img src="assets/img/m0.png"></img>}
                        {(!this.state || !this.state.grimoire) && <img src="assets/img/m0.png"></img>}
                    </a>
                </section>
            </section>
            <section className="StableCoinTitle">
                <section className="StableCoinTitleIntern">
                    <img src="assets/img/m1.png"></img>
                    <article>
                        <h2>The Bazar</h2>
                        <h6><b>Ancient black magic is unleashing the true power of the Unicorn.</b> Programmable Equities, Token Indexes and NFTs (including ERC 1155 NFTs, thanks to ethArt V2) can now be swapped, on the new Bazaar DEX.</h6>
                    </article>
                </section>
            </section>
            {this.state && this.state.uniswap && this.state.inputToken && this.state.outputToken && 
            <section className="ArrivaUniswapQuelloVero">
                <a className="SeneVaUniswap" href="javascript:;" onClick={this.closeUniswap}>X</a>
                <iframe src={this.renderUniswapLink()}></iframe>
                <section ref={ref => this.uniswapLoader = ref} className="ArrivaUniswap">
                    <img src="assets/img/loader2.gif"></img>
                </section>
            </section>}
            {(!this.state || !this.state.tokensList) && <Loader />}
            {this.state && this.state.tokensList && <section className="UniBox">
                <section className="UniTitle">
                </section>
                <section className="UniTierQuantity">
                    <h5>From</h5>
                    <label className="UniActiveQuantityTier">
                        <UniswapTokenPicker ref={ref => this.inputToken = ref} tokensList={this.state.tokensList} onChange={inputToken => this.onToken(inputToken, "input")} />
                        {this.state && this.state.inputPrice && <span className="BazPrice">{this.state.inputPrice === 'notFound' ? "Price not found" : `Price: ${"$"}${this.state.inputPrice}`}</span>}
                    </label>
                    <h5>To</h5>
                    <label className="UniDisactiveQuantityTier">
                        <UniswapTokenPicker ref={ref => this.outputToken = ref} tokensList={this.state.tokensList} onChange={outputToken => this.onToken(outputToken, "output")} />
                        {this.state && this.state.outputPrice && <span className="BazPrice">{this.state.outputPrice === 'notFound' ? "Price not found" : `Price: ${"$"}${this.state.outputPrice}`}</span>}
                    </label>
                </section>
                <section className="BazzActions">
                    <a href="javascript:;" onClick={this.openUniswap} data-action="swap" className={"StableITBTN" + ((!this.state || !this.state.inputToken || !this.state.outputToken) ? "Disabled" : "Active StableITBTN")}>Swap</a><br></br>
                    <a href="javascript:;" onClick={this.openUniswap} data-action="add" className={"StableITBTNF" + ((!this.state || !this.state.inputToken || !this.state.outputToken) ? "Disabled" : "Active StableITBTN")}>Add Liquidity</a>
                    <a href="javascript:;" onClick={this.openUniswap} data-action="remove" className={"StableITBTNF" + ((!this.state || !this.state.inputToken || !this.state.outputToken) ? "Disabled" : "Active StableITBTN")}>Remove Liquidity</a>
                    <p className={"BazzPreDesc" + ((!this.state || !this.state.inputToken || !this.state.outputToken) ? " ActiveDesc" : "Disabled")}>Select Tiers to Swap or Manage Liquidity</p>
                </section>
            </section>}
                {this.state && this.state.grimoire && <GrimBazar/>}
        </section>);
    }
});