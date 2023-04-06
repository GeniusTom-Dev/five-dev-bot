const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../../config.json");
const channelId = require('../../json/channelId.json')
const {getRoleId} = require("../../functions/getRoleId");
const perms = require("../../json/commandPerms.json");

module.exports = {
    data : new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear le salon')
        .addIntegerOption(option =>
            option.setName('length')
                .setDescription('Nombre de message à supprimer')
                .setMaxValue(100)
                .setRequired(true)),

    async execute(interaction, client) {
        const length = interaction.options.getInteger("length");

        if(!interaction) return


        let hasPerm = false

        interaction.member.roles.cache.find(r => {
            perms['access'][0]['clear'].forEach(role => {
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

        const actualChannel = await client.channels.cache.get(interaction.channelId);

        actualChannel.messages.fetch({ limit: length }).then(messages => {
            actualChannel.bulkDelete(messages)
        }).then(async () => {
            const logsChannel = await client.channels.cache.get(channelId.modLogs);

            await logsChannel.send({content: `🗑 ► <@${interaction.user.id}> à supprimer ${length} messages dans le salon: <#${interaction.channelId}>`})

            interaction.reply({content: `Vous avez bien supprimer ${length} messages`}).then(setTimeout(() => {
                interaction.deleteReply()
            }, 2000))
        })

    }
}