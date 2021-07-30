const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const { isEmail } = require('validator');

const bcrypt = require('bcryptjs')

const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, validate: [isEmail, 'invalid email'], index: { unique: true } },
        password: { type: String, required: true },
        createdAt: { type: Date, required: true },
        imageUrl: { type: String, required: false }
    }
);

UserSchema.pre('save', async function save(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});

UserSchema.methods.validatePassword = async function validatePassword(data) {
    return bcrypt.compare(data, this.password);
};

// UserSchema.countDocuments({ a_model_field: 'match_value' }, function (err, count) {
//     return count;
//     // ... do something if there is an err
//     // ... do something with the count if there was no error
// });

// Virtual for users URL
UserSchema
    .virtual('url')
    .get(function () {
        return '/users/' + this._id;
    });

//Export model
module.exports = mongoose.model('User', UserSchema);