const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
const gestion = require('../../json/roleId.json')
const perms = require("../../json/commandPerms.json");
const {getRoleId} = require("../../functions/getRoleId");

module.exports = {
    data : new SlashCommandBuilder()
        .setName('removebanlink')
        .setDescription('Retirer un lien contre les tokens')
        .addStringOption(option =>
            option.setName('link')
                .setDescription('Le lien:')
                .setRequired(true)),

    async execute(interaction, client) {

        if(!interaction) return

        let hasPerm = false

        interaction.member.roles.cache.find(r => {
            perms['access'][0]['gestLink'].forEach(role => {
                const id = getRoleId(role)

                if(id === r.id){
                    hasPerm = true
                }
            })
        })

        if(!hasPerm){
            interaction.reply({content:`<@!${interaction.user.id}> Vous n'avez pas la permission d'utilisez cette commmande !`})
            return
        }

        const link = interaction.options.getString("link")
        let alreadyExist = false
        let banLink = JSON.parse(fs.readFileSync("./json/banLinks.json").toString());

        for (const l of banLink) {
            if (l === link) {
                alreadyExist = true
            }
        }

        if (alreadyExist) {
            banLink.pop(link)
            fs.writeFileSync("./json/banLinks.json", JSON.stringify(banLink));
            interaction.reply({content:`Le lien ${link} à était retirer des liens interdits`})
        }else{
            interaction.reply({content:`Le lien ${link} n'est pas dans la liste des liens interdits`})
        }

    }
}