/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Users routes                                                                                */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')(); // router middleware for koa
const ScoreService = require('../../service/scoreService.js');
router.get(   '/score', ScoreService.getScoresByUser);    // get user details
router.get(   '/score/top', ScoreService.getTop);    // get user details
router.post(   '/score', ScoreService.postScore);    // get user details
router.get(   '/latestScore', ScoreService.getLatestScore);    // get user details
// router.post(  '/users',     users.postUsers);      // add new user
// router.patch( '/users/:id', users.patchUserById);  // update user details
// router.delete('/users/:id', users.deleteUserById); // delete user


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = router.middleware();
