const User = require("../models/user")
const async = require('async');
const jwt = require('jsonwebtoken');


// gets a count of existing users - KEEPING COMMENTED CODE FOR REFERENCE
// exports.index = function (req, res) {
//     async.parallel({
//         user_count: function (callback) {
//             User.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
//         },
//     }, function (err, results) {
//         res.json({ error: err, data: results });
//     });
// };

exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;


    await User.findOne({ email: email }, function (err, user) {
        // test a matching password
        if (!user) {
            res.status(500);
            res.json({ error: "User not found!" })
        }
        user.validatePassword(password).then(isPasswordCorrect => {
            if (err) throw err;
            if (!isPasswordCorrect) {
                res.status(500);
                res.json({ error: "Email or password not correct" })
            } else {
                const { _id, firstName, lastName, email } = user;
                const token = jwt.sign(_id.toJSON(), process.env.TOKEN_SECRET);
                const response = { firstName: firstName, lastName: lastName, email: email, success: true, token: token }

                res.status(200).send(response);
            }
        })
    }).catch(err => {
        console.log("Error is", err.message);
    });
};

// Display list of all Users.
exports.user_list = function (req, res) {
    res.send('NOT IMPLEMENTED: User list');
};

//
// Details about a specific user - KEEPING COMMENTED CODE FOR LATER REFERENCE
// exports.user_detail = function (req, res) {
//     async.parallel({
//         user_count: function (callback) {
//             User.findById(req.params.id, callback); // Pass an empty object as match condition to find all documents of this collection
//         },
//     }, function (err, results) {
//         res.json({ error: err, data: results });
//     });
// };


// Handle User create on POST.
exports.user_create_post = async (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const passwordsMatch = password === confirmPassword;


    if (!passwordsMatch) {
        res.status(500);
        res.json({ error: "Password and confirm password do not match!" })
        return;
        // throw new Error("Password and confirm password do not match!")
    }


    await User.findOne({ email: req.body.email })
        .then(async profile => {
            if (!profile) {
                const newUser = new User({
                    firstName,
                    lastName,
                    email,
                    password,
                    confirmPassword,
                    createdAt: Date.now()
                });
                await newUser
                    .save()
                    .then((databaseResponse) => {
                        const { _id, firstName, lastName, email } = databaseResponse;
                        const token = jwt.sign(_id.toJSON(), process.env.TOKEN_SECRET);
                        const response = { firstName: firstName, lastName: lastName, email: email, success: true, token: token }
                        // successfully saved new User to DB
                        // need to create JWT token here for local storage
                        res.status(200).send(response);
                    })
                    .catch(err => {
                        console.log("Issue creating a new user. Error is ", err.message);
                        res.status(500);
                        res.json({ error: "Error creating user" })
                    });
            } else {
                res.status(500);
                res.json({ error: "User with that email already exists!" })
            }
        })
        .catch(err => {
            console.log("Error is", err.message);
        });
};


// Handle User delete on POST.
exports.user_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: User delete POST');
};

// Handle User update on POST.
exports.user_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: User update POST');
};