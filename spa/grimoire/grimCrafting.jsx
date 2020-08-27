var GrimCrafting = React.createClass({
    requiredScripts: [
        'spa/loader.jsx'
    ],
    
    render() {
        return (
            <section>
                <section className="grimoireWelcome">
                    <section className="grimoireWelcomeIntern">
                            <img src="assets/img/m2.png"></img>
                        <article id="grimCraft">
                            <h2>The Grimoire - Crafting and Initial Liquidity Offering</h2>
                            <h6><b>Craft makes it possible to provide liquidity that is programmable with advanced rules.</b> Using Unicorn magic, pools can balance tokens diversely with unprecedented security.</h6>
                        </article>
                    </section>
                </section>
                <section className="grimoireBoxAll">
                    <section className="grimoireBox">
                        <ul className="grimoireIndex">
                            <h2>Index</h2>
                            <a href="#Craftbasic"><b>Basics</b></a>
                            <a href="#Craftprog"><b>Programmable Liquidity Rules</b></a>
                            <a href="#CraftILO"><b>Initial Liquidity Offering (ILO)</b></a>
                            <a href="#Craftrel"><b>Release</b></a>
                        </ul>
                        <article className="grimoireArticle" id="Craftbasics">
                            <h2>Basics</h2>
                            <p>Programmable liquidity is an exciting new feature in AMMs (Automated Market Makers). However, if not applied correctly, it can actually be a security hole for bugs, due to math complexities (as we saw with Balancer recently).</p>
                            <p>UniFi Crafting resolves this by offering programmable liquidity, but with Uniswap as a base layer, taking advantage of its secure and decentralized core. This also helps liquidity providers customize their investments, and empowers new applications on top of Uniswap.</p>
                            <h4>How Does It Work?</h4> 
                            <p>Uniswap allows for liquidity pools composed of 50:50 asset ratios. This is usually the most secure setup for an AMM, but disincentivizes liquidity provision by incurring impermanent losses. Crafting resolves this, and opens up novel financial use cases for Uniswap pools. It is a fancy new way to build liquidity together, without needing to trust and know each other.</p>
                            <p>Anyone can create a Craft order, customize the liquidity setup and deploy it by contributing some of the liquidity. Others can then contribute the rest required to pool the order on Uniswap. Later, after the predetermined block, any of the participants can trigger removal of the liquidity. It is then distributed to all order participants based on the predetermined rules.</p>
                        </article>
                        <article className="grimoireArticle" id="Craftprog">
                            <h2>Programmable Liquidity Rules</h2>
                            <h6>With Crafting, Uniswap liquidity providers can program a liquidity order by customizing the following:</h6>
                            <ol>
                                <li><b>- Tier:</b> The Uniswap tier to which the liquidity will added.</li>
                                <li><b>- Waiting Length:</b> The max time (in blocks) the order can remain available while the required liquidity is waiting to be filled.</li>
                                <li><b>- Min Block Length:</b> The time (in blocks) for which the liquidity will be locked. If 0, any participant can trigger the removal of liquidity anytime.</li>
                                <li><b>- Liquidity Ratio:</b> The ratio of liquidity, e.g. 10% DAI - 90% ETH or 0% DAI - 100 ETH. Once deployed by the creator, others can add the required liquidity. If the creator sets the ratio at 10% DAI - 90% ETH, the others can add the rest at 90% DAI - 10% ETH.</li>
                                <li><b>- Liquidity Exit/Discount:</b> An advanced feature for orders that allows for the creation of a different ratio or even a discount for the exit.</li>
                            </ol>
                            <h4>Let’s play out that aforementioned example.</h4>
                            <p>Person A creates an order for USDC - DAI, with a min block length of 543055 Blocks and a ratio of 10% DAI - 90% USDC. He adds 100 DAI and 900 USDC, and also decides to set the exit liquidity at 30% DAI and 70% USDC (read on to see exactly how exit liquidity works).</p>
                            <p>B fills part of the remaining required liquidity (at a ratio of 90% DAI and 10% USDC) with 500 DAI and 50 USDC.</p>
                            <p>C fills part of the remaining required liquidity (at a ratio of 90% DAI and 10% USDC) with 100 DAI and 10 USDC.</p>
                            <p>D fills the rest of the required liquidity (at a ratio of 90% DAI and 10% USDC) with 300 DAI and 30 USDC.</p>
                            <h6>By adding the remaining required liquidity, D has triggered Uniswap’s Add Liquidity order ...</h6>
                            <p>The total Uniswap liquidity pooled by A,B,C and D is 1,000 DAI and 1,000 USDC.</p>
                            <p>After 543055 Blocks, the liquidity pool has earned 1,000 USDC and 1,000 DAI in Uniswap trading fees, bringing the total to 2,000 DAI and 2,000 USDC.</p>
                            <h6>... B then triggers the removal action, and based on the fixed predetermined rules, the providers receive the following:</h6>
                            <p>A receives 600 DAI and 1,400 USDC (at the Exit Ratio of 30% DAI and 70% USDC).</p>
                            <p>Based on how much they individually contributed, B, C and D receive their respective proportion of 1,400 DAI and 600 USDC (at the Exit Ratio of 70% DAI and 30% USDC).</p>
                        </article>
                        <article className="grimoireArticle" id="CraftILO">
                            <h2>Initial Liquidity Offering (ILO)</h2>
                            <p>Initial Liquidity Offerings are a way for Ethereum-based startups to configure “Crafting”—i.e, Programmable Liquidity—rules to secure long term funding by providing Uniswap liquidity.</p> 
                            <h6>ILOs are helpful for three specific reasons:</h6>
                            <h4>Securing Initial Liquidity for AMMs with fixed inflation/liquidity staking</h4>
                            <p>Providers can offer liquidity with fixed inflation without dumping on new holders. They also help new investors reduce slippage and become holders with a large amount of capital.</p>
                            <h4>Disarming Sniper Bots</h4>
                            <p>Sniper Bots track new low liquidity Uniswap pools for sizable capital before liquidity even comes in, making it (until now) impossible for startups to offer liquidity with low collateral.</p>
                            <h4>Securing Long Term Locked Investors</h4>
                            <p>Investors lock their funds for the long run.</p>
                            <h4>How ILOs work:</h4>
                            <p>Before distributing their tokens, startups can set crafting orders with fixed pre-values, adding the token and requesting the collateral required to fill the order. Investors provide that collateral, and if the startup chooses, investors get an Exit/Discount to mitigate the high risk.</p>
                            <h6>Example</h6>
                            <p>The token creator sets a Crafting order with low liquidity, e.g. 1,000,000 of the token and 1 ETH, with a 90% - 10% ratio, or even 1,000,000 of token and 0 ETH, with a 100% - 0% ratio (adding a pre-value of the token, if the liquidity pool is not open yet) for one year. Setting the Liquidity Exit/Discount 10%/20%, investors will receive at the end of the order 90%/80%.</p>
                            <p>In this case, investors invest their own Ethereum for a new token that is not already tradable. This entails a high level or risk, and so they are compensated by receiving a more significant portion of the liquidity at the end of the year; in this case, from 50% added to 170% received.</p>
                            <h6>ILOs enable new Ethereum fundraising rules that solve liquidity issues in early stages, while also helping legitimate projects set Fixed Inflation. This empowers projects and investors in the long run.</h6>
                            <h6>UniFi DFO Tax:</h6>
                            <p>The UniFi DFO earns via the Crafting function; 0.1% of the total Uniswap Pool Tokens in a Craft order is taxed and paid directly when a participant calls the remove function.</p>
                        </article>
                        <article className="grimoireArticle" id="Craftrel">
                            <h2>Release</h2>
                            <p>The Release Of Crafting and ILOs is expected for early October 2020</p>
                        </article>
                    </section>
                </section>
            </section>
        );
    }
});