const UserAvailability = require("../models/user_availability")
const async = require('async');
const jwt = require('jsonwebtoken');



// Display list of all availabilites specific to a user.
exports.availability_list = async (req, res) => {
    res.send('NOT IMPLEMENTED: User availability list');
};

// Handle User availability create on POST.
exports.availability_create_post = async (req, res) => {
    res.send('NOT IMPLEMENTED: User availability create');
};


// Handle availability delete on POST.
exports.availability_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: availability delete POST');
};


// Handle availability update on POST.
exports.availability_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: availability update POST');
};