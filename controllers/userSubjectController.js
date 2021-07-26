const UserSubject = require("../models/user_subject")
const async = require('async');
const jwt = require('jsonwebtoken');


const TOKEN_FORMAT_SLICE_LENGTH = 4;

// Display list of all availabilites specific to a user.
exports.user_subject_list = async (req, res) => {

    const encryptedUserId = req.query.id;
    const subjectString = req.query.subject;

    const userId = jwt.decode(encryptedUserId.slice(TOKEN_FORMAT_SLICE_LENGTH)); // TO DO implement authentication

    await UserSubject.find({ title: subjectString }).populate("user").then(userSubjects => {
        const subjects = userSubjects.map(subject => {
            return { subject: subject.subjectTitle, user: { _id: subject.user._id, firstName: subject.user.firstName, lastName: subject.user.lastName } }
        })
        res.json({ data: { subjects } })
    }
    );

};

// Handle User availability create on POST.
exports.user_subject_create_post = async (req, res) => {
    const encryptedUserId = req.body.user;
    const subject = req.body.subject;
    const description = req.body.description;

    const userId = jwt.decode(encryptedUserId.slice(TOKEN_FORMAT_SLICE_LENGTH));

    await UserSubject.findOne({ _id: userId, subject: subject }).then(async userSubject => {
        if (!userSubject) {
            const newUserSubject = new UserSubject({
                user: userId,
                name: subject,
                description
            });
            await newUserSubject
                .save()
                .then(response => {
                    // successfully saved new User to DB
                    // need to create JWT token here for local storage
                    res.status(200).send(response);
                })
                .catch(err => {
                    console.log("Issue creating a new user subject. Error is ", err.message);
                    res.status(500);
                    res.json({ error: "Error creating user subject" })
                });
        } else {
            res.status(500);
            res.json({ error: "A subject tied to that user already exists!" })
        }
    })
};


// Handle availability delete on POST.
exports.user_subject_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: subject delete POST');
};