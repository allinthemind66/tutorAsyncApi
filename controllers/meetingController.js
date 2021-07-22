const Meeting = require("../models/meeting")
const UserMeeting = require("../models/user_meeting")
const async = require('async');
const jwt = require('jsonwebtoken');


// gets a count of existing meetings
exports.index = function (req, res) {
    async.parallel({
        meeting_count: function (callback) {
            Meeting.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
    }, function (err, results) {
        res.json({ error: err, data: results });
    });
};

// Display list of all Meetings specific to a user.
exports.meeting_list = async (req, res) => {
    const userId = req.body.userId;

    // TODO: add check to NOT return data with missing user ID
    await UserMeeting.find({ $or: [{ organizerId: userId }, { participantId: userId }] }).populate('meetingId')
        .then(async userMeetings => {
            res.json({
                data: userMeetings
            })
            return listOfMeetings
        }).then(response => res.json({ data: response }))
};

// Details about a specific Meeting
exports.meeting_detail = function (req, res) {
    async.parallel({
        Meeting_count: function (callback) {
            Meeting.findById(req.params.id, callback); // Pass an empty object as match condition to find all documents of this collection
        },
    }, function (err, results) {
        res.json({ error: err, data: results });
    });
};


// Handle Meeting create on POST.
exports.meeting_create_post = async (req, res) => {


    const { title, description, startTime, endTime, organizerUserId: organizerId, participantUserId: participantId } = req.body;

    if (!title || !description || !startTime || !endTime || !organizerId || !participantId) {
        res.status(500);
        res.json({ error: "Missing data for create meeting" })
    }

    const newMeeting = new Meeting({
        title,
        description,
        startTime,
        endTime,
        createdAt: Date.now()
    })

    await newMeeting.save().then(async databaseResponse => {
        const { _id } = databaseResponse;
        const newUserMeeting = new UserMeeting({
            organizerId,
            participantId,
            meetingId: _id
        })
        await newUserMeeting
            .save()
            .then(() => {
                // return empty body
                res.json();
            })
            .catch(err => {
                console.log("Issue creating a new user meeting relation. Error is ", err.message);
                res.status(500);
                // TODO: Delete newly created meeting if user_meeting save fails
                res.json({ error: "Error creating user_meeting" })
            })
    })
        .catch(err => {
            console.log("Issue creating a new meeting. Error is ", err.message);
            res.status(500);
            res.json({ error: "Error creating meeting" })
        })
};


// Handle Meeting delete on POST.
exports.Meeting_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Meeting delete POST');
};


// Handle Meeting update on POST.
exports.Meeting_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Meeting update POST');
};