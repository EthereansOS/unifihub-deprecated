var GrimuSD = React.createClass({
    requiredScripts: [
        'spa/loader.jsx'
    ],
    
    render() {
        return (
            <section>
                <section className="grimoireWelcome">
                    <section className="grimoireWelcomeIntern">
                        <img src="assets/img/m4.png"></img>
                        <article id="grimuSD">
                            <h2>The Grimoire - Uniswap State Dollar</h2>
                            <h6><b>uSD is a Stable Coin based on Uniswap Liquidity Pools</b> <a href="">Launch Dapp</a> Minted by the magic rainbow of Uniswap stablecoin pools. Backed by the power of the Unicorn, uSD is the most secure stablecoin ever. The only way it could be destabilized is if the entire stablecoin industry crashed.</h6>
                        </article>
                    </section>
                </section>
                <section className="grimoireBoxAll">
                    <section className="grimoireBox">
                        <ul className="grimoireIndex">
                            <h2>Index</h2>
                            <a href="#uSDbasics"><b>Basics</b></a>
                            <a href="#uSDrebalancing"><b>Rebalancing</b></a>
                            <a href="#uSDsec"><b>Security and Emergency Strategies</b></a>
                            <a href="#uSDres"><b>Resilience, Decentralization and independency</b></a>
                            <a href="#uSDapi"><b>APIs and Documentation</b></a>
                            <a href="#uSDarchi"><b>Responsible DeFi Architecture</b></a>
                        </ul>
                        <article className="grimoireArticle" id="uSDbasics">
                            <h2>Basics</h2>
                            <p>The aim of the Uniswap State Dollar (uSD) protocol is to build the most secure and resilient stablecoin on Ethereum—ever. Independent from any off-chain issuer, it is fortified against the risks inherent to all other stablecoins, and free of the anxiety that pervades the industry.</p>
                            <p>uSD achieves stability by collateralizing stablecoins, and, when necessary, rebalancing itself in relation to them, so that if any lose value or fail, it is still secured by the others. The only way uSD can be destabilized is if the entire stablecoin industry collapses.</p>
                            <h6>uSD is backed by Uniswap’s (whitelisted) stablecoin liquidity pools.</h6> 
                            <h6>Anyone can mint it by adding these stablecoins to those pools.</h6>
                            <h4>Example:</h4>
                            <p>Mint 2x uSD by adding 1x Stablecoin A and 1x Stablecoin B.</p> 
                            <h6>And by burning uSD, anyone can receive these stablecoins from those pools.</h6>
                            <h4>Example:</h4>
                            <p>Burn 2x uSD and receive 1x Stablecoin A and 1x Stablecoin C.</p> 
                        </article>
                        <article className="grimoireArticle" id="uSDrebalancing">
                            <h2>Rebalancing</h2>
                            <h6>Sometimes, collateralization is not enough, and uSD must rebalance in one of two ways.</h6>
                            <h4>DFO Debit</h4>
                            <p>When a stablecoin loses value, the Uniswap Tier pools rebalance to an uneven disparity (≠ 50/50). If the stablecoin totally fails, the other stablecoins effectively pump in correlation.</p>
                            <p>DFO Debit resolves this issue on-chain by rebalancing uSD, creating debt which the UniFi DFO then pays off by minting UniFi. Let’s look at how this plays out, step by step:</p>
                            <ol>
                                <li>Holders of the $UniFi programmable equity vote to remove the tiers that contain the failed stablecoin from the whitelist. In doing so, the uSD supply becomes greater than the supply of the collateralized pooled stablecoins.</li>
                                <li>To restore the 1:1 equilibrium, anyone holding uSD can burn it to receive new UniFi, minted at a 50% discount of the uSD/UniFi Uniswap pool mid-price ratio.</li>
                            </ol>
                            <h6>The goal of UniFi holders, which aligns with their self-interest, is to ensure uSD’s security. Thus there is an economic disincentive to whitelist stablecoins that don’t provide security.</h6>
                            <h4>DFO Credit</h4>
                            <p>As has already been established, uSD is backed by Uniswap pool liquidity. There is an issue here, given that Uniswap pools earn 0.3% of trading fees, which can destabilize uSD by creating an excess of collateralized stablecoins in the pools. </p>
                            <p>DFO Credit, the second rebalancing function of the UniFi DFO, resolves this by removing the excess from the pools and sending it in the DFO wallet managed by UniFi holders.This is a long term economic incentive for the UniFi DFO to grow and invest credit in R&D.</p>
                        </article>
                        <article className="grimoireArticle" id="uSDsec">
                            <h2>Security and Emergency Strategies</h2>
                            <h4>The UniFi has a number of measures in place to ensure its security.</h4>
                            <p>1 - The DFO can’t vote to manage the locked pool collateral of uSD, which is stored in an external smart contract. This precludes voter fraud by bad actors.</p>
                            <p>2 - In the case of any bug or update, UniFi holders can vote to pause the uSD smart contract. This will prevent it from minting new uSD or rebalancing uSD, but holders will still be able to redeem uSD for the pooled stable coins, and thereby revoke the collateral.</p>
                            <p>3 - Even if the protocol fails, or even if the UniFi DFO votes to update uSD to an undesirable new version, uSD holders will still be able to interact with the old smart contract (until all collateral is revoked) as well as the new one.</p>
                        </article>
                        <article className="grimoireArticle" id="uSDres">
                            <h2>Resilience, Decentralization and independency</h2>
                            <p>uSD is the most resilient stablecoin in the industry. It frees holders from dependence on any centralized manipulation by states and stablecoin issuers, by taking advantage of Uniswap, an important security layer with a decentralized core.</p>
                            <p>uSD is backed by a DFO. There is no centralized entity behind it, only UniFi holders on the Ethereum network. They have 100% control of the code and Credit/Debit of the protocol. Nobody can stop or censor the UniFi-uSD protocol; for the first time, the Ethereum network doesn’t have to choose between stability and independence in a stablecoin; it can have both.</p>
                            <p>uSD resolves all of the risks associated with trusting the big stablecoin companies, such as MakerDAO, Coinbase, Tether etc.</p>
                        </article>
                        <article className="grimoireArticle" id="uSDapi">
                            <h2>APIs and Documentation</h2>
                            <p>To build on top of uSD and to interact with the dapp, you can find all of the documentation and APIs here: </p>
                        </article>
                        <article className="grimoireArticle" id="uSDarchi">
                            <h2>Responsible DeFi Architecture</h2>
                        </article>
                    </section>
                </section>
            </section>
        );
    }
});