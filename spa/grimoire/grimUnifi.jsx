var GrimUnifi = React.createClass({
    requiredScripts: [
        'spa/loader.jsx'
    ],
    
    render() {
        return (
            <section>
                <section className="grimoireWelcome">
                    <section className="grimoireWelcomeIntern">
                        <img src="assets/img/maghetto.png"></img>
                        <article id="grimUniFi">
                            <h2>The Grimoire - Decentralized Finance on top of Uniswap and the Cell token</h2>
                            <h6>CellFinance is a new Decentralized Flexible Organization (DFO) that researches and develops a responsible Decentralized Finance layer on top of Uniswap.</h6>
                        </article>
                    </section>
                </section>
                <section className="grimoireBoxAll">
                    <section className="grimoireBox">
                        <article className="grimoireArticle" id="Unifibasics">
                            <h2>Basics</h2>
                            <p>CellFinance is a new Decentralized Flexible Organization (DFO) that researches and develops a responsible Decentralized Finance layer on top of Uniswap. Thanks to the DFOhub standard, CellFinance dApps are entirely independent from any off-chain entity. The $Cell voting token is a programmable equity of the Cell DFO; $Cell holders hold real equity of the protocol, and rule every part of its code and assets. More info here: <a target="_blank" href="https://dfohub.com"> dfohub.com</a></p>
                        </article>
                        <article className="grimoireArticle" id="UnifiERN">
                            <h2>CellFinance Earning System</h2>
                            <p>The Cell DFO earn from:</p>
                            <ol>
                                <li>- The uSD positive rebalance (the trading fees of Uniswap collateralized stablecoins)</li>
                                <li>- The 0.1% in Uniswap Pool Tokens taxed by crafting Programmable Liquidity</li>
                            </ol>
                            <p>As an on-chain company, Cell's value will be backed by these earnings, and by the core of Flexible Organizations, totally ruled in code and assets by tokens, without any chance of external manipulation.<a target="_blank" href="https://dfohub.com"></a></p>
                        </article>
                    </section>
                </section>
            </section>
        );
    }
});