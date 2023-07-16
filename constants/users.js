const emailRegexp =
/^[a-zA-Z0-9.~+_-]+@[^\s@]+\.[^\s@]+$/;
const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
const nameRegexp = /^[a-zA-Zа-яєїієґҐА-ЯЄЇІЄҐҐ'0-9]+$/;

const themeList = ['dark', 'light'];
module.exports = { emailRegexp, passwordRegexp, nameRegexp, themeList };
