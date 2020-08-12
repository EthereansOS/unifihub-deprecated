var BigLoader = React.createClass({
  getDefaultSubscriptions() {
    return {
      'loader/show' : () => this.setState({propagate : false, transaction: 0, chunks: 0}, () => this.domRoot.css('display', 'block')),
      'loader/propagate': this.propagate,
      'loader/hide' : this.hideLoader,
      'loader/transaction' : this.transaction,
      'loader/chunks' : chunks => this.setState({propagate : false, transaction: 0, chunks}, () => this.domRoot.css('display', 'block'))
    }
  },
  getInitialState() {
    return {
      counter: 60
    };
  },
  propagate(links, callback) {
    var _this = this;
    links && links.forEach(link => window.AJAXRequest(link.split('ipfs://').join('//gateway.ipfs.io/')));
    var myInterval = function interval() {
      if (_this.state.counter === 0) {
          _this.interval && clearInterval(_this.interval);
          return callback && callback();
      }
      _this.setState({ counter: _this.state.counter - 1, chunks: 0 });
    };
    _this.interval && clearInterval(_this.interval);
    _this.setState({ counter: 60, propagate: true, transaction: 0, chunks: 0 }, function () {
      _this.domRoot.css('display', 'block');
      _this.interval = setInterval(myInterval, 1000);
    });
  },
  hideLoader() {
    this.interval && clearInterval(this.interval);
    this.domRoot.css('display', 'none');
    this.setState({propagate: false, transaction: 0, chunks: 0});
  },
  transaction(transaction, transactions) {
    this.interval && clearInterval(this.interval);
    this.setState({transaction, transactions, propagate: false, chunks: 0});
  },
  render() {
    return (<section className="UPLOADBANNER">
      {this.state.chunks && <h1>Generating {this.state.chunks} chunks...</h1>}
      {!this.state.chunks && !this.state.propagate && !this.state.transaction && <h1>{this.props.message !== undefined && this.props.message !== null ? this.props.message : 'Loading...'}</h1>}
      {!this.state.chunks && this.state.propagate && <h1>{this.state.counter}</h1>}
      {!this.state.chunks && this.state.propagate && <h2>Waiting for Propagation</h2>}
      {!this.state.chunks && this.state.transaction && <h2>Transaction {this.state.transaction} {this.state.transactions > 1 && <span>of {this.state.transactions}</span>}</h2>}
      <div class="loadingio-spinner-ripple-6l4nh0xpwdg"><div class="ldio-2it1sjbil3o">
        <div></div><div></div>
      </div></div>
    </section>);
  }
});