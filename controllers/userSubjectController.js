const UserSubject = require("../models/user_subject")
const async = require('async');
const jwt = require('jsonwebtoken');


const TOKEN_FORMAT_SLICE_LENGTH = 4;
const DELETE_SUCCESS_CODE = 1;
const DELETED_AVAILABILITY_COUNT_ONE = 1;

/**
 * Display list of all subjects by a specific name.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.user_subject_list = async (req, res) => {

    const encryptedUserId = req.query.id;
    const subjectString = req.query.subject;

    const userId = jwt.decode(encryptedUserId.slice(TOKEN_FORMAT_SLICE_LENGTH)); // TO DO implement authentication

    await UserSubject.find({ name: subjectString }).populate("user").then(userSubjects => {
        const subjects = userSubjects.map(subject => {
            return { _id: subject.id, subject: subject.name, description: subject.description, user: { _id: subject.user._id, firstName: subject.user.firstName, lastName: subject.user.lastName } }
        })
        res.json({ data: { subjects } })
    }
    );

};

/**
 * Creates a new user subject association.
 * 
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * Lists all subjects tied to a specific user
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.user_specific_subject_list = async (req, res) => {
    const encryptedUserId = req.params.id;
    const user = jwt.decode(encryptedUserId.slice(TOKEN_FORMAT_SLICE_LENGTH)); // TO DO implement authentication

    await UserSubject.find({ user }).populate("user").then(userSubjects => {
        const subjects = userSubjects.map(subject => {
            return { _id: subject.id, subject: subject.name, description: subject.description, user: { _id: subject.user._id, firstName: subject.user.firstName, lastName: subject.user.lastName } }
        })
        res.json({ data: { subjects } })
    }
    );
}


/**
 * Deletes a user subject association
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.user_subject_delete_post = async (req, res) => {
    const userSubjectId = req.params.id;
    const encryptedUserId = req.body.user;
    const user = jwt.decode(encryptedUserId.slice(TOKEN_FORMAT_SLICE_LENGTH));

    await UserSubject.deleteOne({ user: user, _id: userSubjectId }).then(async dbResponse => {
        if (dbResponse.ok === DELETE_SUCCESS_CODE && dbResponse.n === DELETED_AVAILABILITY_COUNT_ONE) {
            res.send({ success: true });
            res.status(200)
        } else if (dbResponse.ok === DELETE_SUCCESS_CODE && dbResponse.n !== DELETED_AVAILABILITY_COUNT_ONE) {
            res.send({ success: false, error: "No user subject deleted, but DB response OK" });
            res.status(200)
        } else {
            res.send({ success: false, error: "Error deleting user_subject: ", dbResponse });
            res.status(500)
        }
    }).catch(err => {
        console.log("Issue deleting a user subject. Error is ", err.message);
        res.status(500);
        res.json({ error: "Error deleting user_subject" })
    })
};