const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../../config.json");
const channelId = require('../../json/channelId.json')
const {getRoleId} = require("../../functions/getRoleId");
const perms = require("../../json/commandPerms.json");
const {addSanction} = require("../../functions/sql");

module.exports = {
    data : new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Avertir un membre')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Membre à avertir')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription("Raison de l'avertissement")
                .setRequired(true)),

    async execute(interaction, client) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString("reason")

        const FdLogs = await client.channels.cache.get(channelId.sanctionsLogsFD);

        if(!interaction) return


        let hasPerm = false

        interaction.member.roles.cache.find(r => {
            perms['access'][0]['warn'].forEach(role => {
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

        let logsEmbed = new client.discord.MessageEmbed()
            .setTitle("**Sanction** : Warn")
            .setColor('#FF0000')
            .setDescription(`**Utilisateur** : ${user}
                            **Raison** : ${reason}
                            **Staff** : <@${interaction.user.id}>`)
            .setThumbnail(config.logo)
            .setFooter({text:'FiveDev', iconURL: config.logo})


        FdLogs.send({embeds: [logsEmbed]}).then(async () => {

            addSanction(user.id, interaction.user.id, "warn", reason)

            const logsChannel = await client.channels.cache.get(channelId.modLogs);

            await logsChannel.send({content: `L'utilisateur: ${user} à bien était avertit pour la raison: **${reason}** par <@${interaction.user.id}>`})

            interaction.reply({content: `L'utilisateur: ${user} à bien était avertit pour la raison: **${reason}**`})

        })

    }
}