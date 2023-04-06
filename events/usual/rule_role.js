const roleId = require('../../json/roleId.json')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        if (interaction.customId === "member-role") {

            let beMember

            let role = interaction.guild.roles.cache.get(roleId.member)

            interaction.member.roles.cache.find(async r => {
                if(!r) return
                if(r.id === role.id) {
                    beMember = true
                }
            })

            if(!beMember){
                await interaction.member.roles.add(role)

            }else{
                await interaction.deferUpdate()
            }

        }

    }
}