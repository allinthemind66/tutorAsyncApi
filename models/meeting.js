const mongoose = require('mongoose');

const { Schema } = mongoose;

const MeetingSchema = new Schema(
    {
        title: { type: String, required: true, maxLength: 100 },
        description: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        createdAt: { type: Date, required: true }
    }
);

// // Virtual for meeting title
// MeetingSchema
//     .virtual('title')
//     .get(function () {
//         return this.title;
//     });

// Virtual for meeting date
MeetingSchema
    .virtual('lifespan')
    .get(function () {
        const year = this.startTime.getFullYear();
        const month = this.startTime.getMonth();
        const day = this.startTime.getDate();
        return `${month}/${day}/${year}`;
    });

// Virtual for author's URL
MeetingSchema
    .virtual('url')
    .get(function () {
        return '/meeting/' + this._id;
    });

//Export model
module.exports = mongoose.model('Meeting', MeetingSchema);
