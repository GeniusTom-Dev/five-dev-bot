const config = require("../../config.json")
const channelId = require('../../json/channelId.json')
const hastebin = require("hastebin");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        if (interaction.customId === "send-embed-button") {
            const actualChannel = client.channels.cache.get(interaction.channelId)
            let embed = interaction.message.embeds[0]
            let messageOriginal = interaction.message
            let channelId, mention
            const msg_filter = (m) => m.author.id === interaction.user.id;

            const mentionCollector = new client.discord.MessageActionRow()
                .addComponents(
                    new client.discord.MessageSelectMenu()
                        .setCustomId('modif')
                        .setPlaceholder("Modifier l'embed")
                        .addOptions([
                        {
                            label: 'everyone',
                            value: 'everyone',
                            emoji: '🌐',
                        },
                        {
                            label: 'here',
                            value: 'here',
                            emoji: '💸',
                        },
                        {
                            label: "Pas de mention",
                            value: 'no',
                            emoji: '📝',
                        }

                        ]),
                );

            const sendedButton = new client.discord.MessageActionRow()
                .addComponents(
                    new client.discord.MessageButton()
                        .setCustomId('sended-embed')
                        .setLabel('Embed Envoyer')
                        .setEmoji('📩')
                        .setStyle('SUCCESS')
                );


            let message = await actualChannel.send({content:`Quel mention voulez vous envoyer ? (everyone, here,no)`, components: [mentionCollector]})

            const collector = message.createMessageComponentCollector({
                componentType: 'SELECT_MENU',
                time: 0
            });

            collector.on('collect', async i => {
                let mention = i.values[0]

                let message2 = await actualChannel.send({content:`Dans quel salon voulez vous l'envoyer ?`})

                actualChannel.awaitMessages({ filter: msg_filter, max: 1 }).then(async (collected) => {

                    channelId = collected.first().content.replace(new RegExp("[^(0-9)]", "g"), '');

                    const toChannel = client.channels.cache.get(channelId)

                    if(mention !== "no"){
                        await toChannel.send({content:`@${mention}`, embeds: [embed]})
                        await collected.first().delete()
                        message.delete()
                        message2.delete()

                        await messageOriginal.edit({embeds: [embed], components: [sendedButton]})

                    }else{
                        await toChannel.send({embeds: [embed]})
                        await collected.first().delete()
                        message.delete()
                        message2.delete()

                        await messageOriginal.edit({embeds: [embed], components: [sendedButton]})

                    }

                });

                await i.deferUpdate()
            })







        await interaction.deferUpdate()
        }

    }
}