var Explainer = React.createClass({
    requiredScripts: [
        'spa/loader.jsx'
    ],
    requiredModules: [
        'spa/dappMenu'
    ],
    renderExStableCoin() {
        return this.renderInput("ExStableCoin", "assets/img/exp1.png", "a", "InfoButton", "a", "dappButton", "More", "Launch Dapp", "A Stable Coin to Pool Them All", "Uniswap State Dollar (uSD) is a new stablecoin minted by the magic rainbow of Uniswap stablecoin pools. Backed by the power of the Unicorn, uSD is the most secure stablecoin ever. The only way it could be destabilized is if the entire stablecoin industry crashed.", undefined, () => this.emit('section/change', 'stableCoin'));
    },
    renderExCrafting() {
        return this.renderInput("ExCrafting", "assets/img/exp0.png", "a", "InfoButton", "a", "soonButton", "More", "Coming Soon", "Crafting Programmable Liquidity", "Craft makes it possible to provide liquidity that is programmable with advanced rules. Using Unicorn magic, pools can balance tokens diversely with unprecedented security.");
    },
    renderExIlo() {
        return this.renderInput("ExIlo", "assets/img/exp4.png", "a", "InfoButton", "a", "soonButton", "More", "Coming Soon", "ILOs Offering Tokens for Liquidity", "The Initial Liquidity Offering (ILO) is a new way for startups to provide that liquidity. By using Craft, ILOs offer total security against Sniper Bots, a new villain in the Unicorn Story.");
    },
    renderExDex() {
        return this.renderInput("ExDex", "assets/img/exp3.png", "a", "InfoButton", "a", "dappButton", "More", "Launch Dapp", "Swap More Than Just Tokens", "Ancient black magic is unleashing the true power of the Unicorn. Programmable Equities, Token Indexes and NFTs (including ERC 1155 NFTs, thanks to ethArt V2) can now be swapped, on the new Bazaar DEX.", undefined, () => this.emit('section/change', 'swapBazar'));
    },
    renderExGrimoire() {
        return this.renderInput("ExGrimoire", "assets/img/exp2.png", "a", "readButton", "a", "gitButton", "Read", "Github", "Unicorn Magic For Dummies", "The Official guide for using Uniswap Unicorn magic. Grimoire, the best selling book of 2020, is prescribed by all the top wizard Universities, and won this years' Booker Prize.");
    },
    renderInput(expFeature, featureIllustration, featureActionA, featureActionAStyle, featureActionB, featureActionBStyle, featureBtnA, featureBtnB, featureTitle, featureDesc, actionA, actionB) {
        return (
            <section className={expFeature + " feature"}>
                <section className="cardinfo">
                    <figure>
                        <img src={featureIllustration}></img>
                    </figure>
                    <article className="featureDescription">
                        <h3>{featureTitle}</h3>
                        <p>{featureDesc}</p>
                        <aside className="featureActions">
                            <a href="javascript:;" id={featureActionA} onClick={actionA} className={featureActionAStyle + " FancyButton"}>{featureBtnA}</a>
                            <a href="javascript:;" id={featureActionB} onClick={actionB} className={featureActionBStyle + " FancyButton"}>{featureBtnB}</a>
                        </aside>
                    </article>
                </section>
            </section>
        );
    },
    render() {
        return (
            <section className="unifiWelcome">
                <article className="cover">
                    <img src="assets/img/welcome.png"></img>
                </article>
                <header>
                    <h2>A Decentralized finance on top of Uniswap, doing fantastic things securelly</h2>
                </header>
                <DappMenu />
                {this.renderExStableCoin()}
                {this.renderExCrafting()}
                {this.renderExIlo()}
                {this.renderExDex()}
                {this.renderExGrimoire()}
                <footer>
                    <section>

                    </section>
                </footer>
            </section>
        );
    }
});