var StableCoin = React.createClass({
    requiredScripts: [
        'spa/loader.jsx',
        'spa/banner.jsx',
        'spa/loaderMini.jsx'
    ],
    requiredModules: [
        'spa/dappMenu'
    ],
    getDefaultSubscriptions() {
        return {
            'ethereum/update': this.controller.loadData,
            'ethereum/ping': () => this.state && this.state.selectedPair && this.controller.checkApprove(this.state.selectedPair)
        }
    },
    componentDidMount() {
        this.controller.loadData();
    },
    onPairChange(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        var _this = this;
        this.setState({ selectedPair: this.state.pairs[e.currentTarget.value], token0Approved: null, token1Approved: null }, function () {
            $(_this.domRoot).children().find('input[data-token="0"]')[0].value = '0.00';
            $(_this.domRoot).children().find('input[data-token="1"]')[0].value = '0.00';
            _this.controller.checkApprove(_this.state.selectedPair);
        });
    },
    onType(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        var _this = this;
        var target = e.currentTarget;
        _this.onTypeTimeout && window.clearTimeout(_this.onTypeTimeout);
        _this.onTypeTimeout = setTimeout(function () {
            _this.controller.calculateOtherPair(_this.state.selectedPair, target.dataset.token, target.value, _this.actionSelect.value).then(result => {
                $(_this.domRoot).children().find('input[data-token="' + (target.dataset.token === "0" ? "1" : "0") + '"]')[0].value = window.formatMoney(window.fromDecimals(result, _this.state.selectedPair["token" + (target.dataset.token === "0" ? "1" : "0")].decimals, true), 6);
                _this.refreshStableCoinOutput();
            });
        }, window.context.typeTimeout);
    },
    refreshStableCoinOutput() {
        var token0Value = $(this.domRoot).children().find('input[data-token="0"]')[0].value;
        var token1Value = $(this.domRoot).children().find('input[data-token="1"]')[0].value;
        var result = this.controller.getStableCoinOutput(this.state.selectedPair, token0Value, token1Value);
        this.stableCoinOutput.innerHTML = window.formatMoney(window.fromDecimals(result, window.stableCoin.decimals, true), 6);
    },
    doAction(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        var token0Value = $(this.domRoot).children().find('input[data-token="0"]')[0].value;
        var token1Value = $(this.domRoot).children().find('input[data-token="1"]')[0].value;
        this.controller["perform" + this.actionSelect.value](this.state.selectedPair, token0Value, token1Value);
    },
    approve(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        var token0Value = $(this.domRoot).children().find('input[data-token="0"]')[0].value;
        var token1Value = $(this.domRoot).children().find('input[data-token="1"]')[0].value;
        this.controller.approve(this.state.selectedPair, e.currentTarget.dataset.token, token0Value, token1Value);
    },
    rebalance(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        this.controller.rebalance();
    },
    render() {
        return (
            <section className="unifiDapp">
                <DappMenu />
                <section className="UniBox">
                    <section className="UniTitle">
                        <labe>
                            <select ref={ref => this.actionSelect = ref}>
                                <option value="Mint">Mint</option>
                                <option value="Burn">Burn</option>
                            </select>
                            <img className="UniStableManage" src={window.stableCoin.logo}></img>
                            <p><b>{window.stableCoin.symbol}</b></p>
                        </labe>
                        <label>
                            <p> by</p>
                            <select onChange={this.onPairChange}>
                                {this.state && this.state.pairs && this.state.pairs.map((it, i) => <option key={it.name} value={i}>
                                    {it.name}
                                </option>)}
                            </select>
                        </label>
                        <h6>You can mint uSD by adding liquidity to whitelisted Uniswap Stable Coin Pools. You can redeem anytime whitelisted Stable Coins by burning uSD.</h6>
                    </section>
                    {this.state && this.state.selectedPair && <section className="UniTierQuantity">
                        <h5>Quantity</h5>
                        <label className="UniActiveQuantityTier">
                            <input data-token="0" onChange={this.onType} />
                            <img src={this.state.selectedPair.token0.logo} />
                            <p>{this.state.selectedPair.token0.symbol}</p>
                            {(!this.state.token0Approved && (this.state.approving === undefined || this.state.approving === null) && !this.state.performing) && <a href="javascript:;" onClick={this.approve} data-token="0">Approve</a>}
                            {this.state.approving === '0' && <LoaderMini />}
                        </label>
                        <h6>And</h6>
                        <label className="UniDisactiveQuantityTier">
                            <input data-token="1" onChange={this.onType} />
                            <img src={this.state.selectedPair.token1.logo} />
                            <p>{this.state.selectedPair.token1.symbol}</p>
                            {(!this.state.token1Approved && (this.state.approving === undefined || this.state.approving === null) && !this.state.performing) && <a href="javascript:;" onClick={this.approve} data-token="1">Approve</a>}
                            {this.state.approving === '1' && <LoaderMini />}
                        </label>
                        <h5>for <b ref={ref => this.stableCoinOutput = ref}></b>{'\u00a0'}{window.stableCoin.symbol}</h5>
                        {this.state.token0Approved && this.state.token1Approved && !this.state.performing && <a href="javascript:;" onClick={this.doAction}>GO</a>}
                        {this.state.performing && <LoaderMini />}
                    </section>}
                </section>
                <section className="UniSideBox">
                    {this.state && this.state.differences && <section>
                        <h4>Differences</h4>
                        <label>
                            Redeemable:
                                <span>{window.fromDecimals(this.state.differences[0], window.stableCoin.decimals)}</span>
                        </label>
                        <label>
                            Burnable:
                                <span>{window.fromDecimals(this.state.differences[1], window.stableCoin.decimals)}</span>
                        </label>
                        {(this.state.differences[0] !== '0' || this.state.differences[1] !== '0') && <a href="javascript:;" onClick={this.rebalance}>Rebalance</a>}
                    </section>}
                    {this.state && this.state.totalSupply && <section>
                        <h4>Total Supply:</h4>
                        <span>{window.fromDecimals(this.state.totalSupply, window.stableCoin.decimals)}</span>
                    </section>}
                </section>
            </section>
        );
    }
});