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
                            <h2>Uniswap State Dollar</h2>
                            <h6><b>uSD is a Stable Coin based on Uniswap Liquidity Pools</b> <a href="">More</a> <br></br>Here, you can mint uSD by adding liquidity to whitelisted Uniswap Stable Coin Pools or redeem anytime whitelisted Stable Coins by burning uSD.</h6>
                        </article>
                    </section>
                </section>
                <section className="grimoireIndex">

                </section>
            </section>
        );
    }
});