const fs = require("fs")
const name = "./json/banLinks.json"

module.exports = {
    name: 'messageCreate',
    async execute(interaction, client) {
        if(interaction.author.id == client.user.id) return;

        var banLink = JSON.parse(fs.readFileSync(name).toString());

        for (const link of banLink) {

            if (interaction.content.indexOf(link) != -1) {
                interaction.channel.send({content: `<@!${interaction.author.id}>, Vous ne pouvez pas envoyer de lien !`})
                interaction.delete()
                return
            }
        }
    }
}
