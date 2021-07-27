const express = require('express');
const router = express.Router();

const user_subject_controller = require('../controllers/userSubjectController');

// http://localhost:9000/meetings/create
// POST request for creating user.
router.post('/create', user_subject_controller.user_subject_create_post);

router.get('/list', user_subject_controller.user_subject_list);

router.get('/list/:id', user_subject_controller.user_specific_subject_list)

router.post('/delete/:id', user_subject_controller.user_subject_delete_post);

module.exports = router;