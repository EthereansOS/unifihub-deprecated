var Explainer = React.createClass({
    requiredScripts: [
        'spa/loader.jsx'
    ],
    renderExStableCoin() {
        return this.renderInput("ExStableCoin", "assets/img/exp1.png", "a", "InfoButton", "a", "dappButton", "More", "Launch Dapp", "A Stable Coin to pull them all", "A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all");
    },
    renderExCrafting() {
        return this.renderInput("ExCrafting", "assets/img/exp0.png", "a", "InfoButton", "a", "soonButton", "More", "Coming Soon", "A Stable Coin to secure them all", "A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all");
    },
    renderExIlo() {
        return this.renderInput("ExIlo", "assets/img/exp4.png", "a", "InfoButton", "a", "soonButton", "More", "Coming Soon", "A Stable Coin to secure them all", "A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all");
    },
    renderExDex() {
        return this.renderInput("ExDex", "assets/img/exp3.png", "a", "InfoButton", "a", "dappButton", "More", "Launch Dapp", "A Stable Coin to secure them all", "A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all");
    },
    renderExGrimoire() {
        return this.renderInput("ExGrimoire", "assets/img/exp2.png", "a", "readButton", "a", "gitButton", "Read", "Github", "A Stable Coin to secure them all", "A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all A Stable Coin To rule them all");
    },
    renderInput(expFeature, featureIllustration, featureActionA, featureActionAStyle, featureActionB, featureActionBStyle, featureBtnA, featureBtnB, featureTitle, featureDesc) {
        var _this = this;
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
                        <a href="javascript:;" id={featureActionA} className={featureActionAStyle + " FancyButton"}>{featureBtnA}</a>
                        <a href="javascript:;" id={featureActionB} className={featureActionBStyle + " FancyButton"}>{featureBtnB}</a>
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
                        <header>
                            <h2>A Decentralized finance on top of Uniswap, doing fantastic things securelly</h2>
                        </header>
                    </article>
                    <section className="coverMenu">
                    </section>
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