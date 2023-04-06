module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {

        if (!interaction.isButton()) return;

        if (interaction.customId === "deny-message") {

            const denyButton = new client.discord.MessageActionRow()
                .addComponents(
                    new client.discord.MessageButton()
                        .setCustomId('refused')
                        .setLabel(`Message refuser par ${interaction.user.username}`)
                        .setEmoji('❌')
                        .setStyle('DANGER'));

            interaction.update({embeds: [interaction.message.embeds[0]], components: [denyButton]})
        }

    }
}