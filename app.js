
'use strict';
/* eslint no-shadow:off *//* app is already declared in the upper scope */

const Koa      = require('koa');            // Koa framework
const body     = require('koa-body');       // body parser
const compose  = require('koa-compose');    // middleware composer
const compress = require('koa-compress');   // HTTP compression
const mysql    = require('mysql2/promise'); // fast mysql driver
const debug    = require('debug')('app');   // small debugging utility
// const csrf     = require('koa-csrf')
// require('dotenv').config(); // loads environment variables from .env file (if available - eg dev env)





const env       = "production";
const path      = require("path");
const session = require('koa-generic-session');
const MysqlStore = require('koa-mysql-session')
const config    = require(path.join(__dirname, '.', 'config', 'config.json'))[env];

const app = new Koa();

//websocket
const io = require("./service/wsService.js")
io.attach(app)

/* set up middleware which will be applied to each request - - - - - - - - - - - - - - - - - - -  */

// CSRF 有bug

// app.use(new csrf({
//   invalidSessionSecretMessage: 'Invalid session secret',
//   invalidSessionSecretStatusCode: 403,
//   invalidTokenMessage: 'Invalid CSRF token',
//   invalidTokenStatusCode: 403,
//   excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ],
//   disableQuery: false
// }))

// return response time in X-Response-Time header
app.use(async function responseTime(ctx, next) {
    const t1 = Date.now();
    await next();
    const t2 = Date.now();
    ctx.set('X-Response-Time', Math.ceil(t2-t1)+'ms');
});


// HTTP compression
app.use(compress({}));


// only search-index www subdomain
app.use(async function robots(ctx, next) {
    await next();
    if (ctx.hostname.slice(0,3) != 'www') ctx.response.set('X-Robots-Tag', 'noindex, nofollow');
});


// parse request body into ctx.request.body
app.use(body());


// session
const APP_NAME = 'mjsj';
const THIRTY_MINTUES = 30 * 60 * 1000;
app.keys = [APP_NAME]
app.use(session({
    store:new MysqlStore({
        user: config.username,
        password: config.password,
        database: config.database,
        host: config.host
    }),
    key:APP_NAME+'.sid',
    rolling: true,
    cookie: {
        maxage:THIRTY_MINTUES
    }
}));

// sometimes useful to be able to track each request...
app.use(async function(ctx, next) {
    debug(ctx.method + ' ' + ctx.url);
    await next();
});


app.use(async function composeSubapp(ctx) { // note no 'next' after composed subapp
    // switch (ctx.state.subapp) {
    //     case 'admin': await compose(require('./app-admin/app-admin.js').middleware)(ctx); break;
    //     case 'api':   await compose(require('./app-api/app-api.js').middleware)(ctx);     break;
    //     case 'www':   await compose(require('./app-www/app-www.js').middleware)(ctx);     break;
    //     default: // no (recognised) subdomain? canonicalise host to www.host
    //         // note switch must include all registered subdomains to avoid potential redirect loop
    //         ctx.redirect(ctx.protocol+'://'+'www.'+ctx.host+ctx.path+ctx.search);
    //         break;
    // }
    await compose(require('./app-api/app-api.js').middleware)(ctx);
});




/* create server - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */


app.listen(process.env.PORT||8081);
// console.info(`${process.version} listening on port ${process.env.PORT||3000} (${app.env}/${config.database})`);


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports  = app;
