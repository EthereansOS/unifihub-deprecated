var StableCoin = React.createClass({
    requiredScripts: [
        'spa/banner.jsx',
        'spa/loader.jsx'
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
            $(_this.domRoot).children().find('input[data-token="0"]')[0].dataset.value = '0';
            $(_this.domRoot).children().find('input[data-token="1"]')[0].value = '0.00';
            $(_this.domRoot).children().find('input[data-token="1"]')[0].dataset.value = '0';
            _this.controller.checkApprove(_this.state.selectedPair);
        });
    },
    onType(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        var _this = this;
        var target = e.currentTarget;
        _this.onTypeTimeout && window.clearTimeout(_this.onTypeTimeout);
        _this.onTypeTimeout = setTimeout(function () {
            target.dataset.value = window.toDecimals(target.value, _this.state.selectedPair["token" + target.dataset.token].decimals);
            _this.controller.calculateOtherPair(_this.state.selectedPair, target.dataset.token, target.value, _this.actionSelect.value).then(result => {
                var otherId = (target.dataset.token === "0" ? "1" : "0");
                var otherTarget = $(_this.domRoot).children().find('input[data-token="' + otherId + '"]')[0];
                otherTarget.dataset.value = result;
                otherTarget.value = window.formatMoney(window.fromDecimals(result, _this.state.selectedPair["token" + otherId].decimals, true), 6);
                _this.refreshStableCoinOutput();
            });
        }, window.context.typeTimeout);
    },
    refreshStableCoinOutput() {
        var token0Value = $(this.domRoot).children().find('input[data-token="0"]')[0].dataset.value;
        var token1Value = $(this.domRoot).children().find('input[data-token="1"]')[0].dataset.value;
        var result = this.controller.getStableCoinOutput(this.state.selectedPair, token0Value, token1Value);
        this.stableCoinOutput.innerHTML = window.formatMoney(window.fromDecimals(result, window.stableCoin.decimals, true), 6);
    },
    doAction(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        if (e.currentTarget.className.toLowerCase().indexOf("disabled") !== -1) {
            return;
        }
        var token0Value = $(this.domRoot).children().find('input[data-token="0"]')[0].dataset.value;
        var token1Value = $(this.domRoot).children().find('input[data-token="1"]')[0].dataset.value;
        this.controller["perform" + this.actionSelect.value](this.state.selectedPair, token0Value, token1Value);
    },
    approve(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        if (e.currentTarget.className.toLowerCase().indexOf("disabled") !== -1) {
            return;
        }
        this.controller.approve(this.state.selectedPair, e.currentTarget.dataset.token);
    },
    rebalance(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        this.controller.rebalance();
    },
    renderAvailableToMint() {
        if(!this.state || !this.state.availableToMint) {
            return;
        }
        if (parseInt(this.state.availableToMint) + parseInt(this.state.totalSupply) === 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff) {
            return;
        }
        return (
            <section>
                <h4>Still available to Mint:</h4>
                <span>{window.fromDecimals(this.state.availableToMint, window.stableCoin.decimals)} {window.stableCoin.symbol}</span>
            </section>
        );
    },
    render() {
        return (
            <section className="unifiDapp">
                <DappMenu />
                <section className="StableCoinTitle">
                    <section className="StableCoinTitleIntern">
                        <h2><img src="assets/img/m4.png"></img>Uniswap State Dollar</h2>
                        <h6>uSD is a Stable Coin based on Uniswap Liquidity Pools <a>More</a> | Here, you can mint uSD by adding liquidity to whitelisted Uniswap Stable Coin Pools or redeem anytime whitelisted Stable Coins by burning uSD.</h6>
                    </section>
                </section>
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
                    </section>
                    {this.state && this.state.selectedPair && <section className="UniTierQuantity">
                        <h5>Quantity</h5>
                        <label className="UniActiveQuantityTier">
                            <input data-token="0" onChange={this.onType} />
                            <img src={this.state.selectedPair.token0.logo} />
                            <p>{this.state.selectedPair.token0.symbol}</p>
                        </label>
                        <h6>And</h6>
                        <label className="UniDisactiveQuantityTier">
                            <input data-token="1" onChange={this.onType} />
                            <img src={this.state.selectedPair.token1.logo} />
                            <p>{this.state.selectedPair.token1.symbol}</p>
                        </label>
                        <h5>for <b ref={ref => this.stableCoinOutput = ref}>0</b>{'\u00a0'}{window.stableCoin.symbol}</h5>
                        {(!this.state.token0Approved || this.state.token1Approved) && (this.state.approving === undefined || this.state.approving === null) && <a href="javascript:;" onClick={this.approve} data-token="0" className={this.state.token0Approved ? "Disabled" : ""}>Approve {this.state.selectedPair.token0.symbol}</a>}
                        {this.state.token0Approved && !this.state.token1Approved && (this.state.approving === undefined || this.state.approving === null) && <a href="javascript:;" onClick={this.approve} data-token="1">Approve {this.state.selectedPair.token1.symbol}</a>}
                        {this.state.approving !== undefined && this.state.approving !== null && <LoaderMini />}
                        {!this.state.performing && <a href="javascript:;" onClick={this.doAction} className={!this.state.token0Approved || !this.state.token1Approved ? "Disabled" : ""}>GO</a>}
                        {this.state.performing && <LoaderMini />}
                    </section>}
                </section>
                <section className="UniSideBox">
                    {this.state && this.state.pairs && this.state.differences && <section>
                        <h4>Differences</h4>
                        <label>
                            Credit:
                                <span>{window.fromDecimals(this.state.differences[0], window.stableCoin.decimals)} {window.stableCoin.symbol}</span>
                        </label>
                        {'\u00a0'}
                        <label>
                            Debt:
                                <span>{window.fromDecimals(this.state.differences[1], window.stableCoin.decimals)} {window.stableCoin.symbol}</span>
                        </label>
                        {(this.state.differences[0] !== '0' || this.state.differences[1] !== '0') && <a href="javascript:;" onClick={this.rebalance}>Rebalance</a>}
                    </section>}
                    {this.state && this.state.totalSupply && <section>
                        <h4>Total Supply:</h4>
                        <span>{window.fromDecimals(this.state.totalSupply, window.stableCoin.decimals)} {window.stableCoin.symbol}</span>
                    </section>}
                    {this.renderAvailableToMint()}
                </section>
            </section>
        );
    }
});