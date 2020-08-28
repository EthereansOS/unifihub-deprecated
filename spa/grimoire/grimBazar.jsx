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
                            <h2>The Grimoire - The Bazar</h2>
                            <h6><b>Ancient black magic is unleashing the true power of the Unicorn.</b> Programmable Equities, Token Indexes and NFTs (including ERC 1155 NFTs, thanks to ethArt V2) can now be swapped, on the new Bazaar DEX.</h6>
                        </article>
                    </section>
                </section>
                <section className="grimoireBoxAll">
                    <section className="grimoireBox">
                        <ul className="grimoireIndex">
                            <h2>Index</h2>
                            <a href="#Bazbasics"><b>Basics</b></a>
                            <a href="#Bazlisting"><b>Listing</b></a>
                        </ul>
                        <article className="grimoireArticle" id="Bazbasics">
                            <h2>Basics</h2>
                            <p>The UniFi Bazar unleashes the true potential of Decentralized Finance on top of Uniswap, by enabling Ethereans to trade Index Funds, Programmable Equities and NFTs more easily than ever before.</p>
                        </article>
                        <article className="grimoireArticle" id="Bazlisting">
                            <h2>Listing</h2>
                            <h4>Index Funds </h4>
                            <p>Previously, any ERC20 Uniswap V2 pool token could be traded on Uniswap. But Index Funds—backed by multiple ERC20 tokens—could not. Until now.</p> 
                            <h6>On the Bazar, Ethereans can freely swap and track crypto Index Funds.</h6>
                            <h4>Programmable Equities</h4>
                            <p>Programmable equities are a new asset class in crypto. They are the ERC20 voting tokens of Decentralized Flexible Organizations (DFOs). Holders have 100% ownership of the protocol; there is no opportunity for external manipulation.</p>
                            <h6>On the Bazar, all programmable equities can be listed and traded on Uniswap.</h6>
                            <h4>Non-Fungible Tokens (NFTs)</h4>
                            <p>ERC1155 NFTs are tokens with metadata, but at the same time have a supply. The reason they haven’t been tradable in AMMs before is due to their ‘transfer’ function. They use the ‘SafeTransferFrom’ method, instead of the ERC20 methods, ‘Transfer’ and ‘TransferFrom.’ Also, they don’t have decimals; they’re transferred using ID and Amount.</p>
                            <p>ethArt V2 will be released in November, and the Bazar will be able to synthesize ERC1155 tokens with an ERC20 (à la WETH with ETH) in the background, fundamentally reshaping the NFT market by allowing Ethereans to trade ERC1155 tokens for the first time.</p>
                            <h4>Swappable ERC 1155 release</h4>
                            <p>The release of ethArt V2 and swappable NFTs is scheduled for late November using <a target="_blank" href="https://www.ethart.org">ethArt V2</a></p>
                        </article>
                    </section>
                </section>
            </section>
        );
    }
});