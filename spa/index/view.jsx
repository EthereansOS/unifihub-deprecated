var Index = React.createClass({
    requiredScripts: [
        'spa/loader.jsx'
    ],
    requiredModules: [
        'spa/explainer',
        'spa/uusd'
    ],
    render() {
        return (
            <section className="unifiAll">
                <Explainer/>
            </section>
        );
    }
});