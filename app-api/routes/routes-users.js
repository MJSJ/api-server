/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Users routes                                                                                */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')(); // router middleware for koa

const UserService = require('../../service/userService.js');

router.post(  '/cms/login',     UserService.postLogin); 
router.get(   '/logout',    UserService.getLogout);
router.get(   '/users',     UserService.getUsers);       // list users
router.get(   '/users/:id', UserService.getUserById);    // get user details
router.get(   '/doSomething',  UserService.doSomething); 
// router.post(  '/users',     users.postUsers);      // add new user
// router.patch( '/users/:id', users.patchUserById);  // update user details
// router.delete('/users/:id', users.deleteUserById); // delete user


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = router.middleware();
