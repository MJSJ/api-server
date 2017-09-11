'use strict';

const IO = require( 'koa-socket' )
var allowedOrigins = "http://localhost:* http://127.0.0.1:*";
const io = new IO({
    namespace: 'ws',
    ioOptions:{
        origins:allowedOrigins
    }
})

io.on('message', ctx => {
    console.log( ctx.data )
    io.broadcast( 'response', "msg from server" )
})


module.exports = io;