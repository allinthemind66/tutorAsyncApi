const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');

// POST ROUTES
router.post('/login', user_controller.login);
router.post('/create', user_controller.user_create_post);



module.exports = router;
