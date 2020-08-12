var Index = React.createClass({
    requiredModules: [
        "spa/info"
    ],
    requiredScripts: [
        'spa/bigLoader.jsx',
        'spa/loader.jsx'
    ],
    getInitialState() {
        return {
            element: "Info"
        };
    },
    getDefaultSubscriptions() {
        return {
            'ethereum/ping' : this.controller.loadData
        };
    },
    onClick(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        this.changeView(e.currentTarget.innerHTML);
    },
    changeView(element) {
        var _this = this;
        this.domRoot.children().find('a').removeClass("selected").each((i, it) => {
            if(it.innerHTML.toLowerCase() === element.toLowerCase()) {
                return $(it).addClass('selected');
            }
        });
        ReactModuleLoader.load({
            modules : [
                'spa/' + element.toLowerCase()
            ],
            callback: function() {
                _this.setState({element});
            }
        });
    },
    componentDidMount() {
        this.controller.loadData();
    },
    render() {
        var props = {};
        this.props && Object.entries(this.props).forEach(entry => props[entry[0]] = entry[1]);
        this.state && Object.entries(this.state).forEach(entry => props[entry[0]] = entry[1]);
        props.props && Object.entries(props.props).forEach(entry => props[entry[0]] = entry[1]);
        delete props.props;
        return (
            <section className="OnePage">
                <header className="Head">
                    <section className="HBrand">
                        <h6>${window.newToken.symbol} Switch</h6>
                    </section>
                    <section className="HActions">
                        <a href={window.dfo.ens} target="_blank">#{window.newToken.name}</a>
                        <a href={window.context.gitHubURL} target="_blank">#github</a>
                        <a href={window.getNetworkElement("etherscanURL") + "address/" + window.vasaPowerSwitch.options.address} target="_blank">#etherscan</a>
                    </section>
                </header>
                <section className="PagerMenu">
                    <ul className="Menu">
                        <a href="javascript:;" className="InfoOpener selected" onClick={this.onClick}>Info</a>
                        <a href="javascript:;" className="SwitchOpener" onClick={this.onClick}>Switch</a>
                        <a href="javascript:;" className="StakeOpener" onClick={this.onClick}>Status</a>
                    </ul>
                </section>
                {!props.slots && [<br/>, <Loader/>]}
                {props.slots && React.createElement(window[this.state.element], props)}
            </section>
        );
    }
});