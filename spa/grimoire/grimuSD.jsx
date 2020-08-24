var GrimuSD = React.createClass({
    requiredScripts: [
        'spa/loader.jsx'
    ],
    
    render() {
        return (
            <section className="unifiDapp">
                <DappMenu />
                <section className="grimoireWelcome">
                    <section className="grimoireWelcomeIntern">
                        <img src="assets/img/m4.png"></img>
                        <article>
                            <h2>The Grimoire - Uniswap State Dollar</h2>
                            <h6><b>uSD is a Stable Coin based on Uniswap Liquidity Pools</b> <a href="">Launch Dapp</a> Minted by the magic rainbow of Uniswap stablecoin pools. Backed by the power of the Unicorn, uSD is the most secure stablecoin ever. The only way it could be destabilized is if the entire stablecoin industry crashed.</h6>
                        </article>
                    </section>
                </section>
                <section className="grimoireBoxAll">
                    <section className="grimoireBox">
                        <ul className="grimoireIndex">
                            <h2>Index</h2>
                            <a href=""><b>Basics</b></a>
                            <a href=""><b>Security and Rebalancing</b></a>
                            <a href=""><b>Value Added</b></a>
                            <a href=""><b>APIs and Documentation</b></a>
                        </ul>
                    </section>
                </section>
            </section>
        );
    }
});