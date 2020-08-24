var Grimoire = React.createClass({
    requiredScripts: [
        'spa/loader.jsx'
    ],
    
    render() {
        return (
            <section className="unifiDapp">
                <DappMenu />
                <section className="grimoireWelcome">
                    <section className="grimoireWelcomeIntern">
                        <img src="assets/img/m0.png"></img>
                        <article>
                            <h2>The Grimoire</h2>
                            <h6><b>The comprehensive giude to use the Uniswap Magic</b> <br></br>Here, you can find every info needed to understand UniFi and to integrate your dapp with this protocol.</h6>
                        </article>
                    </section>
                </section>
                <section className="grimoireBoxAll">
                    <section className="grimoireBox">
                        <ul className="grimoireIndex">
                            <a>Stable Coin: Uniswap State Dollar</a>
                            <a>Crafting: Programmable Liquidity</a>
                            <a>ILO: Initial Liquidity Offering</a>
                            <a>Bazaar: Uniswap Advanced Listing</a>
                        </ul>
                    </section>

                </section>
            </section>
        );
    }
});