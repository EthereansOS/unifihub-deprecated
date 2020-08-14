var Explainer = React.createClass({
    requiredScripts: [
        'spa/loader.jsx'
    ],
    renderExStableCoin() {
        return this.renderInput("ExStableCoin", );
    },
    renderExCrafting() {
        return this.renderInput("ExCrafting");
    },
    renderExDex() {
        return this.renderInput("ExDex");
    },
    renderExGrimoire() {
        return this.renderInput("ExGrimoire");
    },
    renderInput(expFeature, featureIllustration, featureActionA, featureActionAStyle, featureActionB, featureActionBStyle) {
        var _this = this;
        return (
        <section className={expFeature + "feature"}>
            <figure>
                <img src={featureIllustration}></img>
            </figure>
            <article className="featureDescription">
                <h3></h3>
                <p></p>
                <aside className="featureActions">
                    <a href="javascript:;" id={featureActionA} className={featureActionAStyle + "FancyButton"}></a>
                    <a href="javascript:;" id={featureActionB} className={featureActionBStyle + "FancyButton"}></a>
                </aside>
            </article>
        </section>
        );
    },
    render() {
        return (
                <section className="unifiWelcome">
                    <article className="cover">
                        <figure>
                            <img></img>
                            <a></a>
                        </figure>
                        <img></img>
                        <header>
                            <h2></h2>
                            <p></p>
                        </header>
                    </article>
                    <section className="coverMenu">
                    
                    </section>
                    
                    <footer>
                        
                    </footer>
                </section>
        );
    }
});