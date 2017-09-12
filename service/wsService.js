'use strict';

const IO = require( 'koa-socket' )
var allowedOrigins = "http://localhost:* http://127.0.0.1:*";
const io = new IO({
    namespace: 'ws',
    ioOptions:{
        origins:allowedOrigins
    }
})

io.on('connection', sock => {
    io.on('disconnect', function () {
        console.log("connected")
    });
    
    io.on('message', ctx => {
        console.log( ctx.data )
        io.broadcast( 'response', "you just said"+ctx.data )
    })
})


module.exports = io;