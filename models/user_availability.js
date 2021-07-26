const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserAvailabilitySchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        timeslotStart: { type: String, required: true },
        timeslotEnd: { type: String, required: true },
    }
);

// Virtual for author's URL
UserAvailabilitySchema
    .virtual('url')
    .get(function () {
        return '/userAvailability/' + this._id;
    });

//Export model
module.exports = mongoose.model('UserAvailability', UserAvailabilitySchema);