var Index = React.createClass({
    requiredScripts: [
        'spa/loader.jsx'
    ],
    requiredModules: [
        'spa/explainer'
    ],
    getDefaultSubscriptions() {
        return {
            'section/change': this.sectionChange
        };
    },
    sectionChange(section, props) {
        var _this = this;
        ReactModuleLoader.load({
            modules : ['spa/' + section.firstLetterToLowerCase()],
            callback: () => _this.setState({section: section.firstLetterToUpperCase(), props})
        });
    },
    componentDidMount() {
        var section = window.addressBarParams.section;
        delete window.addressBarParams.section;
        section && this.sectionChange(section);
    },
    render() {
        var props = {};
        this.props && Object.entries(this.props).forEach(entry => props[entry[0]] = entry[1]);
        this.state && Object.entries(this.state).forEach(entry => props[entry[0]] = entry[1]);
        props.props && Object.entries(props.props).forEach(entry => props[entry[0]] = entry[1]);
        delete props.props;
        return (
            <section className="unifiAll">
                {React.createElement(window[props.section || 'Explainer'], props)}
            </section>
        );
    }
});