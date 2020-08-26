var GrimCrafting = React.createClass({
    requiredScripts: [
        'spa/loader.jsx'
    ],
    
    render() {
        return (
            <section>
                <section className="grimoireWelcome">
                    <section className="grimoireWelcomeIntern">
                        <section className="DuGustis">
                            <img src="assets/img/m2.png"></img>
                            <img className="GrimImg2" src="assets/img/m5.png"></img>
                        </section>
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
                            <p>Programmable Liquidity is an exciting feature in AMMs, but if it impacts the AMM itself, this can introduce bugs due to math complexities (like what happened with Balancer). UniFi crafting aims to achieve Programmable Liquidity, but using Uniswap as a base layer. This helps liquidity providers customize their investment, and empower new applications on top of Uniswap.</p>
                            <p>Uniswap accepts liquidity pools composed of 50:50 asset ratios. This is the most secure setup for an AMM, except for some cases. However, this setup disincentivizes liquidity provision due to the problem of impermanent losses.</p>
                            <p>To solve this problem and create new opportunities for the financial use of Uniswap pools, UniFi introduces “Crafting.” This is a new fancy way to build liquidity together, without needing to trust and know each other.</p> 
                            <p>Anyone can create a Craft Order, customize the liquidity setup and deploy it by adding his or her own portion of liquidity. Anyone can then fill the remaining liquidity required to pool the liquidity in the Uniswap pool. After a pre-selected block, the first one who transacts the removal will remove and send the liquidity to all of the Order participants, based on the rules created initially.</p>
                        </article>
                        <article className="grimoireArticle" id="Craftprog">
                            <h2>Programmable Liquidity Rules</h2>
                            <ol>
                                <li><b>- Selected Tier:</b> The Tier to add liquidity.</li>
                                <li><b>- Waiting Length:</b> the max time (in Blocks) the order can remain available while the required liquidity is waiting to be filled.</li>
                                <li><b>- Min Block Length:</b> The time (in Blocks) in which the liquidity will be locked. If 0, any of the participants can trigger the removal of liquidity anytime.</li>
                                <li><b>- Liquidity Ratio:</b> The creator of the order can set the ratio of liquidity (e.g. 10% DAI - 90% ETH or 0% DAI - 100 ETH). After the order is deployed, participants will be able to fill the liquidity required, so in the first example, if the creator sets 10% DAI - 90% ETH, the participant can add 90% DAI and 10% ETH.</li>
                                <li><b>- Liquidity Exit/Discount:</b> An advanced feature for orders that allows for the creation of a different ratio or even a discount for the exit.</li>
                            </ol>
                            <h4>Example:</h4>
                            <p>Let’s expand on the given example. A creates an order for USDC - DAI, with a min block length of 543055 Blocks and a ratio of 10% DAI - 90% USDC. He adds 100 DAI and 900 USDC. He also sets the exit liquidity at 30% DAI and 70% USDC, B fills part of the required liquidity (the ratio in his case is 90% DAI and 10% USDC) with 500 DAI and 50 USDC.</p>
                            <p>C fills part of the required liquidity (the ratio in his case is also 90% DAI and 10% USDC)  with 100 DAI and 10 USDC.</p>
                            <p>D fills part of the required liquidity (the ratio in his case is also 90% DAI and 10% USDC) with 300 DAI and 30 USDC. D’s liquidity is enough to fill the 50:50 Uniswap pool, so D automatically triggers Uniswap’s Add Liquidity order by its last filling.</p>
                            <p>The total Uniswap liquidity pooled by A,B,C andD is 1,000 DAI and 1,000 USDC.</p>
                            <p>After 543055 Blocks, the liquidity pool has earned by the Uniswap Fees 1,000 USDC and 1,000 DAI for a total of 2,000 DAI and 2,000 USDC. B triggers the removal action, and based on the fixed rules, each of our providers receives the following:</p>
                            <p>A receives 600 DAI and 1,400 USDC (based on the Exit Ratio of 30% DAI and 70% USDC).</p>
                            <p>B, C and D receive 1,400 DAI and 600 USDC each, slipped by the liquidity added (based on the Exit Ratio of 70% DAI and 30% USDC).</p>
                        </article>
                        <article className="grimoireArticle" id="CraftILO">
                            <h2>Initial Liquidity Offering (ILO)</h2>
                            <p>Initial Liquidity Offerings are a procedure for Ethereum based startups to use a set of “Crafting”—aka, Programmable Liquidity—rules to reach long term funds in the form of Uniswap liquidity.</p> 
                            <p>ILOs are helpful for three important reasons:</p>
                            <h6>Initial Liquidity into AMMs for Fixed Inflation/Liquidity Staking</h6>
                            <p>Reach the liquidity required to set fixed inflation without dumping on new holders, and helping new investors reduce slippage and become holders with a large amount of capital.</p>
                            <h6>Avoid Sniper Bots</h6>
                            <p>Sniper Bots are Ethereum-based bots who track new Uniswap low liquidity pools to sniff out significant amounts of capital before the liquidity even comes in, making it impossible for startups to start their offering with low collateral.</p>
                            <h6>Reach Long Term Locked Investors</h6>
                            <p>Investors lock their funds for the long run.</p>
                            <h4>How ILOs work:</h4>
                            <p>Before a new token is distributed, a new startup can set a crafting order with fixed pre-values, adding the token and requesting the collateral required for investors to fill the order.Investors fill the collateral needed, and if the startup has set, investors can have an exit Discount to mitigate the high risk.</p>
                            <h6>Example</h6>
                            <p>The token creator sets a Crafting order with low liquidity, like 1,000,000 of the token and 1 ETH, with a 90% - 10% ratio, or even 1,000,000 of token and 0 ETH, with a 100% - 0% ratio (adding a pre-value of the token, if the liquidity pool is not open yet) for one year. Setting the Liquidity Exit/Discount (10%/20%) means that investors will receive at the end of the order (90%/80%).</p>
                            <p>In this case, investors invest their own Ethereum for a new token not already tradable, so with a high level of risk, they’ll receive a more significant portion of the liquidity at the end of the year (from 50% added to 170% received).</p>
                            <p>ILOs can open new Ethereum fundraising rules that solve liquidity in early stages while also helping legitimate projects set Fixed Inflation. This empowers projects and investors in the long run.</p>
                            <h6>UniFi DFO Tax:</h6>
                            <p>The earning of the UniFi DFO using the Crafting function id the 0.1% of the total Uniswap Pool Tokens into a Craft order, this tax is paid directly when a participant calls the remove function.</p>
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