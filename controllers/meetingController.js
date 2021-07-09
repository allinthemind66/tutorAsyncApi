const Meeting = require("../models/meeting")
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

// Display list of all Meetings.
exports.meeting_list = function (req, res) {
    res.send('NOT IMPLEMENTED: Meeting list');
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
    res.send('NOT IMPLEMENTED: Meeting create GET');
};


// Handle Meeting delete on POST.
exports.Meeting_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Meeting delete POST');
};


// Handle Meeting update on POST.
exports.Meeting_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Meeting update POST');
};