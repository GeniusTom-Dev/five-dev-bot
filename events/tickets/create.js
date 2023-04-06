const config = require('../../config.json')
const channelId = require('../../json/channelId.json')
const ticketgestion = require('../../json/ticket.json')

const functionWait = require('../../functions/waitElement')
const {getRoleId} = require("../../functions/getRoleId");
const roleId = require("../../json/roleId.json");

module.exports = {
    name: 'ready',
    async execute(interaction, client) {
        const ticketChannel = await client.channels.cache.get(channelId.ticketChannel);

        const embedTicket = new client.discord.MessageEmbed()
            .setColor(config.colorFiveDev)
            .setTitle(`Ticket FiveDev`)
            .setThumbnail(config.logo)
            .setDescription(
                "Envie de rentrer en contact avec les staff de FiveDev ? Vous pouvez créer un ticket pour nous contacter. Nous répondons à toutes vos questions **(sauf du développement)** tous les jours.\n" +
                "\n" +
                "Plusieurs catégories sont disponibles pour associer votre demande aux équipes spécialisées.\n" +
                "\n" +
                "> Comment ouvrir un ticket ?\n" +
                "\n" +
                "Vous n'avez qu'à cliquer choisir la raison du tickets qui se trouve juste en dessous de ce message et un salon unique sera créé pour que vous puissiez nous parler à l'abris des regards indiscrets.\n")
            .setFooter({text:'FiveDev', iconURL: config.logo})

        const typeCollector = new client.discord.MessageActionRow()
            .addComponents(
                new client.discord.MessageSelectMenu()
                    .setCustomId('category')
                    .setPlaceholder('Séléctionnez la catégorie du ticket')
                    .addOptions([{
                        label: 'Question Générale',
                        value: 'global',
                        emoji: '🌐',
                    },
                    {
                        label: 'Paiement et Boutique',
                        value: 'pay',
                        emoji: '💸',
                    },
                    {
                        label: "Candidature et Recrutement",
                        value: 'candid',
                        emoji: '📝',
                    },
                    {
                        label: "Certification Développeur",
                        value: 'certif',
                        emoji: '💾',
                    },
                    {
                        label: "Signalement d'un membre",
                        value: 'signalMember',
                        emoji: '💥',
                    },
                    {
                        label: "Signalement d'un staff",
                        value: 'signalStaff',
                        emoji: '🔥',
                    },
                    {
                        label: "Signalement d'un Bug",
                        value: 'signalBug',
                        emoji: '🧩',
                    },
                    {
                        label: "Contacter les Responsable du discord",
                        value: 'gerant',
                        emoji: '👑',
                    },

                ]),
            );


        let message

        ticketChannel.messages.fetch({ limit: 1 }).then(async messages => {
            if(messages.size < 1){
                message = await ticketChannel.send({embeds: [embedTicket], components: [typeCollector]})
            }else{
                message = messages.first()
            }
        }).then(() => {

        const collector = message.createMessageComponentCollector({
            componentType: 'SELECT_MENU',
            time: 0
        });

        collector.on('collect', async i => {
            let hasChannel = false

            const cat = await client.channels.cache.get(channelId.ticketCat)

            cat.children.forEach(channel => {
                if(channel.id !== ticketChannel.id && channel.type === "GUILD_TEXT") {
                    if(!channel) return
                    const topic = channel.topic
                    const proprietaryId = topic.replace(new RegExp("[^(0-9)]", "g"), '')
                    if (proprietaryId === i.user.id) {
                        if (!hasChannel) {
                            hasChannel = true
                            ticketChannel.send(`<@!${i.user.id}> vous ne pouvez pas ouvrir plusieurs tickets.`).then(m => {
                                setTimeout(() => {
                                    m.delete()
                                }, 2000)
                            })
                        }
                    }
                }
            })
            functionWait.waitForElement(hasChannel)

            if(!hasChannel){
                let role = i.guild.roles.cache.get(getRoleId(ticketgestion['perms'][0][i.values[0]]))
                i.guild.channels.create(`${ticketgestion["emoji"][0][i.values[0]]}・ticket-${i.user.username}`, {
                    type: 'GUILD_TEXT',
                    parent: channelId.ticketCat,
                    topic: `Ticket: FiveDev-${i.user.id}`,
                    permissionOverwrites: [{
                        id: i.user.id,
                        allow: ['VIEW_CHANNEL','SEND_MESSAGES','ATTACH_FILES'],
                    },
                        {
                            id: role.id,
                            allow: ['VIEW_CHANNEL','SEND_MESSAGES'],
                        },
                        {
                            id: i.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL'],
                        }
                    ],
                }).then(c => {
                    let addContent;
                    const embedTicket = new client.discord.MessageEmbed()
                        .setTitle("Ticket FiveDev")
                        .setDescription(`> Catégorie: **${ticketgestion["categorie"][0][i.values[0]]}**\n\nCe salon n'est visible que par les membres du staff\n` +
                            "de FiveDev dans le but d'assurer la sécurité\n" +
                            "des informations que vous pourrez être amené à\n" +
                            "nous transmettre.\n" +
                            "\n" +
                            "Veuillez décrire votre **question/problème** ci-dessous")
                        .setColor(config.colorFiveDev)
                    const deleteButton = new client.discord.MessageActionRow()
                        .addComponents(
                            new client.discord.MessageButton()
                                .setCustomId('delete-ticket')
                                .setLabel('Fermer le ticket')
                                .setEmoji('🗑️')
                                .setStyle('DANGER')
                        );

                    if(getRoleId(ticketgestion['mention'][0][i.values[0]])){
                        addContent = `> Mention: <@&${getRoleId(ticketgestion['mention'][0][i.values[0]])}>`
                        c.send({content:`> Ticket de <@${i.user.id}>\n${addContent}`, embeds: [embedTicket], components: [deleteButton]})
                    }else{
                        c.send({content:`> Ticket de <@${i.user.id}>`, embeds: [embedTicket], components: [deleteButton]})
                    }

                })
            };


            i.update({embeds: [embedTicket], components: [typeCollector]})


        })
        })
    }
}

