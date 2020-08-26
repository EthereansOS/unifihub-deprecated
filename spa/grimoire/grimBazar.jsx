var GrimBazar = React.createClass({
    requiredScripts: [
        'spa/loader.jsx'
    ],
    
    render() {
        return (
            <section className="unifiDapp">
                <DappMenu />
                <section className="grimoireWelcome">
                    <section className="grimoireWelcomeIntern">
                        <img src="assets/img/m1.png"></img>
                        <article id="grimBaz">
                            <h2>The Grimoire - Bazar</h2>
                            <h6><b>Ancient black magic is unleashing the true power of the Unicorn.</b> Programmable Equities, Token Indexes and NFTs (including ERC 1155 NFTs, thanks to ethArt V2) can now be swapped, on the new Bazaar DEX.</h6>
                        </article>
                    </section>
                </section>
                <section className="grimoireBoxAll">
                    <section className="grimoireBox">
                        <ul className="grimoireIndex">
                            <h2>Index</h2>
                            <a href=""><b>Basics</b></a>
                            <a href=""><b>Listing</b></a>
                            <a href=""><b>Uniswap Integration</b></a>
                            <a href=""><b>ethArt V2 Integration</b></a>
                        </ul>
                    </section>
                </section>
            </section>
        );
    }
});