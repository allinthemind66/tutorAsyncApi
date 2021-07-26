const express = require('express');
const router = express.Router();

const meeting_controller = require('../controllers/meetingController');

// http://localhost:9000/meetings/create
// POST request for creating user.
router.post('/create', meeting_controller.meeting_create_post);

router.get('/list', meeting_controller.meeting_list);

router.get('/:id', meeting_controller.meeting_detail);

router.post('/delete/:id', meeting_controller.meeting_delete_post);

module.exports = router;