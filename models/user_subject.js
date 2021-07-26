const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSubjectSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        description: { type: String, required: true }

    }
);

// Virtual for author's URL
UserSubjectSchema
    .virtual('url')
    .get(function () {
        return '/userSubject/' + this._id;
    });

//Export model
module.exports = mongoose.model('UserSubject', UserSubjectSchema);