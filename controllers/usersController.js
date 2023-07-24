const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
require('dotenv').config();

const { SECRET_KEY, BASE_URL } = process.env;

const saveUserAvatar = require('../helpers/avatarHelpers');
const { ctrlWrapper } = require('../decorators');
const emailVerify = require('../helpers/emailVerify');
const { HttpError } = require('../helpers');
const Users = require('../models/users');

const register = async (req, res) => {
	const { email, password } = req.body;
	const user = await Users.findOne({ email });
	if (user) throw HttpError(409, 'Email already in use');
	const hashPassword = await bcrypt.hash(password, 10);
	const verificationToken = nanoid();

	const result = await Users.create({
		...req.body,
		password: hashPassword,
		verificationToken
	});

	const sendEmailToVerify = {
		to: email,
		subject: 'Verify email',
		html: `<a href="http://localhost:3000/TeamName-project/register?verificationToken=${verificationToken}">Click to verify email</a>`
	};

	await emailVerify(sendEmailToVerify);

	res.status(201).json({
		user: {
			name: result.name,
			email: result.email
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

	const { _id: id, email, name } = user;
	const payload = { id };

	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });

	await Users.findByIdAndUpdate(id, { token });
	res.json({ token, user: { email, name } });
};

const logout = async (req, res) => {
	const { _id } = req.user;

	await Users.findByIdAndUpdate(_id, { token: '' });

	res.status(200).json({
		message: 'Token has been deleted!'
	});
};

const current = async (req, res) => {
	const { email, _id, name, theme, subscriptionEmail, avatarURL } = req.user;
	// const { authorization } = req.headers;
	// const UPDtoken = authorization.split(' ');

	// const user = await Users.findById('64b25f39a99c3c7857e27058');
	// console.log(user);
	// const result = await Users.findOne({ token: UPDtoken[1] });
	// console.log(result);

	// store to redux everything about user

	res.json({
		email,
		_id,
		name,
		theme,
		subscriptionEmail,
		avatarURL
	});
};

const refresh = async (req, res) => {
	const { authorization } = req.headers;
	const UPDtoken = authorization.split(' ');
	const user = await Users.findOne({ token: UPDtoken[1] });
	if (!user)
		return res
			.status(401)
			.json({ error: 'Invalid token. No user with such token' });

	await Users.findByIdAndUpdate(user, { token: UPDtoken[1] });
	res.json({ token: user.token });
};

const subscription = async (req, res) => {
	const { _id, subscriptionEmail: currentSubscriptionEmail } = req.user;
	const { email: newSubscriptionEmail } = req.body;
	// is User with req email exists
	const user = await Users.findOne({ subscriptionEmail: newSubscriptionEmail });
	if (user && user._id.toString() !== _id.toString()) {
		throw HttpError(409, 'Subscription email already in use by another user!');
	} else if (currentSubscriptionEmail === '') {
		await Users.findByIdAndUpdate(_id, {
			subscriptionEmail: newSubscriptionEmail
		});
		res.status(200).json({
			message: 'You successfully subscribed on our newsletter',
			subscriptionEmail: newSubscriptionEmail
		});
	} else {
		throw HttpError(
			409,
			`You already subscribed. Email for newsletter is ${currentSubscriptionEmail}`
		);
	}
};

const updateTheme = async (req, res) => {
	const { _id, theme: currentTheme } = req.user;
	const { theme: newTheme } = req.body;
	console.log(req.body);
	if (currentTheme === newTheme) {
		throw HttpError(400, `${newTheme} theme is already set!`);
	}
	await Users.findByIdAndUpdate(_id, { theme: newTheme });
	res.json({ theme: newTheme });
};

const updateUser = async (req, res) => {
	const { name } = req.body;
	const file = req.file;
	const updatedFields = {};
	if (file) {
		const newAvatarURL = await saveUserAvatar(req, res);
		updatedFields.avatarURL = newAvatarURL;
	}

	if (name) {
		updatedFields.name = name;
	}

	if (Object.keys(updatedFields).length > 0) {
		await req.user.updateOne(updatedFields);
	}

	res.json(updatedFields);
};

const verify = async (req, res) => {
	const { verificationToken } = req.params;
	const user = await Users.findOne({ verificationToken });
	if (!user) throw HttpError(404);

	const { _id: id } = user;
	const payload = { id };

	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });

	await Users.findByIdAndUpdate(user._id, {
		verify: true,
		verificationToken: null,
		token
	});

	res.status(200).json({
		message: 'Verification successful',
		token
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

// CLOUDINARY

// userUpdate = async (req, res) => {
//   const id = req.user._id;
//   const name = req.body;
//   const data = !!req.file
//     ? { avatarURL: req.file.path, name }
//     : { name };

// await User.findByIdAndUpdate(id, data )

// };

module.exports = {
	register: ctrlWrapper(register),
	login: ctrlWrapper(login),
	logout: ctrlWrapper(logout),
	current: ctrlWrapper(current),
	subscription: ctrlWrapper(subscription),

	verify: ctrlWrapper(verify),
	resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
	updateTheme: ctrlWrapper(updateTheme),
	refresh: ctrlWrapper(refresh),
	updateUser: ctrlWrapper(updateUser)
};
