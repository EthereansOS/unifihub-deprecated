var UniswapTokenPicker = React.createClass({
    onSectionChange(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        var key = e.currentTarget.dataset.key;
        var _this = this;
        this.setState({ key, selected: null }, function() {
            _this.props.onChange && setTimeout(() => _this.props.onChange(null));
        });
    },
    close(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        this.setState({ opened: null });
    },
    open(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        this.setState({ opened: true });
    },
    onClick(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        var _this = this;
        this.setState({ opened: null, selected: parseInt(e.currentTarget.dataset.index) }, function () {
            _this.props.onChange && setTimeout(() => _this.props.onChange(_this.props.tokensList[_this.state.key][_this.state.selected]));
        });
    },
    renderOpened() {
        var _this = this;
        return (<section>
            <section>
                <a href="javascript:;" onClick={this.close}>X</a>
            </section>
            <section>
                {this.props.tokensList && Object.keys(this.props.tokensList).map(key => <li key={key} className={(this.state && this.state.key) === key ? "Selected" : undefined}>
                    <a href="javascript;" data-key={key} onClick={_this.onSectionChange}>{key}</a>
                </li>)}
            </section>
            {this.state && this.state.key && <section>
                {this.props.tokensList[this.state.key].map((it, i) => <li key={it.address} className={this.state.selected === i ? "Selected" : undefined}>
                    {this.renderInput(it, this.onClick, i)}
                </li>)}
            </section>}
        </section>);
    },
    renderInput(it, onClick, i) {
        return (<a href="javascript;" data-index={i} onClick={onClick}>
            <img src={it.logo} />
            <span>{it.symbol}</span>
        </a>);
    },
    renderClosed() {
        var selected = undefined;
        try {
            selected = this.props.tokensList[this.state.key][this.state.selected];
        } catch (e) {
        }
        return (<section>
            {selected && this.renderInput(selected, this.open)}
            {!selected && <a href="javascript:;" onClick={this.open}>Select token...</a>}
        </section>);
    },
    render() {
        return (<section>
            {this.state && this.state.opened && this.renderOpened()}
            {(!this.state || !this.state.opened) && this.renderClosed()}
        </section>);
    }
});