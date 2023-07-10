const express = require('express');
require('dotenv').config();
const usersController = require('../../controllers/usersController');

const authenticate = require('../../middleware/authenticate');
const usersSchema = require('../../schemas/usersSchema');
const isBodyEmpty = require('../../middleware/isBodyEmpty');
const validateBody = require('../../decorators/validateBody');
const upload = require('../../middleware/upload');
const schemas = require('../../schemas/usersSchema');

const authRouter = express.Router();

authRouter.post(
	'/register',
	isBodyEmpty,
	validateBody(usersSchema.userRegisterSchema),
	usersController.register
);

authRouter.post(
	'/login',
	isBodyEmpty,
	validateBody(usersSchema.userLoginSchema),
	usersController.login
);

authRouter.post(
	'/verify',
	validateBody(schemas.userEmailSchema),
	usersController.resendVerifyEmail
);

authRouter.get('/current', authenticate, usersController.current);

authRouter.get('/verify/:verificationToken', usersController.verify);

authRouter.post('/logout', authenticate, usersController.logout);

authRouter.patch('/subscription', authenticate, usersController.subscription);

authRouter.patch(
	'/avatars',
	authenticate,
	upload.single('avatarURL'),
	usersController.avatars
);

module.exports = authRouter;
