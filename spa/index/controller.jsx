var IndexController = function (view) {
    var context = this;
    context.view = view;

    context.onSection = function onSection() {
        var section = window.addressBarParams.section;
        delete window.addressBarParams.section;
        if(window.location.hostname.indexOf(window.context.domainData.name) !== -1) {
            section = window.location.hostname.split('.')[0];
            section = window.context.domainData.sections[section];
        }
        section && this.sectionChange(section);
    };
};