/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Route to handle wx /wx element                                                  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')(); // router middleware for koa

const CsrfService = require('../../service/CsrfService.js');

router.get('/api/setToken', CsrfService.setToken);

router.post('/api/test', CsrfService.test);

module.exports = router.middleware();
