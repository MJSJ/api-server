'use strict';

const IO = require( 'koa-socket' )
var allowedOrigins = "localhost:8080";
const io = new IO({
    namespace: 'ws',
    origins:allowedOrigins
})

io.on('message', ctx => {
    console.log( ctx.data )
    io.broadcast( 'response', "msg from server" )
})


module.exports = io;