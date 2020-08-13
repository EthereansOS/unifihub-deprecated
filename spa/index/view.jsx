var Index = React.createClass({
    requiredScripts: [
        'spa/loader.jsx',
        "spa/index/StableCoin",
        "spa/index/Crafting",
        "spa/index/Dex",
        "spa/index/Grimoire"
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
    
    componentDidMount() {
        this.controller.loadData();
    },
    render() {
        return (
            <section className="OnePage">
                
            </section>
        );
    }
});