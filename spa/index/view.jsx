var Index = React.createClass({
    requiredScripts: [
        'spa/loader.jsx'
    ],
    requiredModules: [
        'spa/explainer'
    ],
    render() {
        return (
            <section className="unifiAll">
                <Explainer/>
            </section>
        );
    }
});