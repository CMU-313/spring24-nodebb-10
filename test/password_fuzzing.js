const assert = require('assert');
const bcrypt = require('bcryptjs');

const password = require('../src/password');

module.exports.fuzz = async function (fuzzData) {
    await password.hash(fuzzData.toString(), fuzzData.toString());
    await password.compare(fuzzData.toString(), fuzzData.toString(), fuzzData.toString() )
}