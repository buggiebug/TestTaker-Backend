const express = require('express')
const router = express.Router();

const { getAllQuestions, createQuestion, updateQuestion, deleteQuestion, getAquestion } = require('../Controllers/questionsController');
const { isAuthenticatedAdmin,authorizedAdminRoles } = require('../Middleware/authentication');

router.route('/questions').get(getAllQuestions);
router.route('/admin/questions/new').post(isAuthenticatedAdmin,authorizedAdminRoles("admin"),createQuestion);
router.route('/admin/questions/:id').put(isAuthenticatedAdmin,authorizedAdminRoles("admin"),updateQuestion).delete(isAuthenticatedAdmin,authorizedAdminRoles("admin"),deleteQuestion);
router.route('/questions/:id').get(getAquestion);

module.exports = router;