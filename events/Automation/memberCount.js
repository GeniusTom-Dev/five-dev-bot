const config = require('../../config.json')
const channelId = require('../../json/channelId.json')
const ms = require('ms')


module.exports = {
    name: 'ready',
    async execute(interaction, client) {
        const voiceCount = await client.channels.cache.get(channelId.voiceCountChannel)
        const guild = await client.guilds.cache.get(config.discordFiveDev)

        setInterval (function () {
            voiceCount.edit({name: `👥 Membres: ${guild.memberCount}`})
        }, ms('30m'));
    }
}

