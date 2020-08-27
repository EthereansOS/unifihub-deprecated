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
                            <p>uSD achieves this unprecedented level of stability by collateralizing other stablecoins. If any of them lose value or fail, it can simply rebalance itself to leverage the security of the others. And to account for excess due to fees in their pools, it can rebalance itself in another way.</p>
                            <h4>The only way uSD can be destabilized is if the entire stablecoin industry collapses.</h4>
                            <h6>uSD is backed by Uniswap’s (whitelisted) stablecoin liquidity pools.</h6> 
                            <h6>Anyone can mint it by adding these stablecoins to those pools.</h6>
                            <h4>Example:</h4>
                            <p>Mint 2x uSD by adding 1x Stablecoin A and 1x Stablecoin B</p> 
                            <h6>And by burning uSD, anyone can receive these stablecoins from those pools.</h6>
                            <h4>Example:</h4>
                            <p>Burn 2x uSD and receive 1x Stablecoin A and 1x Stablecoin C</p> 
                        </article>
                        <article className="grimoireArticle" id="uSDrebalancing">
                            <h2>Rebalancing</h2>
                            <h6>Sometimes, collateralization is not enough, and uSD must rebalance in one of two ways.</h6>
                            <h4>DFO Debit</h4>
                            <p>When a stablecoin loses value, the Uniswap Tier pools rebalance to an uneven disparity (≠ 50/50). If the stablecoin totally fails, the other stablecoins effectively pump in correlation.</p>
                            <p>DFO Debit resolves this issue on-chain by rebalancing uSD, creating debt which the UniFi DFO then pays off by minting UniFi. Let’s look at how this plays out, step by step:</p>
                            <ol>
                                <li>1 - A  stablecoin collateralized by uSD loses value or fails altogether.</li>
                                <li>2 - $UniFi holders vote to remove the tiers containing the failed stablecoin from the whitelist.</li>
                                <li>The uSD supply becomes grater than the supply of the collateralized pooled stablecoins.</li>
                                <li>To restore 1:1 equilibrium, anyone holding uSD can burn it to receive new UniFi, minted at a 50% discount of the uSD/UniFi Uniswap pool mid-price ratio.</li>
                            </ol>
                            <h6>The goal of $UniFi holders, which aligns with their self-interest, is to ensure uSD’s security. Thus there is an economic disincentive to whitelist insecure stablecoins.</h6>
                            <h4>DFO Credit</h4>
                            <p>As established, uSD is backed by Uniswap pool liquidity. This raises an issue; Uniswap pools earn 0.3% of trading fees. This could destabilize uSD by creating an excess of collateralized stablecoins in the pools. </p>
                            <p>DFO Credit, the second rebalancing function of the UniFi DFO, resolves this by removing that excess from the pools and sending it in the DFO wallet managed by $UniFi holders.</p>
                            <p>This is a long term economic incentive for the UniFi DFO to grow and invest credit in R&D.</p>
                        </article>
                        <article className="grimoireArticle" id="uSDsec">
                            <h2>Security and Emergency Strategies</h2>
                            <h4>The UniFi has a number of measures in place to ensure its security.</h4>
                            <p>1 - uSD pool collateral is locked. Stored in an external smart contract, it can’t be touched even by the UniFi DFO, precluding voter fraud by bad actors.</p>
                            <p>2 - In the case of any bug or update, $UniFi holders can vote to pause the uSD smart contract. This prevents minting of new uSD or rebalancing of uSD, but holders will still be able to redeem it for the pooled stable coins, and thus revoke the collateral.</p>
                            <p>3 - Even if the uSD protocol fails, and even if the UniFi DFO votes to update uSD to an undesirable new version, uSD holders will still be able to interact with the old smart contract—until all collateral is revoked—as well as the new one.</p>
                        </article>
                        <article className="grimoireArticle" id="uSDres">
                            <h2>Resilience, Decentralization and independency</h2>
                            <p>uSD is the most resilient, secure and stable stablecoin in the industry. By taking advantage of Uniswap, a security layer with a decentralized core, it frees holders from dependence on censorship or centralized manipulation by states and stablecoin issuers. It resolves all risks that come with trusting the big stablecoin companies, like MakerDAO, Coinbase, Tether etc.</p>
                            <p>uSD is backed by a Decentralized Flexible Organization. $UniFi holders on the Ethereum network have 100% control of the code and Credit/Debit of the protocol. Nobody can stop or censor the UniFi-uSD protocol; for the first time, the Ethereum network doesn’t have to choose between stability and independence in a stablecoin; it can have both.</p>
                        </article>
                        <article className="grimoireArticle" id="uSDapi">
                            <h2>APIs and Documentation</h2>
                            <p>To build on top of uSD and to interact with the dApp, you can find all of the documentation and APIs here:  <a target="_blank" href="https://github.com/b-u-i-d-l/unifi-docs">Documentation</a></p>
                        </article>
                        <article className="grimoireArticle" id="uSDarchi">
                            <h2>Responsible DeFi Limits</h2>
                            <p>Due to a Responible DeFi Approach, UniFi uSD is limited in its early stage to mint by:</p>
                            <ol>
                                <li></li>
                            </ol>
                        </article>
                    </section>
                </section>
            </section>
        );
    }
});