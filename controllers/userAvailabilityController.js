const UserAvailability = require("../models/user_availability")
const async = require('async');
const jwt = require('jsonwebtoken');




// Display list of all availabilites specific to a user.
exports.availability_list = async (req, res) => {
    const userId = req.body.userId;

    // TODO: add check to NOT return data with missing user ID
    await UserAvailability.find({ userId }).populate('meetingId')
        .then(async userAvailabilities => {
            res.json({
                data: userAvailabilities
            })
        })
};

// Handle User availability create on POST.
exports.availability_create_post = async (req, res) => {
    const userId = req.body.userId;
    const timeslotStart = req.body.timeslotStart;
    const timeslotEnd = req.body.timeslotEnd;

    const newUserAvailability = new UserAvailability({
        userId,
        timeslotStart,
        timeslotEnd,
    }).save()
        .then(() => {
            res.json()
        })
        .catch(err => {
            console.log("Issue creating a new user availability. Error is ", err.message);
            res.status(500);
            res.json({ error: "Error creating user_availability" })
        })
};


// Handle availability delete on POST.
exports.availability_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: availability delete POST');
};


// Handle availability update on POST.
exports.availability_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: availability update POST');
};