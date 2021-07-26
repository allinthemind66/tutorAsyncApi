const express = require('express');
const router = express.Router();

const user_availability_controller = require('../controllers/userAvailabilityController');

// http://localhost:9000/meetings/create
// POST request for creating user.
router.post('/create', user_availability_controller.availability_create_post);

router.get('/list', user_availability_controller.availability_list);

router.post('/delete/:id', user_availability_controller.availability_delete_post);

module.exports = router;