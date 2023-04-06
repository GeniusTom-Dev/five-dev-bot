const config = require('../../config.json')
const roleId = require('../../json/roleId.json')
const channelId = require('../../json/channelId.json')

module.exports = {
    name: 'ready',
    async execute(interaction, client) {
        const embedRoles = new client.discord.MessageEmbed()
            .setColor(config.colorFiveDev)
            .setTitle(`Sélection de rôles FiveDev`)
            .setThumbnail(config.logo)
            .setDescription(
                "Envie de suivre l'actualitée de five dev ?\n" +
                "\n" +
                "Accèder aux créations staff ou autres ?\n" +
                "\n" +
                "Prenez vos rôles ci-dessous  ?\n" +
                "\n" +
                "Vous n'avez qu'à cliquer choisir le rôle que vous désirer qui se trouve juste en dessous de ce message et il vous sera attribuer ou supprimer si vous l'avez déjà.\n")
            .setFooter({text:'FiveDev', iconURL: config.logo})

        const typeCollector = new client.discord.MessageActionRow()
            .addComponents(
                new client.discord.MessageSelectMenu()
                    .setCustomId('roles')
                    .setPlaceholder('Séléctionnez le rôle que vous voulez aquérir ou enlever')
                    .addOptions([{
                        label: 'Notifications giveaways',
                        value: 'giveaways',
                        emoji: '🎉',
                    },
                    {
                        label: 'Notifications actualité',
                        value: 'actuality',
                        emoji: '🔔',
                    },
                    {
                        label: "Accès créations staff",
                        value: 'staffcrea',
                        emoji: '💎',
                    },
                    ]),
            );

        const roleChannel = await client.channels.cache.get(channelId.roleChannel);
        let message

        roleChannel.messages.fetch({ limit: 1 }).then(async messages => {
            if(messages.size < 1){
                message = await roleChannel.send({embeds: [embedRoles], components: [typeCollector]})
            }else if(messages.size > 2){
                await roleChannel.bulkDelete(messages.size - 1)
                message = messages.reverse().first()
            }else{
                message = messages.reverse().first()
            }
        }).then(() => {

            const collector = message.createMessageComponentCollector({
                componentType: 'SELECT_MENU',
                time: 0
            });

            collector.on('collect', async i => {
                let role = i.guild.roles.cache.get(roleId[i.values[0]])
                let hasRole = i.member.roles.cache.get(roleId[i.values[0]])

                if(hasRole) {
                    await i.member.roles.remove(role)
                }else{
                    await i.member.roles.add(role)
                }

                i.update({embeds: [embedRoles], components: [typeCollector]})


            })
        })
    }
}