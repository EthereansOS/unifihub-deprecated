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
                        <img className="GrimImg2" src="assets/img/m5.png"></img>
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
                            <a href=""><b>Basics</b></a>
                            <a href=""><b>Programmable Liquidity Rules</b></a>
                            <a href=""><b>Initial Liquidity Offering (ILO)</b></a>
                            <a href=""><b>Release</b></a>
                        </ul>
                    </section>
                </section>
            </section>
        );
    }
});