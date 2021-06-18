const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const { isEmail } = require('validator');

const bcrypt = require('bcrypt')

const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true, validate: [isEmail, 'invalid email'], index: { unique: true } },
        password: { type: String, required: true },
        created_at: { type: Date, required: true }
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

// Virtual for book's URL
UserSchema
    .virtual('url')
    .get(function () {
        return '/users/' + this._id;
    });

//Export model
module.exports = mongoose.model('User', UserSchema);