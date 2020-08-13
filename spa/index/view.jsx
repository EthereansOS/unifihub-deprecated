var Index = React.createClass({
    requiredScripts: [
        'spa/loader.jsx'
    ],
    renderExStableCoin() {
        return this.renderInput("");
    },
    renderExCrafting() {
        return this.renderInput("");
    },
    renderExDex() {
        return this.renderInput("");
    },
    renderExGrimoire() {
        return this.renderInput("");
    },
    renderInput(containerClass, checkBoxClassName, fieldName, label, inputClassName, inputType, postFixedText, percentage, description) {
        var _this = this;
        return (
        <section className="explainer">
            <figure>
                <img></img>
            </figure>
            <article>
                <h3></h3>
                <p></p>
                <aside>
                    <a href=""></a>
                    <a href=""></a>
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
                <section className="explainer">
                    <figure>
                        <img></img>
                    </figure>
                    <article>
                        <h3></h3>
                        <p></p>
                        <aside>
                            <a href=""></a>
                            <a href=""></a>
                        </aside>
                    </article>
                </section>
                <footer>
                    
                </footer>
            </section>
        );
    }
});