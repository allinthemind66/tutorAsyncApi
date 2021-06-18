const mongoose = require('mongoose');

const { Schema } = mongoose;

const MeetingSchema = new Schema(
    {
        title: { type: String, required: true, maxLength: 100 },
        description: { type: String },
        start_time: { type: Date },
        end_time: { type: Date }
    }
);

// Virtual for meeting title
MeetingSchema
    .virtual('title')
    .get(function () {
        return this.title;
    });

// Virtual for meeting date
MeetingSchema
    .virtual('lifespan')
    .get(function () {
        const year = this.start_time.getFullYear();
        const month = this.start_time.getMonth();
        const day = this.start_time.getDate();
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
