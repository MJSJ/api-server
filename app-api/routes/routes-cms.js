/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Users routes                                                                                */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')(); // router middleware for koa

const SubjectService = require('../../service/subjectService.js');

router.get('/cms/fetchSubjectList',    SubjectService.fetchSubjectList);
router.get('/cms/fetchSubject',    SubjectService.fetchSubject);
router.post('/cms/deleteSubject',    SubjectService.deleteSubject);
router.post('/cms/updateSubject',    SubjectService.updateSubject);

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = router.middleware();