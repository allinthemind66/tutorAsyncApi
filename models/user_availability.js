const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserAvailabilitySchema = new Schema(
    {
        date: { type: Date, required: true },
        timeSlot: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
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