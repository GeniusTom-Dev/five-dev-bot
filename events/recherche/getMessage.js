const config = require('../../config.json')
const channelId = require('../../json/channelId.json')

module.exports = {
    name: 'messageCreate',
    async execute(interaction, client) {
        if(interaction.author.id === client.user.id) return;

        channelId.searchChannel.forEach(chan => {
            if(chan === interaction.channelId){

                const sendEmbed = new client.discord.MessageEmbed()
                    .setTitle(`Nouvelle demande`)
                    .setThumbnail(config.logo)
                    .setDescription(`Provenance: <#${interaction.channelId}>\nAuteur: <@${interaction.author.id}>\n\n${interaction.content}`)
                    .setFooter({text:'FiveDev', iconURL: config.logo})

                const buttons = new client.discord.MessageActionRow()
                    .addComponents(
                        new client.discord.MessageButton()
                            .setCustomId('allow-message')
                            .setLabel('Accepter')
                            .setEmoji('✅')
                            .setStyle('SUCCESS'),

                        new client.discord.MessageButton()
                            .setCustomId('deny-message')
                            .setLabel('Refuser')
                            .setEmoji('❌')
                            .setStyle('DANGER'));


                const channel = client.channels.cache.get(channelId.fluxChannel);

                channel.send({embeds:[sendEmbed], components: [buttons]})

                interaction.delete()

            }
        })

    }
}
