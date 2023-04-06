const config = require('../../config.json')
const channelId = require('../../json/channelId.json')

module.exports = {
    name: 'messageCreate',
    async execute(interaction, client) {
        if(interaction.author.id === client.user.id) return;

            if(channelId.suggestionChannel === interaction.channelId) {

                const arrow_up = interaction.guild.emojis.cache.find(emoji => emoji.name === config.reactionUp);
                const arrow_down = interaction.guild.emojis.cache.find(emoji => emoji.name === config.reactionDown);

                await interaction.react(arrow_up)
                await interaction.react(arrow_down)

            }


    }
}
