const User = require("../models/user")
const async = require('async');


// gets a count of existing users
exports.index = function (req, res) {
    async.parallel({
        user_count: function (callback) {
            User.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
    }, function (err, results) {
        res.json({ error: err, data: results });
    });
};

// Display list of all Users.
exports.user_list = function (req, res) {
    res.send('NOT IMPLEMENTED: User list');
};

// Details about a specific user
exports.user_detail = function (req, res) {
    async.parallel({
        user_count: function (callback) {
            User.findById(req.params.id, callback); // Pass an empty object as match condition to find all documents of this collection
        },
    }, function (err, results) {
        res.json({ error: err, data: results });
    });
};

// Display User create form on GET.
exports.user_create_get = function (req, res) {
    res.send('NOT IMPLEMENTED: User create GET');
};

// Handle User create on POST.
exports.user_create_post = function (req, res) {
    res.send('NOT IMPLEMENTED: User create POST');
};

// Display User delete form on GET.
exports.user_delete_get = function (req, res) {
    res.send('NOT IMPLEMENTED: User delete GET');
};

// Handle User delete on POST.
exports.user_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: User delete POST');
};

// Display User update form on GET.
exports.user_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: User update GET');
};

// Handle User update on POST.
exports.user_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: User update POST');
};