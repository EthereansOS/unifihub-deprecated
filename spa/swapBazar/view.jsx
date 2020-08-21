var SwapBazar = React.createClass({
    requiredModules: [
        'spa/dappMenu'
    ],
    render() {
        return (<iframe ref={ref => window.uniswap = ref} src="https://uniswap.exchange" style={{"width": "100%", "height": "100%", "border": "none"}}></iframe>);
    }
});