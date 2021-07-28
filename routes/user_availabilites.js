const express = require('express');
const router = express.Router();

const user_availability_controller = require('../controllers/userAvailabilityController');

// POST ROUTES
router.post('/create', user_availability_controller.availability_create_post);
router.post('/delete/:id', user_availability_controller.availability_delete_post);

// GET ROUTES
router.get('/list', user_availability_controller.availability_list);

router.get('/list/:id', user_availability_controller.user_availability_list);

module.exports = router;