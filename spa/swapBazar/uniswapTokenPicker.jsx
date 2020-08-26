var UniswapTokenPicker = React.createClass({
    getDefaultSubscriptions() {
        return {
            'ethereum/update' : () => this.setState({key: null, selected : null})
        };
    },
    onSectionChange(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        var key = e.currentTarget.dataset.key;
        var _this = this;
        this.setState({ key, selected: null }, function () {
            _this.props.onChange && setTimeout(() => _this.props.onChange(null));
        });
    },
    close(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        this.setState({ opened: null });
    },
    open(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        var _this = this;
        var oldTarget = e.currentTarget;
        this.setState({ opened: true }, function () {
            _this.opened && (_this.opened.onblur = _this.opened.onblur || function onblur(e) {
                e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
                e.relatedTarget && e.relatedTarget !== oldTarget && e.relatedTarget.click();
                e.relatedTarget && e.relatedTarget !== oldTarget && _this.opened && _this.opened.focus();
               // (!e.relatedTarget || (e.relatedTarget !== oldTarget && !e.relatedTarget.dataset.key)) && _this.setState({ opened: null });
            }) && _this.opened.focus();
        });
    },
    onClick(e) {
        e && e.preventDefault && e.preventDefault(true) && e.stopPropagation && e.stopPropagation(true);
        var _this = this;
        this.setState({ opened: null, key: this.getKey(), selected: parseInt(e.currentTarget.dataset.index) }, function () {
            _this.props.onChange && setTimeout(() => _this.props.onChange(_this.props.tokensList[_this.state.key][_this.state.selected]));
        });
    },
    getKey() {
        var key = null;
        try {
            key = (this.state && this.state.key) || Object.keys(this.props.tokensList)[0];
        } catch (e) {
        }
        return key;
    },
    renderOpened() {
        var _this = this;
        var thisKey = this.getKey();
        return (<section className="BazSelectorContainer" tabIndex="-1" ref={ref => this.opened = ref}>
            <section className="BazSelectorContainerClose">
                <a href="javascript:;" onClick={this.close}>X</a>
            </section>
            <section className="BazSelectorContainerMenu">
                <section className="BazSelectorContainerMenuintern">
                    {this.props.tokensList && Object.keys(this.props.tokensList).map(key => <li key={key} className={thisKey === key ? "Selected" : undefined}>
                        <a href="javascript;" data-key={key} onClick={_this.onSectionChange}>{key}</a>
                    </li>)}
                </section>
            </section>
            {thisKey && <section className="BazSelectorContainerObjects">
                {this.props.tokensList[thisKey].map((it, i) => {
                    if (!it) {
                        return;
                    }
                    return (<li key={it.address} className={this.state.selected === i ? "Selected" : undefined}>
                        {this.renderInput(it, this.onClick, i)}
                    </li>);
                })}
            </section>}
        </section>);
    },
    renderInput(it, onClick, i) {
        var key = this.getKey();
        return (<a href="javascript;" data-index={i} onClick={onClick}>
            {key !== "Indexes" && <img src={it.logo || it.logoURI || window.context.trustwalletImgURLTemplate.format(it.address)} />}
            <p>{it.symbol}</p>
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
            {!selected && <a href="javascript:;" onClick={this.open}>Select</a>}
        </section>);
    },
    render() {
        return (
        <section className="BazTokenSelector">
            {this.state && this.state.opened && this.renderOpened()}
            {this.state && this.state.opened && <section className="Boh"></section>}
            {(!this.state || !this.state.opened) && this.renderClosed()}
        </section>);
    }
});