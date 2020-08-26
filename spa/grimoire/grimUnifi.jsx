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
                            <h2>The Grimoire - UniFi DFO and UniFi Token</h2>
                            <h6>UniFi is a new Decentralized Flexible Organization (DFO) that researches and develops a responsible Decentralized Finance layer on top of Uniswap.</h6>
                        </article>
                    </section>
                </section>
                <section className="grimoireBoxAll">
                    <section className="grimoireBox">
                        <ul className="grimoireIndex">
                            <h2>Index</h2>
                            <a href="#Unifibasics"><b>Basics</b></a>
                            <a href="#Unifidist"><b>UniFi Distribution</b></a>
                            <a href="#UnifiFI"><b>UniFi Fair Inflation</b></a>
                            <a href="#UnifiLS"><b>UniFi Liquidity Staking</b></a>
                            <a href="#UnifiERN"><b>DFO Earnings</b></a>
                        </ul>
                        <article className="grimoireArticle" id="Unifibasics">
                            <h2>Basics</h2>
                            <p>Thanks to the DFOhub standard, UniFi dApps are entirely independent from any off-chain entity. The $UniFi voting token is a programmable equity of the UniFi DFO; $UniFi holders hold real equity of the protocol, and rule every part of its code and assets. More at <a target="_blank" href="https://dfohub.com">dfohub.com</a></p>
                        </article>
                        <article className="grimoireArticle" id="Unifidist">
                            <h2>UniFi Distribution</h2>
                            <p>The total supply of $UniFi is 88,888,888, which is initially distributed as follows:</p>
                            <ol>
                                <li><b>- 36% </b> (32,042,000) are locked in the NERV Wallet <a target="_blank" href="https://etherscan.io/tokenHoldings?a=0x25756f9C2cCeaCd787260b001F224159aB9fB97A">[0x25756f9C2cCeaCd787260b001F224159aB9fB97A]</a> This is the DFOhub Operations wallet, funded by Fair Inflation.</li>
                                <li><b>- 40% </b> (35,900,000) are locked in the UniFI DFO wallet <a target="_blank" href="https://etherscan.io/tokenHoldings?a=0x2578aA454b29C15c8eEF62C972Ee1ff57CD99DEf">[0x2578aA454b29C15c8eEF62C972Ee1ff57CD99DEf]</a>. This pays out the liquidity staking rewards. The active reward staking contract is <a target="_blank" href="https://etherscan.io/tokenHoldings?a=0xb266252Fd70D253b4330151A96694d35e94b846c">[0xb266252Fd70D253b4330151A96694d35e94b846c]</a></li>
                                <li><b>- 16% </b> (14,333,333) are locked in the DFOhub wallet (owned by $buidl holders) <a target="_blank" href="https://etherscan.io/tokenHoldings?a=0x5D40c724ba3e7Ffa6a91db223368977C522BdACD">[0x5D40c724ba3e7Ffa6a91db223368977C522BdACD]</a></li>
                            </ol>
                        </article>
                        <article className="grimoireArticle" id="UnifiFI">
                            <h2>UniFi Fair Inflation</h2>
                            <h6>A sustainable economic model for DFO-based startups to maintain value and fund operations | UniFi version</h6>
                            <p>The original whitepaper of the first fair inflation mechanism was for buidl <a target="_blank" href="https://github.com/b-u-i-d-l/fair-inflation-v2">(https://github.com/b-u-i-d-l/fair-inflation-v2)</a></p>
                            <p>UniFi’s fair inflation will inflate the supply by 2% (1,788,500 $UniFi) over the first year via <a target="_blank" href="https://etherscan.io/tokenHoldings?a=0x25756f9C2cCeaCd787260b001F224159aB9fB97A">NERV</a> (The DFOhub Team Operations' DFO)</p>
                            <h6>Inflation events will occur once a day (every 6,300 ETH Blocks) across three Uniswap pairs, for a total of 4,900 $UniFi each event:</h6>
                            <ol>
                                <li>- Uniswap V2 $ETH/$UniFi (2695 $UniFi every day) - 55%</li>
                                <li>- Uniswap V2 $USDC/$UniFi (1470 $UniFi every day) - 30%</li>
                                <li>- Uniswap V2 $BUIDL/$UniFi (735 $UniFi every day) - 15%</li>
                            </ol>
                            <p>All functionalities related to this R&D will become available for every DFO as Optional Basic Functionalities, to accelerate the exploration of Programmable Equity R&D.</p>
                        </article>
                        <article className="grimoireArticle" id="UnifiLS">
                            <h2>UniFi Liquidity Staking</h2>
                            <p>UniFi Liquidity Stakinf is available here: <a target="_blank" href="https://dapp.dfohub.com/?staking=0xb266252Fd70D253b4330151A96694d35e94b846c">https://dapp.dfohub.com/?staking=0xb266252Fd70D253b4330151A96694d35e94b846c</a></p>
                            <p>The UniFi Liquidity Staking Mechanism is designed to reward those who lock up Uniswap V2 liquidity for the long term.</p>
                            <p>Liquidity Staking will inflate the supply over the first year (if every tier is completely filled) by 918,000 UniFi (1% of the supply).</p>
                            <p>The Five Year tier was filled by the team in an early test, and we won’t touch the rewards for three years. When they are unlocked and redeemed, 50% of the UniFi will be sent to the UniFi wallet and 50% to the NERV operations wallet.</p>
                        </article>
                        <article className="grimoireArticle" id="UnifiERN">
                            <h2>DFO Earnings</h2>
                            <p>The UniFi DFO earn from:</p>
                            <ol>
                                <li>- The uSD positive rebalance (the trading fees of Uniswap collateralized stablecoins)</li>
                                <li>- The 0.1% in Uniswap Pool Tokens taxed by crafting Programmable Liquidity</li>
                            </ol>
                            <p>As an on-chain company, UniFi’s value will be backed by these earnings, and by the core of Flexible Organizations, totally ruled in code and assets by tokens, without any chance of external manipulation.<a target="_blank" href="https://dfohub.com"></a></p>
                        </article>
                    </section>
                </section>
            </section>
        );
    }
});