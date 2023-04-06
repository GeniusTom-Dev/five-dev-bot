const config = require("../../config.json")
const channelId = require('../../json/channelId.json')
const hastebin = require("hastebin");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        if (interaction.customId === "delete-ticket") {

            let contenthaste, idProprietary, user, username;

            const ticketChannel = await client.channels.cache.get(interaction.channelId);
            const logsChannel = await client.channels.cache.get(channelId.ticketLogs)

            await ticketChannel.messages.fetch().then(messages => {

                try {
                    idProprietary = messages.reverse().first().content.split(" ")[3].replace(new RegExp("[^(0-9)]", "g"), '');
                    user = interaction.guild.members.cache.get(idProprietary)
                    if (!user) {
                        username = idProprietary
                    } else {
                        username = user.user.username
                    }
                }catch (e) {
                    username = "undefinified"
                }





                contenthaste = messages.filter(m => m.author.bot !== true).map(m =>
                    `${new Date(m.createdTimestamp).toLocaleString('fr-FR')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
                ).reverse().join('\n');

            }).then(() => {
                if (contenthaste.length < 1) contenthaste = "Vide.."
                hastebin.createPaste(contenthaste,{
                    contentType: "text/plain",
                    server: "https://hastebin.com"
                }).then(function (link) {
                    const logsEmbed = new client.discord.MessageEmbed()
                        .setTitle("FiveDev ticket logs")
                        .setURL(link)
                        .setColor(config.colorFiveDev)
                        .setDescription(`> Ticket de ${username}\n\n` +
                            "Ici vous pouvez retrouver les logs du ticket précédemment fermer.\n"+
                            "Si vous avez des questions n'hésitez pas à en ouvrir un autre.")
                        .setThumbnail(config.logo)
                        .setFooter({text:'FiveDev', iconURL: config.logo})

                    logsChannel.send({embeds: [logsEmbed]})
                })
            })

            interaction.message.reply(`Fermeture du ticket...`).then(() => {
                setTimeout(() => {
                    ticketChannel.delete()
                }, 4000)
            })
        }

    }
}