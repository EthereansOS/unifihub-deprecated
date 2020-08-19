var Uusd = React.createClass({
    requiredScripts: [
        'spa/loader.jsx',
        'spa/banner.jsx'
    ],
    requiredModules: [
        'spa/dappMenu'
    ],
    render() {
        return (
                <section className="unifiDapp">
                    <DappMenu/>
                    <section className="UniBox">
                        <section className="UniTitle">
                            <labe>
                                <select>
                                <option value="Mint">Mint</option>
                                <option value="Burn">Burn</option>
                                </select>
                                <img className="UniStableManage" src="assets/img/StableLogo.png"></img>
                                <p><b>uSD </b></p>
                            </labe>
                            <label>
                                <p> by</p>
                                <select>
                                    <option value="Mint">USDC/USDT</option>
                                    <option value="Burn">USDC/DAI</option>
                                    <option value="Burn">USDT/DAI</option>
                                    <option value="Mint">DAI/USDT</option>
                                </select>
                            </label>
                            <h6>You can mint uSD by adding liquidity to whitelisted Uniswap Stable Coin Pools. You can redeem anytime whitelisted Stable Coins by burning uSD.</h6>
                        </section>
                        <section className="UniTierQuantity">
                            <h5>Quantity</h5>
                            <label className="UniActiveQuantityTier">
                                <input></input>
                                <img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"></img>
                                <p>USDC</p>
                            </label>
                            <h6>And</h6>
                            <label className="UniDisactiveQuantityTier">
                                <input></input>
                                <img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"></img>
                                <p>DAI</p>
                            </label>
                            <h5>for <b>100</b>uSD</h5>
                        </section>
                    </section>
                    <section className="UniSideBox">

                    </section>
                </section>
        );
    }
});