const Meeting = require("../models/meeting")
const UserMeeting = require("../models/user_meeting")
const async = require('async');
const jwt = require('jsonwebtoken');

const TOKEN_FORMAT_SLICE_LENGTH = 4;
const DELETE_SUCCESS_CODE = 1;
const DELETED_ITEM_COUNT_ONE = 1;


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
    const encryptedUserId = req.query.id;
    const userId = jwt.decode(encryptedUserId.slice(TOKEN_FORMAT_SLICE_LENGTH));

    // TODO: add check to NOT return data with missing user ID
    await UserMeeting.find({ $or: [{ organizer: userId }, { participant: userId }] }).populate('meeting participant')
        .then(async userMeetings => {
            const currentDate = Date.now();

            const pastMeetings = userMeetings.filter(userMeeting => userMeeting.meeting.startTime <= currentDate);
            const upcomingMeetings = userMeetings.filter(userMeeting => userMeeting.meeting.startTime > currentDate);
            res.json({
                data: { pastMeetings, upcomingMeetings }
            })
        })
};

// Details about a specific Meeting
exports.meeting_detail = function (req, res) {
    res.send('NOT IMPLEMENTED: Meeting Detail GET');
    // async.parallel({
    //     Meeting_count: function (callback) {
    //         Meeting.findById(req.params.id, callback); // Pass an empty object as match condition to find all documents of this collection
    //     },
    // }, function (err, results) {
    //     res.json({ error: err, data: results });
    // });
};


// Handle Meeting create on POST.
exports.meeting_create_post = async (req, res) => {


    const { title, description, startTime, endTime, organizer, participant } = req.body;

    if (!title || !description || !startTime || !endTime || !organizer || !participant) {
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
            organizer,
            participant,
            meeting: _id
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
exports.meeting_delete_post = async (req, res) => {
    // need to delete user meeting as well
    const userMeetingId = req.params.id;
    const encryptedUserId = req.body.user;
    const userId = jwt.decode(encryptedUserId.slice(TOKEN_FORMAT_SLICE_LENGTH));
    await UserMeeting.findOne({ _id: userMeetingId, $or: [{ organizer: userId }, { participant: userId }] })
        .populate("meeting")
        .then(response => {
            console.log("This is the DB meeting", response)
            Meeting.deleteOne({ _id: response.meeting._id }).then(dbResponse => {
                if (dbResponse.ok === DELETE_SUCCESS_CODE && dbResponse.n === DELETED_ITEM_COUNT_ONE) {
                    UserMeeting.deleteOne({ _id: userMeetingId, $or: [{ organizer: userId }, { participant: userId }] }).then(dbResponse => {
                        if (dbResponse.ok === DELETE_SUCCESS_CODE && dbResponse.n === DELETED_ITEM_COUNT_ONE) {
                            res.send({ success: true });
                            res.status(200)
                        } else if (dbResponse.ok === DELETE_SUCCESS_CODE && dbResponse.n > DELETED_ITEM_COUNT_ONE) {
                            res.send({ success: false, error: "No user_meeting deleted, but DB response OK. This is bad." });
                            res.status(200)
                        } else {
                            res.send({ success: false, error: "Error deleting user_meeting. This is also bad." });
                            res.status(500)
                        }
                    }).catch(err => {
                        console.log("Issue deleting a user_meeting. Error is ", err.message);
                        res.status(500);
                        res.json({ error: "Error deleting user_meeting but a meeting was deleted. This is a bad thing!" })
                    })
                } else if (dbResponse.ok === DELETE_SUCCESS_CODE && dbResponse.n > DELETED_ITEM_COUNT_ONE) {
                    res.send({ success: false, error: "No meeting deleted, but DB response OK" });
                    res.status(200)
                } else {
                    console.log(dbResponse)
                    res.send({ success: false, error: "Error deleting meeting" });
                    res.status(500)
                }
            })
        }).catch(
            err => {
                console.log("Issue deleting a meeting. Error is ", err.message);
                res.status(500);
                res.json({ error: "Error deleting user_meeting and meeting" })
            }
        )

    //60ff18eb3994723e17fee7ad

    // const meetingId = req.params.id;
    // const encryptedUserId = req.body.user;
    // const user = jwt.decode(encryptedUserId.slice(TOKEN_FORMAT_SLICE_LENGTH));

    // await UserAvailability.deleteOne({ user, _id: meetingId }).then(async dbResponse => {
    //     if (dbResponse.ok === DELETE_SUCCESS_CODE && dbResponse.n > DELETED_ITEM_COUNT_ONE) {
    //         res.send({ success: true });
    //         res.status(200)
    //     } else if (dbResponse.ok === DELETE_SUCCESS_CODE && dbResponse.n > DELETED_ITEM_COUNT_ONE) {
    //         res.send({ success: false, error: "No availability deleted, but DB response OK" });
    //         res.status(200)
    //     } else {
    //         res.send({ success: false, error: "Error deleting user_availability" });
    //         res.status(500)
    //     }
    // }).catch(err => {
    //     console.log("Issue deleting a user availability. Error is ", err.message);
    //     res.status(500);
    //     res.json({ error: "Error deleting user_availability" })
    // })
    // res.send('NOT IMPLEMENTED: Meeting delete POST');
};


// Handle Meeting update on POST.
exports.Meeting_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Meeting update POST');
};