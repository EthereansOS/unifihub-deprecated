var DappMenu = React.createClass({
    getDefaultSubscriptions() {
        return {
            'ethereum/ping': () => this.forceUpdate()
        }
    },
    getInitialState() {
        return {
            menuItems: [{
                title: "Stable Coin",
                icon: "m4",
                props: {
                    onClick: () => this.emit('section/change', 'stableCoin')
                }
            }, {
                title: "Liquidity Crafting",
                icon: "m2"
            }, {
                title: "Liquidity Offering",
                icon: "m5"
            }, {
                title: "Swap Bazar",
                icon: "m1"
            }, {
                title: "Grimoire",
                icon: "m0"
            }, {
                title: "Github",
                icon: "m3"
            }, {
                title: "Connect",
                icon: "m6",
                props: {
                    onClick: () => window.getAddress()
                }
            }]
        };
    },
    renderMenuItem(menuItem, i) {
        menuItem.id = menuItem.id || ('id' + (i + 1));
        menuItem.props = menuItem.props || {};
        menuItem.props.id = menuItem.props.id || menuItem.id;
        menuItem.props.href = menuItem.props.href || "javascript:;";
        menuItem.className = menuItem.className || ("M" + menuItem.title.split(' ').join(''));
        return (
            <li key={menuItem.id} className={menuItem.className}>
                {React.createElement('a', menuItem.props, [
                    <img src={window.resolveImageURL(menuItem.icon)} />,
                    <span>{menuItem.title}</span>
                ])}
                <span className="menuArrow"><img src={window.resolveImageURL(menuItem.arrowkey || 'mk')} /></span>
            </li>
        );
    },
    render() {
        return (
            <section className="MenuOpen">
                <section className="coverMenu">
                    {this.state.menuItems.map(this.renderMenuItem)}
                </section>
            </section>
        );
    }
});