/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Route to handle wx /wx element                                                  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')(); // router middleware for koa

const wxSerice = require('../../service/wxService.js');

router.get('/auth/MP_verify_oai1jPbiuXyaD710.txt', async function (ctx) {
    ctx.body = 'oai1jPbiuXyaD710';
});

router.get('/wx/auth/activity', wxSerice.authWxLogin);

module.exports = router.middleware();
