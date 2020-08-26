var GrimBazar = React.createClass({
    requiredScripts: [
        'spa/loader.jsx'
    ],
    
    render() {
        return (
            <section>
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
                            <a href="#Bazbasics"><b>Basics</b></a>
                            <a href=""><b>Listing</b></a>
                            <a href=""><b>Uniswap Integration</b></a>
                            <a href=""><b>ethArt V2 Integration</b></a>
                        </ul>
                        <article className="grimoireArticle" id="Bazbasics">
                            <h2>Basics</h2>
                            <p>Programmable Liquidity is an exciting feature in AMMs, but if it impacts the AMM itself, this can introduce bugs due to math complexities (like what happened with Balancer). UniFi crafting aims to achieve Programmable Liquidity, but using Uniswap as a base layer. This helps liquidity providers customize their investment, and empower new applications on top of Uniswap.</p>
                            <p>Uniswap accepts liquidity pools composed of 50:50 asset ratios. This is the most secure setup for an AMM, except for some cases. However, this setup disincentivizes liquidity provision due to the problem of impermanent losses.</p>
                            <p>To solve this problem and create new opportunities for the financial use of Uniswap pools, UniFi introduces “Crafting.” This is a new fancy way to build liquidity together, without needing to trust and know each other.</p> 
                            <p>Anyone can create a Craft Order, customize the liquidity setup and deploy it by adding his or her own portion of liquidity. Anyone can then fill the remaining liquidity required to pool the liquidity in the Uniswap pool. After a pre-selected block, the first one who transacts the removal will remove and send the liquidity to all of the Order participants, based on the rules created initially.</p>
                             
                        </article>
                    </section>
                </section>
            </section>
        );
    }
});