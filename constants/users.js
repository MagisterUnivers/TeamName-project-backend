const emailRegexp =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
const nameRegexp = /^[a-zA-Zа-яА-Я0-9]+$/;

module.exports = { emailRegexp, passwordRegexp, nameRegexp };
