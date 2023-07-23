const express = require('express');
require('dotenv').config();
const usersController = require('../../controllers/usersController');
const authenticate = require('../../middleware/authenticate');
const isBodyEmpty = require('../../middleware/isBodyEmpty');
const validateBody = require('../../decorators/validateBody');
const upload = require('../../middleware/upload');
const schemas = require('../../schemas/usersSchema');

const authRouter = express.Router();

authRouter.post(
	'/register',
	isBodyEmpty,
	validateBody(schemas.userRegisterSchema),
	usersController.register
);

authRouter.post(
	'/login',
	isBodyEmpty,
	validateBody(schemas.userLoginSchema),
	usersController.login
);

authRouter.post(
	'/verify',
	validateBody(schemas.userEmailSchema),
	usersController.resendVerifyEmail
);

authRouter.get('/current', authenticate, usersController.current);

authRouter.post('/refresh', usersController.refresh);

authRouter.get('/verify/:verificationToken', usersController.verify);

authRouter.post('/logout', authenticate, usersController.logout);

authRouter.patch('/subscribe', authenticate, usersController.subscription);

authRouter.patch(
	'/theme',
	authenticate,
	validateBody(schemas.userThemeSchema),
	usersController.updateTheme
);

authRouter.patch(
	'/update',
	authenticate,
	validateBody(schemas.userUpdateSchema),
	upload.single('avatarURL'),
	usersController.updateUser
);

// router.post(
//   "/",
//   authMiddleware,
//   uploadCloud.single("image"),
//   PetController.petRegister
// );

module.exports = authRouter;
