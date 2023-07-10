const { ctrlWrapper } = require('../decorators');
const { HttpError } = require('../helpers');

const Contacts = require('../models/contacts');

const getAllContacts = async (req, res) => {
	const { _id: owner } = req.user;
	const result = await Contacts.find({ owner }, '-createdAt -updatedAt');
	res.json(result);
};

const getOneContact = async (req, res) => {
	const { contactId } = req.params;
	const result = await Contacts.findById(contactId).exec();
	if (!result) throw HttpError(404, `Contact with id=${contactId} not found`);
	res.json(result);
};

const addContact = async (req, res) => {
	const { _id: owner } = req.user;
	const result = await Contacts.create({ ...req.body, owner });
	res.status(201).json(result);
};

const deleteContact = async (req, res) => {
	const { contactId } = req.params;
	const result = await Contacts.findByIdAndDelete(contactId);
	if (!result) throw HttpError(404, `Contact with id=${contactId} not found`);
	res.json({ message: 'Contact deleted' });
};

const updateContactById = async (req, res) => {
	const { contactId } = req.params;
	const result = await Contacts.findByIdAndUpdate(contactId, req.body);
	if (!result) throw HttpError(404, `Contact with id=${contactId} not found`);

	res.json(result);
};

const updateFavoriteStatus = async (req, res) => {
	const { contactId } = req.params;
	const { body } = req;

	const result = await Contacts.findByIdAndUpdate(
		contactId,
		{ $set: { favorite: body.favorite } },
		{ new: true }
	);

	if (!result) {
		throw HttpError(404, `Contact with id=${contactId} not found`);
	}
	res.json(result);
};

module.exports = {
	getAllContacts: ctrlWrapper(getAllContacts),
	getOneContact: ctrlWrapper(getOneContact),
	addContact: ctrlWrapper(addContact),
	deleteContact: ctrlWrapper(deleteContact),
	updateContactById: ctrlWrapper(updateContactById),
	updateFavoriteStatus: ctrlWrapper(updateFavoriteStatus)
};
