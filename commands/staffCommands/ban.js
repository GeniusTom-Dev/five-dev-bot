const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../../config.json");
const channelId = require('../../json/channelId.json')
const roleId = require('../../json/roleId.json')
const {getRoleId} = require("../../functions/getRoleId");
const perms = require("../../json/commandPerms.json");
const {addSanction} = require("../../functions/sql");

module.exports = {
    data : new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannir un membre')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Membre à bannir')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Raison du bannissement')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName("delete")
                .setDescription("Delete ses message ?")
                .setRequired(true)),

    async execute(interaction, client) {


        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString("reason")
        const deleteMessage = interaction.options.getBoolean("delete")
        const member = interaction.guild.members.cache.get(user.id)

        const FdLogs = await client.channels.cache.get(channelId.sanctionsLogsFD);

        if(!interaction) return


        let hasPerm = false
        let beStaff = false

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

        member.roles.cache.find(r => {
            if(r.id === roleId['staff']){
                beStaff = true
            }
        })

        if(beStaff){
            interaction.reply({content: `Vous ne pouvez pas bannir un membre du staff`})
            return
        }

        let logsEmbed = new client.discord.MessageEmbed()
            .setTitle("**Sanction** : Ban")
            .setColor('#FF0000')
            .setDescription(`**Utilisateur** : ${user}
                            **Raison** : ${reason}
                            **Staff** : <@${interaction.user.id}>`)
            .setThumbnail(config.logo)
            .setFooter({text:'FiveDev', iconURL: config.logo})



        FdLogs.send({embeds: [logsEmbed]}).then(async () => {

            addSanction(user.id, interaction.user.id, "ban", reason)

            if(deleteMessage){
                await interaction.guild.members.ban(user,{reason: reason, days: 7})
            }else{
                await interaction.guild.members.ban(user,{reason: reason, days: 0})
            }

            const logsChannel = await client.channels.cache.get(channelId.modLogs);

            await logsChannel.send({content: `L'utilisateur: ${user} à bien était banni pour la raison: **${reason}** par <@${interaction.user.id}>`})

            interaction.reply({content: `L'utilisateur: ${user} à bien était banni pour la raison: **${reason}**`})

        })




    }
}