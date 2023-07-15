const emailRegexp =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
const nameRegexp = /^[a-zA-Zа-яА-Я0-9]+$/;

const themeList = ['dark', 'light'];
module.exports = { emailRegexp, passwordRegexp, nameRegexp, themeList };
