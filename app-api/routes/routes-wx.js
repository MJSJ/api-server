/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Route to handle wx /wx element                                                  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')(); // router middleware for koa

const wxSerice = require('../../service/wxService.js');

router.get('/auth/MP_verify_oai1jPbiuXyaD710.txt', async function (ctx) {
    ctx.body = 'oai1jPbiuXyaD710';
});

router.get('/MP_verify_oai1jPbiuXyaD710.txt', async function (ctx) {
    ctx.body = 'oai1jPbiuXyaD710';
});


//测试绑定其他公众号
router.get('/MP_verify_LWMS70JBb0k89q4L.txt', async function (ctx) {
    ctx.body = 'LWMS70JBb0k89q4L';
});

router.get('/wx/auth/activity', wxSerice.authWxLogin);

router.get('/wx/jssdk', wxSerice.getJsSdkConf);

module.exports = router.middleware();
