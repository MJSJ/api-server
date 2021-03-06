/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* API app - RESTful API for API interface and/or ajax functions.                                 */
/*                                                                                                */
/* The API provides GET / POST / PATCH / DELETE methods on a variety of resources.                */
/*                                                                                                */
/* 2xx responses honour the request Accept type (json/xml/yaml/text) for the response body;       */
/* 4xx/5xx responses provide a simple text message in the body.                                   */
/*                                                                                                */
/* A GET on a collection which returns no results returns a 204 / No Content response.            */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const Koa       = require('koa');          // Koa framework
const jwt       = require('jsonwebtoken'); // JSON Web Token implementation
const bunyan    = require('bunyan');       // logging
const koaLogger = require('koa-bunyan');   // logging
const cors = require('koa-cors');
const app = new Koa(); // API app


// content negotiation: api will respond with json, xml, or yaml
app.use(async function contentNegotiation(ctx, next) {
    await next();

    if (!ctx.body) return; // no content to return
    const type = ctx.accepts('json', 'text', 'html');
});

app.use(cors({
    "credentials":true
}));

// csrf
app.use(async function checkCsrf(ctx, next) {
    await next();
    // if (ctx.path !== '/api/setToken'){
        // console.log(ctx.session);
    // }
    // if (ctx.path === '/api/setToken' || ctx.method === 'GET') {
    //     await next();
    //     return;
    // }
    // const csrf = ctx.request.body.csrf || '';
    // this.session.csrf = this.session.csrf || '';
    // if(this.session.csrf !== csrf){
    //     console.log('session:'+this.session.csrf);
    //     console.log('post:'+csrf);
    //     ctx.body = 'Invalid CSRF token';
    // } else {
    //     await next();
    //     return;
    // }
});

// handle thrown or uncaught exceptions anywhere down the line
app.use(async function handleErrors(ctx, next) {
    try {

        await next();

    } catch (e) {
        ctx.status = e.status || 500;
        switch (ctx.status) {
            case 204: // No Content
                break;
            case 401: // Unauthorized
                ctx.set('WWW-Authenticate', 'Basic');
                break;
            case 403: // Forbidden
            case 404: // Not Found
            case 406: // Not Acceptable
            case 409: // Conflict
                ctx.body = { message: e.message, root: 'error' };
                break;
            default:
            case 500: // Internal Server Error (for uncaught or programming errors)
                console.error(ctx.status, e.message);
                ctx.body = { message: e.message, root: 'error' };
                if (app.env != 'production') ctx.body.stack = e.stack;
                ctx.app.emit('error', e, ctx); // github.com/koajs/koa/wiki/Error-Handling
                break;
        }
    }
});


// set up MySQL connection
app.use(async function mysqlConnection(ctx, next) {
    try {

        // keep copy of ctx.state.db in global for access from models
        // ctx.state.db = global.db = await global.connectionPool.getConnection();
        // ctx.state.db.connection.config.namedPlaceholders = true;
        // // traditional mode ensures not null is respected for unsupplied fields, ensures valid JavaScript dates, etc
        // await ctx.state.db.query('SET SESSION sql_mode = "TRADITIONAL"');

        await next();

        // ctx.state.db.release();

    } catch (e) {
        // note if getConnection() fails we have no this.state.db, but if anything downstream throws,
        // we need to release the connection
        if (ctx.state.db) ctx.state.db.release();
        throw e;
    }
});


// logging
const access = { type: 'rotating-file', path: './logs/api-access.log', level: 'trace', period: '1d', count: 4 };
const error  = { type: 'rotating-file', path: './logs/api-error.log',  level: 'error', period: '1d', count: 4 };
const warn  = { type: 'rotating-file', path: './logs/api-warn.log',  level: 'warn', period: '1d', count: 4 };
const info  = { type: 'rotating-file', path: './logs/api-info.log',  level: 'info', period: '1d', count: 4 };
const debug  = { type: 'rotating-file', path: './logs/api-debug.log',  level: 'debug', period: '1d', count: 4 };
const trace  = { type: 'rotating-file', path: './logs/api-trace.log',  level: 'trace', period: '1d', count: 4 };
const logger = bunyan.createLogger({ name: 'api', streams: [ access, error,warn,debug,trace, info] });
app.use(koaLogger(logger, {}));


// ------------ routing




// remaining routes require JWT auth (obtained from /auth and supplied in bearer authorization header)
//auth路径下的需要授权
// app.use(async function verifyJwt(ctx, next) {
//     if(ctx.originalUrl.indexOf("auth")>-1){
//         if (!ctx.header.authorization) ctx.throw(401, 'Authorisation required');
//         const [ scheme, token ] = ctx.header.authorization.split(' ');
//         if (scheme != 'Bearer') ctx.throw(401, 'Invalid authorisation');

//         const roles = { g: 'guest', a: 'admin', s: 'su' };

//         try {
//             const payload = jwt.verify(token, 'koa-sample-app-signature-key'); // throws on invalid token

//             // valid token: accept it...
//             ctx.state.user = payload;                  // for user id  to look up user details
//             ctx.state.user.Role = roles[payload.role]; // for authorisation checks
//         } catch (e) {
//             if (e.message == 'invalid token') ctx.throw(401, 'Invalid JWT'); // Unauthorized
//             ctx.throw(e.status||500, e.message); // Internal Server Error
//         }
//     } 

//     await next();
// });

app.use(require('./routes/routes-auth.js'));
app.use(require('./routes/routes-users.js'));
app.use(require('./routes/routes-score.js'));
app.use(require('./routes/routes-wx.js'));
app.use(require('./routes/routes-csrf.js'));
app.use(require('./routes/routes-cms.js'));

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = app;
