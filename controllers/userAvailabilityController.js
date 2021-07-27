const UserAvailability = require("../models/user_availability")
const async = require('async');
const jwt = require('jsonwebtoken');
const { TOKEN_FORMAT_SLICE_LENGTH, DELETE_SUCCESS_CODE, DELETED_AVAILABILITY_COUNT_ONE } = require("./controllerConstants")


/**
 * Displays a list of all availabilites specific to a user.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.availability_list = async (req, res) => {
    const encryptedUserId = req.query.id;
    const user = jwt.decode(encryptedUserId.slice(TOKEN_FORMAT_SLICE_LENGTH));

    // TODO: add check to NOT return data with missing user ID
    await UserAvailability.find({ user }).populate('meeting user')
        .then(async userAvailabilities => {
            res.json({
                data: userAvailabilities
            })
        })
};

/**
 * Handles creation of availability for a specific user
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.availability_create_post = async (req, res) => {
    const encryptedUserId = req.body.user;
    const user = jwt.decode(encryptedUserId.slice(TOKEN_FORMAT_SLICE_LENGTH));
    const timeslotStart = req.body.timeslotStart;
    const timeslotEnd = req.body.timeslotEnd;

    new UserAvailability({
        user,
        timeslotStart,
        timeslotEnd,
    }).save()
        .then(async (availability) => {
            await UserAvailability.find({ _id: availability._id }).populate("user").then(response => res.json(response))
            res.json(availability)
        })
        .catch(err => {
            console.log("Issue creating a new user availability. Error is ", err.message);
            res.status(500);
            res.json({ error: "Error creating user_availability" })
        })
};

/**
 * Handles deletion of an availability tied to a user
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.availability_delete_post = async (req, res) => {
    const meetingId = req.params.id;
    const encryptedUserId = req.body.user;
    const user = jwt.decode(encryptedUserId.slice(TOKEN_FORMAT_SLICE_LENGTH));

    await UserAvailability.deleteOne({ user, _id: meetingId }).then(async dbResponse => {
        if (dbResponse.ok === DELETE_SUCCESS_CODE && dbResponse.n === DELETED_AVAILABILITY_COUNT_ONE) {
            res.send({ success: true });
            res.status(200)
        } else if (dbResponse.ok === DELETE_SUCCESS_CODE && dbResponse.n > DELETED_AVAILABILITY_COUNT_ONE) {
            res.send({ success: false, error: "No availability deleted, but DB response OK" });
            res.status(200)
        } else {
            res.send({ success: false, error: "Error deleting user_availability" });
            res.status(500)
        }
    }).catch(err => {
        console.log("Issue deleting a user availability. Error is ", err.message);
        res.status(500);
        res.json({ error: "Error deleting user_availability" })
    })
};


// Handle availability update on POST.
exports.availability_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: availability update POST');
};