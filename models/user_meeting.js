const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserMeetingSchema = new Schema(
    {
        organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        participant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        meeting: { type: Schema.Types.ObjectId, ref: 'Meeting', required: true }

    }
);

// Virtual for User Meeting URL
UserMeetingSchema
    .virtual('url')
    .get(function () {
        return '/userMeeting/' + this._id;
    });

//Export model
module.exports = mongoose.model('UserMeeting', UserMeetingSchema);