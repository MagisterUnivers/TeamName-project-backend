const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jimp = require('jimp');
const fs = require('fs/promises');
const path = require('path');
const gravatar = require('gravatar');
const { nanoid } = require('nanoid');
require('dotenv').config();

const { SECRET_KEY, BASE_URL } = process.env;

const { ctrlWrapper } = require('../decorators');
const emailVerify = require('../helpers/emailVerify');
const { HttpError } = require('../helpers');
const Users = require('../models/users');

const avatarDir = path.resolve('public', 'avatars');

//

const register = async (req, res) => {
	const { email, password } = req.body;
	const user = await Users.findOne({ email });
	if (user) throw HttpError(409, 'Email already in use');

	const avatarURL = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
	const hashPassword = await bcrypt.hash(password, 10);
	const verificationToken = nanoid();

	const result = await Users.create({
		...req.body,
		password: hashPassword,
		verificationToken,
		avatarURL
	});

	const sendEmailToVerify = {
		to: email,
		subject: 'Verify email',
		html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify email</a>`
	};

	await emailVerify(sendEmailToVerify);

	res.status(201).json({
		user: {
			email: result.email,
			subscription: result.subscription
		}
	});
};

const login = async (req, res) => {
	const { email: userEmail, password } = req.body;
	const user = await Users.findOne({ email: userEmail });
	if (!user) throw HttpError(401, 'Email or password is wrong');
	if (!user.verify) throw HttpError(401, 'Email not register');

	const passwordCompare = await bcrypt.compare(password, user.password);
	if (!passwordCompare) throw HttpError(401, 'Email or password is wrong');

	const { _id: id, email, subscription } = user;
	const payload = { id };

	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });

	await Users.findByIdAndUpdate(id, { token });
	res.json({ token, user: { email, subscription } });
};

const logout = async (req, res) => {
	const { _id } = req.user;

	await Users.findByIdAndUpdate(_id, { token: '' });

	res.status(204).json({
		message: 'No Content'
	});
};

const current = (req, res) => {
	const { email, subscription } = req.user;

	res.json({
		email,
		subscription
	});
};

const subscription = async (req, res) => {
	const { _id, subscription: currentSubscription } = req.user;
	const { newSubscription } = req.body;

	if (currentSubscription !== newSubscription) {
		const validSubscriptions = ['starter', 'pro', 'business'];
		if (validSubscriptions.includes(newSubscription)) {
			await Users.findByIdAndUpdate(_id, { subscription: newSubscription });
			res.json({ newSubscription });
		} else {
			throw HttpError(
				400,
				"Invalid subscription value. Valid options are 'starter', 'pro', or 'business'"
			);
		}
	} else {
		throw HttpError(400, 'This subscription is already in use');
	}
};

const avatars = async (req, res) => {
	// move image
	const { path: oldPath, filename } = req.file;
	const newPath = path.join(avatarDir, filename);
	await fs.rename(oldPath, newPath);
	//
	// resize image
	const image = await jimp.read(newPath);
	await image.resize(250, 250).write(newPath);
	//
	const avatarURL = path.join('avatars', filename);

	req.user.avatarURL = avatarURL;
	await req.user.updateOne({ avatarURL });
	res.json(req.user.avatarURL);
};

const verify = async (req, res) => {
	const { verificationToken } = req.params;
	const user = await Users.findOne({ verificationToken });
	if (!user) throw HttpError(404);

	await Users.findByIdAndUpdate(user._id, {
		verify: true,
		verificationToken: null
	});

	res.status(200).json({
		message: 'Verification successful'
	});
};

const resendVerifyEmail = async (req, res) => {
	const { email } = req.body;
	const user = await Users.findOne({ email });
	if (!user) throw HttpError(401);
	if (user.verify) throw HttpError(400, 'Verification has already been passed');

	const sendEmailToVerify = {
		to: email,
		subject: 'Verify email',
		html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify email</a>`
	};

	await emailVerify(sendEmailToVerify);

	res.json({
		message: 'Verification email sent'
	});
};

module.exports = {
	register: ctrlWrapper(register),
	login: ctrlWrapper(login),
	logout: ctrlWrapper(logout),
	current: ctrlWrapper(current),
	subscription: ctrlWrapper(subscription),
	avatars: ctrlWrapper(avatars),
	verify: ctrlWrapper(verify),
	resendVerifyEmail: ctrlWrapper(resendVerifyEmail)
};
