const {init} = require("../../functions/sql");
module.exports = {
    name: 'ready',
    async execute(interaction, client) {
        init()
    }
}

