var DappMenu = React.createClass({
    renderMenuIconSC() {
        return this.renderInput("assets/img/mk.png", "assets/img/m4.png", "Stable Coin", "MStableCoin", "javascript:;", "id1");
    },
    renderMenuIconCR() {
        return this.renderInput("assets/img/mk.png", "assets/img/m2.png", "Liquidity Crafting", "MLiquidityCrafting", "javascript:;", "id2");
    },
    renderMenuIconILO() {
        return this.renderInput("assets/img/mk.png", "assets/img/m5.png", "Liquidity Offering", "MLiquidityOffering", "javascript:;",  "id3");
    },
    renderMenuIconBZ() {
        return this.renderInput("assets/img/mk.png", "assets/img/m1.png", "Swap Bazar", "MSwapBazar", "javascript:;",  "id4");
    },
    renderMenuIconGR() {
        return this.renderInput("assets/img/mk.png", "assets/img/m0.png", "Grimoire", "MGrimoire", "javascript:;",  "id5");
    },
    renderMenuIconGH() {
        return this.renderInput("assets/img/mk.png", "assets/img/m3.png", "Github", "MGithub", "javascript:;",  "id6");
    },
    renderMenuIconETH() {
        return this.renderInput("assets/img/mk.png", "assets/img/m6.png", "Connect", "MConnect", "javascript:;",  "id7");
    },
    renderInput(arrowkey, menuIcon, menuTitle, menuFunction, menuLink, menuID) {
        var _this = this;
        return (
        <li className={menuFunction}>
            <a href={menuLink} id={menuID}>
                <img src={menuIcon}></img>
                <span>{menuTitle}</span>
            </a>
            <span className="menuArrow"><img src={arrowkey}></img></span>
        </li>
        );
    },
    render() {
        return (
            <section className="MenuOpen">
                <section className="coverMenu">
                    {this.renderMenuIconSC()}
                    {this.renderMenuIconCR()}
                    {this.renderMenuIconILO()}
                    {this.renderMenuIconBZ()}
                    {this.renderMenuIconGR()}
                    {this.renderMenuIconGH()}
                    {this.renderMenuIconETH()}
                </section>
        </section>
        );
    }
});