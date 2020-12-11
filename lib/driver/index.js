const constants = require("./constants");
const driver = require("@screeps/driver");
Object.assign(driver.constants, constants);
console.log(driver.constants.OK);
module.exports = driver;