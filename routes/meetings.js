const express = require('express');
const router = express.Router();

const meeting_controller = require('../controllers/meetingController');

// POST ROUTES
router.post('/create', meeting_controller.meeting_create_post);
router.post('/delete/:id', meeting_controller.meeting_delete_post);

// GET ROUTES
router.get('/list', meeting_controller.meeting_list);
router.get('/:id', meeting_controller.meeting_detail);

module.exports = router;