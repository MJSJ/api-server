'use strict';

const IO = require( 'koa-socket' )
var allowedOrigins = "http://localhost:* http://127.0.0.1:*";
var path ='/ws';
const io = new IO({
    namespace: 'ws',
    ioOptions:{
        origins:allowedOrigins,
        path:path
    }
})

io.on('message', ctx => {
    console.log( ctx.data )
    io.broadcast( 'response', "msg from server" )
})


module.exports = io;