const express = require('express');
const contactsController = require('../../controllers/contactsController');
const { validateBody } = require('../../decorators');
const schemas = require('../../schemas/contactsSchema');
const isBodyEmpty = require('../../middleware/isBodyEmpty');
const isFavoriteStatusEmpty = require('../../middleware/isFavoriteStatusEmpty');
const idValidation = require('../../middleware/idValidation');
const authenticate = require('../../middleware/authenticate');

const router = express.Router();

router.use(authenticate);

router.get('/', contactsController.getAllContacts);

router.get('/:contactId', idValidation, contactsController.getOneContact);

router.post(
	'/',
	isBodyEmpty,
	validateBody(schemas.contactSchema),
	contactsController.addContact
);

router.delete('/:contactId', idValidation, contactsController.deleteContact);

router.put(
	'/:contactId',
	idValidation,
	isBodyEmpty,
	validateBody(schemas.contactSchema),
	contactsController.updateContactById
);

router.patch(
	'/:contactId/favorite',
	idValidation,
	isFavoriteStatusEmpty,
	validateBody(schemas.contactUpdateFavoriteSchema),
	contactsController.updateFavoriteStatus
);

module.exports = router;
