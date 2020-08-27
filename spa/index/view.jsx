var Index = React.createClass({
    requiredScripts: [
        'spa/loader.jsx'
    ],
    requiredModules: [
        'spa/explainer',
        'spa/dappMenu'
    ],
    getCustomLoader() {
        return (<section className="Intro">
            <img className="introLoader" src="assets/img/loaderwow.gif" />
            <h1>Welcome to the <span><b>UniFi</b></span> World</h1>
        </section>);
    },
    getDefaultSubscriptions() {
        return {
            'section/change': this.sectionChange,
            'visual/mode/toggle': this.toggleBoomerMode
        };
    },
    sectionChange(section, props) {
        var _this = this;
        ReactModuleLoader.load({
            modules: ['spa/' + section.firstLetterToLowerCase()],
            callback: () => _this.setState({ section: section.firstLetterToUpperCase(), props })
        });
    },
    toggleBoomerMode() {
        window.localStorage.setItem('boomerMode', !this.domRoot.hasClass('Boomer'));
        this.forceUpdate();
    },
    render() {
        var props = {};
        this.props && Object.entries(this.props).forEach(entry => props[entry[0]] = entry[1]);
        this.state && Object.entries(this.state).forEach(entry => props[entry[0]] = entry[1]);
        props.props && Object.entries(props.props).forEach(entry => props[entry[0]] = entry[1]);
        delete props.props;
        return (
            <section className={"unifiAll " + (window.localStorage.boomerMode === 'true' ? "Boomer" : "RPG")}>
                {React.createElement(window[props.section || 'Explainer'], props)}
            </section>
        );
    }
});