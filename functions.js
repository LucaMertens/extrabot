const config = require("./config.json");

module.exports.checkAdmin = (userID) => {
  for (let element of config.admins) {
    if(userID == element.ID) {
      return true;
    }
  }
  return false;
}
