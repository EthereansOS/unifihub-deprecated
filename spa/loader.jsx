var LoaderMini = React.createClass({
    
    renderLoader01() {
        return this.renderInput("assets/img/loader1.gif", "loaderMini");
    },
    renderLoader1() {
        return this.renderInput("assets/img/loader1.gif", "loaderRegular");
    },
    renderLoader02() {
        return this.renderInput("assets/img/loader2.gif", "loaderMini");
    },
    renderLoader2() {
        return this.renderInput("assets/img/loader2.gif", "loaderRegular");
    },
    renderLoader03() {
        return this.renderInput("assets/img/loader3.gif", "loaderMini");
    },
    renderLoader3() {
        return this.renderInput("assets/img/loader3.gif", "loaderRegular");
    },
    renderLoader04() {
        return this.renderInput("assets/img/loader4.gif", "loaderMini");
    },
    renderLoader4() {
        return this.renderInput("assets/img/loader4.gif", "loaderRegular");
    },
    
    
renderInput(loaderImg, loaderClass) {
    var _this = this;
    return (
        <img className={loaderClass} src={loaderImg}></img>
    );
}
});