const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jimp = require('jimp');
const fs = require('fs/promises');
const path = require('path');
// const gravatar = require('gravatar');
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

	res.status(204).json({
		message: 'No Content'
	});
};

const current = async (req, res) => {
	const { email, _id } = req.user;
	// const { authorization } = req.headers;
	// const UPDtoken = authorization.split(' ');

	// const user = await Users.findById('64b25f39a99c3c7857e27058');
	// console.log(user);
	// const result = await Users.findOne({ token: UPDtoken[1] });
	// console.log(result);

	res.json({
		email,
		_id
	});
};

const refresh = async (req, res) => {
	const { token } = req.headers;
	const user = await Users.findOne(token);
	await Users.findByIdAndUpdate(user, { token: token });
	res.json({ token });
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
	avatars: ctrlWrapper(avatars),
	verify: ctrlWrapper(verify),
	resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
	updateTheme: ctrlWrapper(updateTheme),
	refresh: ctrlWrapper(refresh)
};
