const roleId = require("../json/roleId.json");

getRoleId = function(role){
    return roleId[role]
}

module.exports = {getRoleId}