#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

const async = require('async')

const User = require('./models/user')
const Meeting = require('./models/meeting')
const UserMeeting = require('./models/user_meeting')
const UserAvailability = require('./models/user_availability')


const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const users = [];
const meetings = [];
const userMeetings = []
const userAvailabilities = []

/* 
 * Creates a user object
 */
function userCreate(firstName, lastName, email, password, cb) {
    const userDetail = { firstName: firstName, lastName: lastName, email: email, password: password, createdAt: Date.now() }

    const user = new User(userDetail);

    // save function saves the newly created model
    user.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New User: ' + user);
        users.push(user)
        cb(null, user)
    });
}

/* 
 * Creates a meeting object
 */
function meetingCreate(title, description, startTime, endTime, cb) {
    const meetingDetail = { title: title, description: description, startTime: startTime, endTime: endTime, createdAt: Date.now() }

    const meeting = new Meeting(meetingDetail);

    // save function saves the newly created model
    meeting.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Meeting: ' + meeting);
        meetings.push(meeting)
        cb(null, meeting)
    });
}

/* 
 * Creates a user meeting object
 */
function userMeetingCreate(organizerId, participantId, meetingId, cb) {
    const userMeetingDetail = {
        organizerId: organizerId,
        participantId: participantId,
        meetingId: meetingId
    }

    const userMeeting = new UserMeeting(userMeetingDetail);
    userMeeting.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New User Meeting: ' + userMeeting);
        userMeetings.push(userMeeting)
        cb(null, userMeeting)
    });
}

/* 
 * Creates a user availability object
 */
function userAvailabilityCreate(userId, timeslotStart, timeslotEnd, cb) {
    const userAvailabilityDetail = {
        userId: userId,
        timeslotStart: timeslotStart,
        timeslotEnd: timeslotEnd
    }

    const userAvailability = new UserAvailability(userAvailabilityDetail);
    userAvailability.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New User Availability: ' + userAvailability);
        userAvailabilities.push(userAvailability)
        cb(null, userAvailability)
    });
}


function createUsers(cb) {
    async.parallel([
        function (callback) {
            userCreate("Rick", 'Nilon', "ricksEmail@gmail.com", "myPassword", callback)
        },
        function (callback) {
            userCreate("Luke", 'Gehron', "lukesEmail@gmail.com", "myPassword", callback)
        },
        function (callback) {
            userCreate("Tuoyang", 'Mu', "TuoyangsEmail@gmail.com", "myPassword", callback)
        },
        function (callback) {
            userCreate("Colum", 'Murphy', "columsEmail@gmail.com", "myPassword", callback)
        },
        function (callback) {
            userCreate("Yi-Chun", "Wang", "yi-chunsEmail@gmail.com", "myPassword", callback)
        },
        function (callback) {
            userCreate("Shannen", "Chang", "shannensEmail@gmail.com", "myPassword", callback)
        },
    ],
        // Optional callback
        cb);
}

function createMeetings(cb) {
    async.parallel([
        function (callback) {
            meetingCreate("Music theory help", 'Help with understanding secondary chords and their relation to harmonic analysis', new Date('2021-08-15T12:00:00'), new Date('2021-08-15T13:00:00'), callback)
        },
        function (callback) {
            meetingCreate("Theory Of Computation Lesson", 'I\'m having trouble understanding the concept of the pumping lemma', new Date('2021-08-17T14:00:00'), new Date('2021-08-17T15:30:00'), callback)
        },
        function (callback) {
            meetingCreate("Theory Of Computation Lesson - RegExp", 'I\'m having trouble understanding the concept of the regular expressions', new Date('2021-07-08T14:00:00'), new Date('2021-07-08T15:30:00'), callback)
        },
        function (callback) {
            meetingCreate("Drawing lessons", 'I can\'t draw lol', new Date('2021-07-08T18:00:00'), new Date('2021-07-08T19:30:00'), callback)
        },
        function (callback) {
            meetingCreate("Kanji lessons", 'I need help figuring out the strokes of Kanji', new Date('2021-07-10T18:00:00'), new Date('2021-07-10T19:30:00'), callback)
        },
        function (callback) {
            meetingCreate("Calculus II Help", 'I need help understaning derivatives in calculus', new Date('2021-08-21T18:00:00'), new Date('2021-08-21T19:30:00'), callback)
        },
    ],
        // Optional callback
        cb);
}

function createUserMeetings(cb) {
    async.parallel([
        function (callback) {
            userMeetingCreate(users[0], users[1], meetings[1], callback)
        },
        function (callback) {
            userMeetingCreate(users[1], users[2], meetings[2], callback)
        },
        function (callback) {
            userMeetingCreate(users[2], users[3], meetings[3], callback)
        },
        function (callback) {
            userMeetingCreate(users[3], users[4], meetings[4], callback)
        },
        function (callback) {
            userMeetingCreate(users[4], users[5], meetings[5], callback)
        },
        function (callback) {
            userMeetingCreate(users[1], users[4], meetings[0], callback)
        },
    ],
        // Optional callback
        cb);
}

function createUserAvailabilities(cb) {
    async.parallel([
        function (callback) {
            userAvailabilityCreate(users[0], new Date('2021-09-08T19:30:00'), new Date('2021-09-08T20:30:00'), callback)
        },
        function (callback) {
            userAvailabilityCreate(users[2], new Date('2021-09-08T16:00:00'), new Date('2021-09-08T16:30:00'), callback)
        },
        function (callback) {
            userAvailabilityCreate(users[3], new Date('2021-09-10T16:00:00'), new Date('2021-09-10T16:30:00'), callback)
        },
        function (callback) {
            userAvailabilityCreate(users[4], new Date('2021-09-10T16:00:00'), new Date('2021-09-10T16:30:00'), callback)
        },
        function (callback) {
            userAvailabilityCreate(users[5], new Date('2021-08-10T12:00:00'), new Date('2021-09-10T13:30:00'), callback)
        },
        function (callback) {
            userAvailabilityCreate(users[5], new Date('2021-08-10T13:30:00'), new Date('2021-09-10T14:30:00'), callback)
        },
    ],
        // Optional callback
        cb);
}



async.series([
    createUsers,
    createMeetings,
    createUserMeetings,
    createUserAvailabilities
],
    // Optional callback
    function (err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        }
        else {
            console.log('User instances: ' + users);
            console.log('Meeting instances: ' + meetings);
            console.log('User Meeting instances: ' + userMeetings);
            console.log('User Availability instances: ' + userAvailabilities);
        }
        // All done, disconnect from database
        mongoose.connection.close();
    });



