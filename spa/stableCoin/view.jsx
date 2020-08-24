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
        this.stableCoinOutput.innerHTML = window.formatMoney(window.fromDecimals(result, window.stableCoin.decimals, true), 2);
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
        if (!this.state || !this.state.availableToMint) {
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
    toggleTotalCoins(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        this.setState({ toggleTotalCoins: this.state && this.state.toggleTotalCoins ? null : true });
    },
    max(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        var _this = this;
        var token = e.currentTarget.dataset.token;
        this.controller.getBalance(this.state.selectedPair).then(function () {
            var input = $(_this.domRoot).children().find(`input[data-token="${token}"]`)[0];
            var max = _this.state.selectedPair["token" + token].balance;
            input.value = window.fromDecimals(max, _this.state.selectedPair["token" + token].decimals, true);
            _this.onType({
                currentTarget: input
            });
        });
    },
    rebalanceByDebt(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        this.controller.rebalanceByDebt(this.rebalanceByDebtInput.value);
    },
    rebalanceByDebtInputChange(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        var _this = this;
        var target = e.currentTarget;
        _this.onTypeTimeout && window.clearTimeout(_this.onTypeTimeout);
        _this.onTypeTimeout = setTimeout(function () {
            _this.controller.calculateRebalanceByDebtReward(target.value).then(function(result) {
                _this.debtReward.innerHTML = window.fromDecimals(result, window.dfo.decimals);
            });
        }, window.context.typeTimeout);
    },
    render() {
        return (
            <section className="unifiDapp">
                <DappMenu />
                <section className="StableCoinTitle">
                    <section className="StableCoinTitleIntern">
                        <img src="assets/img/m4.png"></img>
                        <article>
                            <h2>Uniswap State Dollar</h2>
                            <h6><b>uSD is a Stable Coin based on Uniswap Liquidity Pools</b> <a href="">More</a> <br></br>Here, you can mint uSD by adding liquidity to whitelisted Uniswap Stable Coin Pools or redeem anytime whitelisted Stable Coins by burning uSD.</h6>
                        </article>
                    </section>
                </section>
                {!this.state || !this.state.selectedPair && <Loader loaderClass="loaderRegular" loaderImg={window.resolveImageURL("loader3", "gif")} />}
                {this.state && this.state.selectedPair && <section className="UniBox">
                    <section className="UniTitle">
                        <label>
                            <select ref={ref => this.actionSelect = ref}>
                                <option value="Mint">Mint</option>
                                <option value="Burn">Burn</option>
                            </select>
                            <img className="UniStableManage" src={window.stableCoin.logo}></img>
                            <p><b>{window.stableCoin.symbol}</b></p>
                        </label>
                        <label>
                            <p> by</p>
                            <select onChange={this.onPairChange}>
                                {this.state && this.state.pairs && this.state.pairs.map((it, i) => <option key={it.name} value={i}>
                                    {it.name}
                                </option>)}
                            </select>
                        </label>
                    </section>
                    <section className="UniTierQuantity">
                        <label className="UniActiveQuantityTier">
                            <input data-token="0" onChange={this.onType} />
                            <img src={this.state.selectedPair.token0.logo} />
                            <p>{this.state.selectedPair.token0.symbol}</p>
                            {window.walletAddress && <h6><a href="javascript:;" data-token="0" onClick={this.max}>Max</a> Balance: {window.fromDecimals(this.state.selectedPair.token0.balance, this.state.selectedPair.token0.decimals)} {this.state.selectedPair.token0.symbol}</h6>}
                        </label>
                        <h5>And</h5>
                        <label className="UniDisactiveQuantityTier">
                            <input data-token="1" onChange={this.onType} />
                            <img src={this.state.selectedPair.token1.logo} />
                            <p>{this.state.selectedPair.token1.symbol}</p>
                            {window.walletAddress && <h6><a href="javascript:;" data-token="1" onClick={this.max}>Max</a> Balance: {window.fromDecimals(this.state.selectedPair.token1.balance, this.state.selectedPair.token1.decimals)} {this.state.selectedPair.token1.symbol}</h6>}
                        </label>
                        <h2>for <b ref={ref => this.stableCoinOutput = ref}>0</b>{'\u00a0'}{window.stableCoin.symbol}</h2>
                        {window.walletAddress && (!this.state.token0Approved || this.state.token1Approved) && (this.state.approving === undefined || this.state.approving === null) && <a className="approveBTN" href="javascript:;" onClick={this.approve} data-token="0" className={this.state.token0Approved ? "approveBTN Disabled" : "approveBTN"}>Approve {this.state.selectedPair.token0.symbol}</a>}
                        {window.walletAddress && this.state.token0Approved && !this.state.token1Approved && (this.state.approving === undefined || this.state.approving === null) && <a className="approveBTN" href="javascript:;" onClick={this.approve} data-token="1">Approve {this.state.selectedPair.token1.symbol}</a>}
                        {this.state.approving !== undefined && this.state.approving !== null && <Loader loaderClass="loaderMini" loaderImg={window.resolveImageURL("loader4", "gif")} />}
                        {window.walletAddress && !this.state.performing && <a href="javascript:;" onClick={this.doAction} className={!this.state.token0Approved || !this.state.token1Approved ? "StableITBTN Disabled" : "StableITBTN"}>GO</a>}
                        {this.state.performing && <Loader loaderClass="loaderMini" loaderImg={window.resolveImageURL("loader3", "gif")} />}
                    </section>
                </section>}
                {this.state && this.state.selectedPair && <section className="UniSideBox">
                    {this.state && this.state.priceInDollars && <section className="SideStandard">
                        <h4>1 {window.stableCoin.symbol}: <b>${window.formatMoney(this.state.priceInDollars, 2)}</b></h4>
                    </section>}
                    {this.state && this.state.totalSupply && <section className="SideStandard">
                        <h5>Supply:</h5>
                        <h6>{window.fromDecimals(this.state.totalSupply, window.stableCoin.decimals)} {window.stableCoin.symbol}</h6>
                    </section>}
                    {this.renderAvailableToMint()}
                    {this.state && this.state.totalCoins && <section className="SideStandard">
                        <h5>Collateral:</h5>
                        <h6><a href="javascript:;" onClick={this.toggleTotalCoins}>{window.fromDecimals(this.state.totalCoins.amount, window.stableCoin.decimals)} S.C.</a></h6>
                        {this.state.toggleTotalCoins && <ul className="SideStableList">
                            {Object.values(this.state.totalCoins.list).map(it => <li key={it.address}>
                                <section>
                                    <span>{window.fromDecimals(it.amount, window.stableCoin.decimals)}</span>
                                    {'\u00a0'}
                                    <span>{it.symbol}</span>
                                </section>
                            </li>)}
                        </ul>}
                    </section>}
                    {this.state && this.state.totalCoins && <section className="SideStandard">
                        <h4>Health:</h4>
                        <section className="SideHealthHelp">
                            <section className="SideHealth"><aside style={{"width": this.state.totalCoins.healthPercentage + "%"}}><span>{this.state.totalCoins.regularPercentage}%</span></aside></section>
                        </section>
                    </section>}
                    {window.walletAddress && this.state && this.state.pairs && this.state.totalCoins && this.state.differences && (this.state.differences[0] !== '0' || this.state.differences[1] !== '0') && <section className="SideDiff">
                        <h4>Rebalance</h4>
                        {parseInt(this.state.totalCoins.regularPercentage) < 97 && <section className="SideRebelanceBro SideCredit">
                            <label>
                                <h5>DFO Credit:</h5>
                                <h6><b>{window.fromDecimals(this.state.differences[0], window.stableCoin.decimals)} {window.stableCoin.symbol}</b></h6>
                            </label>
                            {window.walletAddress && <section>
                                <a href="javascript:;" onClick={this.controller.rebalanceByCredit} className="StableITBTN">Rebalance</a>
                            </section>}
                        </section>}
                        {parseInt(this.state.totalCoins.regularPercentage) > 101 && <section className="SideRebelanceBro SideDebit">
                            <label>
                                <h5>DFO Debt:</h5>
                                <h6><b>{window.fromDecimals(this.state.differences[1], window.stableCoin.decimals)} {window.stableCoin.symbol}</b></h6>
                            </label>
                            {window.walletAddress && <section className="RebalanceEmergency">
                                <label>
                                    <span>&#128293;</span>
                                    <input onChange={this.rebalanceByDebtInputChange} ref={ref => this.rebalanceByDebtInput = ref}/>
                                    <span>{window.stableCoin.symbol}</span>
                                </label>
                                <section className="RebalanceEmergencyRew">
                                    <span>Reward: </span>
                                    <span ref={ref => this.debtReward = ref}></span>
                                    <span> {window.dfo.symbol}</span>
                                </section>
                                <a href="javascript:;" onClick={this.rebalanceByDebt} className="StableITBTN">Rebalance</a>
                            </section>}
                        </section>}
                    </section>}
                    <p className="Disclamerone">This protocol is built using a <a target="_blank" href="https://github.com/b-u-i-d-l/responsible-defi">Responsable DeFi</a> approach. But it's new, so use it at your own risk and remember, in Ethereum transactions are irreversible.</p>
                </section>}
            </section>
        );
    }
});