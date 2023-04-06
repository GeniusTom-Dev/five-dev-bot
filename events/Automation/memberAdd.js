const config = require('../../config.json')
const channelId = require('../../json/channelId.json')

module.exports = {
    name: 'guildMemberAdd',
    async execute(interaction, client) {
        const embed = new client.discord.MessageEmbed()
            .setTitle("Nouveau Membre")
            .setThumbnail(config.logo)
            .setColor(config.colorFiveDev)
            .setDescription(`Le membre ${interaction.user.username} à rejoint FiveDev,\n c'est le **${interaction.guild.memberCount}ème** utilisateur.`)
            .setFooter({text:'FiveDev', iconURL: config.logo})

        const channel = client.channels.cache.get(channelId.welcomChannel)

        channel.send({embeds: [embed]})

    }
}
