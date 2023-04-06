const { SlashCommandBuilder } = require('@discordjs/builders');

const config = require("../../config.json");
const channelId = require('../../json/channelId.json');
const perms = require("../../json/commandPerms.json");

const ms = require("ms");

const {getRoleId} = require("../../functions/getRoleId");
const {addSanction} = require("../../functions/sql");


module.exports = {
    data : new SlashCommandBuilder()
        .setName('jail')
        .setDescription('Expulser temporairement un membre')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Membre à expulser temporairement')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Durée du jail sous la forme time unité : (1s, 1m ,1h, 1d)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Raison du jail')
                .setRequired(true)),

    async execute(interaction, client) {

        const user = interaction.options.getUser('user');
        const time = interaction.options.getString('time');
        const reason = interaction.options.getString("reason");

        const member = interaction.guild.members.cache.get(user.id)

        const FdLogs = await client.channels.cache.get(channelId.sanctionsLogsFD);

        if(!interaction) return


        let hasPerm = false

        interaction.member.roles.cache.find(r => {
            perms['access'][0]['jail'].forEach(role => {
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
            .setTitle("**Sanction** : Jail")
            .setColor('#FF0000')
            .setDescription(`**Utilisateur** : ${user}
                            **Raison** : ${reason}
                            **Temps** : ${time}
                            **Staff** : <@${interaction.user.id}>`)
            .setThumbnail(config.logo)
            .setFooter({text:'FiveDev', iconURL: config.logo})



        FdLogs.send({embeds: [logsEmbed]}).then(async () => {

            addSanction(user.id, interaction.user.id, "jail", reason, time)

            member.timeout(ms(time), reason)

            const logsChannel = await client.channels.cache.get(channelId.modLogs);

            await logsChannel.send({content: `L'utilisateur: ${user} à bien était expulser ${time} pour la raison: **${reason}** par <@${interaction.user.id}>`})

            interaction.reply({content: `L'utilisateur: ${user} à bien était expulser ${time} pour la raison: **${reason}**`})

        })

    }
}