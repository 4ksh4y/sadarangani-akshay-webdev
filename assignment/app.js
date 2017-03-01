/**
 * Created by Akshay on 2/17/2017.
 */
module.exports = function (app) {
    require('./services/user.service.server.js')(app);
    require('./services/website.service.server.js')(app);
    require('./services/page.service.server.js')(app);
    require('./services/widget.service.server.js')(app);
};