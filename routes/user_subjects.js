const express = require('express');
const router = express.Router();

const user_subject_controller = require('../controllers/userSubjectController');

// POST ROUTES
router.post('/create', user_subject_controller.user_subject_create_post);
router.post('/delete/:id', user_subject_controller.user_subject_delete_post);

// GET ROUTES
router.get('/list', user_subject_controller.user_subject_list);
router.get('/list/:id', user_subject_controller.user_specific_subject_list)

module.exports = router;