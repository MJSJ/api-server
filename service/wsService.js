'use strict';

const IO = require( 'koa-socket' )
const io = new IO({
    namespace: 'ws'
})

io.on('message', ctx => {
    console.log( ctx.data )
    io.broadcast( 'response', "msg from server" )
})


module.exports = io;