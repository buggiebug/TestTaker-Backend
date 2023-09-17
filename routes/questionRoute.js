const express = require('express')
const router = express.Router();

const { allSubjectsName,searchBySubjectName,getAllQuestions, createQuestion, updateQuestion, deleteQuestion, getAquestion } = require('../controllers/questionsController');
const { isAuthenticatedAdmin,authorizedAdminRoles } = require('../middleware/authentication');

router.route('/questions/all-subjects').get(allSubjectsName);
router.route('/questions/all-subjects/:subject').get(searchBySubjectName);
router.route('/questions').get(getAllQuestions);
router.route('/admin/questions/new').post(isAuthenticatedAdmin,authorizedAdminRoles("admin","writer"),createQuestion);
router.route('/admin/questions/:id').put(isAuthenticatedAdmin,authorizedAdminRoles("admin","writer"),updateQuestion).delete(isAuthenticatedAdmin,authorizedAdminRoles("admin"),deleteQuestion);
router.route('/questions/:id').get(getAquestion);

module.exports = router;
