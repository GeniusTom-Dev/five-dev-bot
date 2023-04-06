const config = require("../../config.json")

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {

        if (!interaction.isButton()) return;

        if (interaction.customId === "allow-message") {
            const content  = interaction.message.embeds[0].description
            const splited = content.split("\n")
            const destination = splited[0].replace(new RegExp("[^(0-9)]", "g"), '');
            const proprietary = splited[1]

            splited.shift()
            splited.shift()
            let newText = splited.join("\n")


            const sendEmbed = new client.discord.MessageEmbed()
                .setThumbnail(config.logo)
                .setDescription(`${newText}`)
                .setFooter({text:'FiveDev', iconURL: config.logo})



            const channel = await client.channels.cache.get(destination);

            channel.send({content:`${proprietary}`,embeds: [sendEmbed]})

            const allowButton = new client.discord.MessageActionRow()
                .addComponents(
                    new client.discord.MessageButton()
                        .setCustomId('accepted')
                        .setLabel(`Message accepter par ${interaction.user.username}`)
                        .setEmoji('✅')
                        .setStyle('PRIMARY'));

            interaction.update({embeds: [interaction.message.embeds[0]], components: [allowButton]})
        }

    }
}