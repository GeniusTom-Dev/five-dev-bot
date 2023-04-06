const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../../config.json");
const {getRoleId} = require("../../functions/getRoleId");
const perms = require("../../json/commandPerms.json");

module.exports = {
    data : new SlashCommandBuilder()
        .setName('embed')
        .setDescription("Crée un embed")
        .addStringOption(option =>
            option.setName('title')
                .setDescription("Titre de l'embed")
                .setRequired(false))

        .addStringOption(option =>
            option.setName('description')
                .setDescription("Description de l'embed")
                .setRequired(false))

        .addStringOption(option =>
            option.setName('color')
                .setDescription("Couleur de l'embed (ex: #00FFFF) ou tapez fivedev pour la couleur de five dev")
                .setRequired(false))

        .addStringOption(option =>
            option.setName('logo')
                .setDescription("Lien du logo ? (tapez fivedev pour le logo de five dev)")
                .setRequired(false))

        .addBooleanOption(option =>
            option.setName('footer')
                .setDescription("Footer de FiveDev ?")
                .setRequired(false))

        .addStringOption(option =>
            option.setName('mention')
                .setDescription("Couleur de l'embed")
                .setRequired(false)
                .addChoice("here", "here")
                .addChoice('everyone', 'everyone')),




    async execute(interaction, client) {
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const color = interaction.options.getString("color")
        const logo = interaction.options.getString("logo")
        const mention = interaction.options.getString("mention")
        const footer = interaction.options.getBoolean("footer")


        if(!interaction) return


        let hasPerm = false

        interaction.member.roles.cache.find(r => {
            perms['access'][0]['embed'].forEach(role => {
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
            return
        }

        const commandEmbed = new client.discord.MessageEmbed()
            .setDescription(description)

        if(title){
            commandEmbed.setTitle(title)
        }

        if(color){
            if(color === "fivedev"){
                commandEmbed.setColor(config.colorFiveDev)
            }else{
                commandEmbed.setColor(color)
            }

        }

        if(logo){
            if(color === "fivedev"){
                commandEmbed.setThumbnail(config.logo)
            }else{
                commandEmbed.setThumbnail(logo)
            }

        }

        if(footer){
            commandEmbed.setFooter({text:'FiveDev', iconURL: config.logo})
        }

        if(mention){
            interaction.delete()
            interaction.channel.send({content:`@${mention}`, embeds: [commandEmbed]})
        }else{
            interaction.delete()
            interaction.channel.send({embeds: [commandEmbed]})
        }



    }
}