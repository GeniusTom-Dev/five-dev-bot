const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../../config.json");
const channelId = require('../../json/channelId.json')
const {getRoleId} = require("../../functions/getRoleId");
const perms = require("../../json/commandPerms.json");

module.exports = {
    data : new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban un membre')

        .addStringOption(option =>
            option.setName("id")
                .setDescription("Id discord de la personne ban")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Raison du unban")
                .setRequired(true)),

    async execute(interaction, client) {

        const unbanId = interaction.options.getString("id")
        const reason = interaction.options.getString("reason")

        if(!interaction) return


        let hasPerm = false

        interaction.member.roles.cache.find(r => {
            perms['access'][0]['ban'].forEach(role => {
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

        if(interaction.guild.id !== config.discordFiveDev){
            interaction.reply({content: `Cette command n'est utilisable uniquement sur le discord de FiveDev`})
        }

        await interaction.guild.members.unban(unbanId)

        const logsChannel = await client.channels.cache.get(channelId.modLogs);

        await logsChannel.send({content: `L'id: ${unbanId} à bien était débanni pour la raison: ${reason} par <@${interaction.user.id}>`})

        interaction.reply({content: `L'id: ${unbanId} à bien était débanni`})


    }
}