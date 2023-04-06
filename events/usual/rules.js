const config = require('../../config.json')
const channelId = require('../../json/channelId.json')

module.exports = {
    name: 'ready',
    async execute(interaction, client) {
        const embedI = new client.discord.MessageEmbed()
            .setColor(config.colorFiveDev)
            .setTitle(`**I • Application générale**`)
            .setThumbnail(config.logo)
            .setDescription("A • Ce Discord respecte, applique et fait respecter les Terms Of Service de discord.\n" +
                "**B • **Chaque utilisateur est responsable de son comportement et de la bonne ambiance qui règne sur ce Discord\n" +
                "**C • **Les personnes ayant le grade **Membre du Staff** sont les seules personnes habilités à représenter ce règlement.\n" +
                "**D • **Un comportement extérieur (hors messages privé) ne justifie aucunement l'application d'une sanction sur ce Discord\n" +
                "**E •** De manière générale, les insultes, les menaces ou des références politiques, reglieuses, antisémites (...) sont interdits")

        const embedII = new client.discord.MessageEmbed()
            .setColor(config.colorFiveDev)
            .setTitle(`**II • Responsabilité individuelle**`)
            .setDescription("**A • **Votre pseudonyme, votre statut et votre photo de profile ne doivent en aucun cas constituer une atteinte au règlement\n" +
                "**B • **FiveDev n'est en aucun cas responsable en cas de phising, hack, vol de compte, token grab (...)\n" +
                "**C • **FiveDev n'est en aucun cas responsable du comportement de ses membres dès lors où ceux ci interagissent en dehors de ce Discord\n" +
                "**D • **La vente et le démarchage en messages privé sont interdits sur FiveDev\n" +
                "**E • **Vous contribuez au bon fonctionnement de FiveDev, de ce fait, nous vous invitons à nous signaler tout comportement constituant une atteinte au règlement\n" +
                "**F •** Il est interdit de mentionner les **Fondateurs**, seul les **Helper** peuvent être mentionnés individuellement si vous avez une question")

        const embedIII = new client.discord.MessageEmbed()
            .setColor(config.colorFiveDev)
            .setTitle(`**III • Comportement textuel**`)
            .setDescription("**A •** La publicité, de quelque forme qu'elle soit est strictement interdite\n" +
                "**B •** Les débats de nature politique, religieuse, antisémite ou constituant une infraction à ce règlement sont interdits\n" +
                "**C • **Le spam et le flood sont interdits dans les salons textuels\n" +
                "**D •** FiveDev est une communauté ouverte à tous les âges, de ce fait, la pornographie et les images gores seront sévèrement punies\n" +
                "**E •** Les insultes, les incitations à la haine, les menaces et autres formes d'irrespect seront sanctionnés\n" +
                "**F • **Seul les salons <#893853687749943346>, <#893853687749943346>, <#893853687749943346> et <#893853687749943346> intègrent un processus de filtre manuel\n" +
                "**G • **Il est important de respecter les fonctions de chaques salons\n" +
                "**H •** La vente est interdite sur ce Discord \n")

        const embedIV = new client.discord.MessageEmbed()
            .setColor(config.colorFiveDev)
            .setTitle(`**IV • Comportement vocal**`)
            .setDescription("**A •** La promotion de quelque contenu que ce soit est interdite\n" +
                "**B •** La diffusion de contenu pornographique ou gore résultera directement d'un bannissement définitif\n" +
                "**C • **L'usage de \"soundboards\" ou autres spams auditif sont strictement interdits\n" +
                "**D • **Les insultes ou autres infractions faisant référence à la règle **III-E** sont interdites\n" +
                "**E • **Si vous possédez un micro de piètre qualité et que vos interlocuteurs vous le font remarquer, ayez la décence de vous mute.")

        const embedV = new client.discord.MessageEmbed()
            .setColor(config.colorFiveDev)
            .setTitle(`**V • Comportement extérieur**`)
            .setDescription("**A •** La **règle III-A** s'applique aux messages privé dès lors où vous vous trouvez sur FiveDev\n" +
                "**B • **La **règle III-E** s'applique aux messages privés dès lors où vous vous trouvez sur FiveDev\n" +
                "**C •** Nous vous invitons et vous encourageons à nous signaler tout message privé ne respectant pas les règles **V-A** et **V-B**.")

        const embedVI = new client.discord.MessageEmbed()
            .setColor(config.colorFiveDev)
            .setTitle(`**VI • Modération**`)
            .setDescription("**A • **Tous les **Membre du Staff** sont considérés Staff sur FiveDev\n" +
                "**B •** Seul les **Helper** et + sont autorisés à appliquer des sanctions légères\n" +
                "**C • **Seul les **Modérateurs+** et + sont autorisés à appliquer des sanctions concrètes\n" +
                "**D • **Commencez toujours par contacter un **Helper** en cas de problème, lui seul fera appel aux grades supérieur en cas de besoin\n" +
                "**E •** Aucun staff n'a à se justifier quand à l'application d'une sanction, hormi si la sanction ne fait pas référence à une violation de ce règlement")
            .setFooter({text:'FiveDev', iconURL: config.logo})

        const checkButton = new client.discord.MessageActionRow()
            .addComponents(
                new client.discord.MessageButton()
                    .setCustomId('member-role')
                    .setLabel('Accepter le règlement')
                    .setEmoji('✅')
                    .setStyle('SUCCESS')
            );

        const ruleChannel = await client.channels.cache.get(channelId.ruleChannel);
        let message

        ruleChannel.messages.fetch({ limit: 1 }).then(async messages => {
            if(messages.size < 1){
                message = await ruleChannel.send({embeds: [embedI,embedII,embedIII,embedIV,embedV,embedVI], components: [checkButton]})
            }
        })
    }
}