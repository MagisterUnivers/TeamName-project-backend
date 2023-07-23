const { Schema, model } = require('mongoose');
const handleMongooseError = require('../helpers/handleMongooseError');
const { nameRegexp, emailRegexp, passwordRegexp } = require('../constants/users');

const authSchema = Schema(
  {
    name: {
      type: String,
      match: nameRegexp,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      match: passwordRegexp,
      minlength: 6,
      required: [true, "Set password for user"],
    },
    avatarURL: {
      // type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "dark",
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
    token: String,
    subscriptionEmail: {
      type: String,
      default: ""
    },
  },
  { versionKey: false, timestamps: true }
);

authSchema.post('save', handleMongooseError);

const Users = model('user', authSchema);

module.exports = Users;
