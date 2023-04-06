const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../../config.json')
const {waitForElement} = require("../../functions/waitElement");

module.exports = {
    data : new SlashCommandBuilder()
        .setName('embed')
        .setDescription("Crée un embed"),




    async execute(interaction, client) {
        const actualChannel = client.channels.cache.get(interaction.channelId)

        let embed = new client.discord.MessageEmbed()
            .setDescription("Description")

        const modifCollector = new client.discord.MessageActionRow()
            .addComponents(
                new client.discord.MessageSelectMenu()
                    .setCustomId('modif')
                    .setPlaceholder("Modifier l'embed")
                    .addOptions([{
                        label: 'Modifier le titre',
                        value: 'title',
                        emoji: '🌐',
                    },
                    {
                        label: 'Modifier la description',
                        value: 'desc',
                        emoji: '💸',
                    },
                    {
                        label: "Modifier la couleur",
                        value: 'color',
                        emoji: '📝',
                    },
                    {
                        label: "Modifier le Logo",
                        value: 'logo',
                        emoji: '💾',
                    },
                    {
                        label: "Modifier le footer",
                        value: 'footer',
                        emoji: '💥',
                    },
                    {
                        label: "Modifier la Mention",
                        value: 'mention',
                        emoji: '🔥',
                    },

                ]),
        );

        const sendButton = new client.discord.MessageActionRow()
            .addComponents(
                new client.discord.MessageButton()
                    .setCustomId('send-embed-button')
                    .setLabel('Envoyer')
                    .setEmoji('📩')
                    .setStyle('SUCCESS')
            );

        let message = await actualChannel.send({embeds: [embed], components: [modifCollector,sendButton]})

        const collector = message.createMessageComponentCollector({
            componentType: 'SELECT_MENU',
            time: 0
        });

        collector.on('collect', async i => {


            let infos
            embed = message.embeds[0]

            const msg_filter = (m) => m.author.id === i.user.id;
            actualChannel.awaitMessages({ filter: msg_filter, max: 1 }).then((collected) => {

                infos = collected.first().content
                collected.first().delete()

                if(i.values[0] === "title"){
                    embed.setTitle(infos)
                    message.edit({embeds: [embed], components: [modifCollector,sendButton]})
                }

                if(i.values[0] === "desc"){
                    embed.setDescription(infos)
                    message.edit({embeds: [embed], components: [modifCollector,sendButton]})
                }


                if(i.values[0] === "color"){
                    if(infos === "fivedev"){
                        embed.setColor(config.colorFiveDev)
                    }else{
                        embed.setColor(infos)
                    }


                    message.edit({embeds: [embed], components: [modifCollector,sendButton]})
                }


                if(i.values[0] === "footer"){
                    if(infos === "fivedev"){
                        embed.setFooter({text:'FiveDev', iconURL: config.logo})
                    }else{
                        embed.setFooter({text:infos})
                    }
                    message.edit({embeds: [embed], components: [modifCollector,sendButton]})
                }


                if(i.values[0] === "logo"){
                    if(infos === "fivedev"){
                        embed.setThumbnail(config.logo)
                    }else{
                        embed.setThumbnail(infos)
                    }
                    message.edit({embeds: [embed], components: [modifCollector,sendButton]})
                }

            });


            i.update({embeds: [embed], components: [modifCollector,sendButton]})



        })
        interaction.deferReply()
    }
}