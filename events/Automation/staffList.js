const config = require('../../config.json')
const staffPerms = require('../../json/commandPerms.json')
const roleId = require('../../json/roleId.json')
const ms = require('ms')
const {getRoleId} = require("../../functions/getRoleId");
const channelId = require('../../json/channelId.json')
const {triAlpha} = require("../../functions/tri");



module.exports = {
    name: 'ready',
    async execute(interaction, client) {

        async function reloadStaffList(){
            const channel = client.channels.cache.get(channelId.staffListChannel)
            let staffListRole = []
            let hasAlreadyPerm
            let inList = ""
            let crea = ""
            let gerant = ""
            let admin = ""
            let endList = ""
            let roleStaff

            const guild = await client.guilds.cache.get(config.discordFiveDev)
            const staffRole = guild.roles.cache.get(roleId.staffRoleDiscordFiveDev)

            staffRole.members.forEach(m => {
                staffPerms["listRole"].forEach(role => {
                    let idRole = getRoleId(role)

                    m.roles.cache.find(r => {
                        if(idRole === r.id){
                            hasAlreadyPerm = false
                            try{
                                roleStaff = guild.roles.cache.get(idRole)
                            }catch (e) {
                                console.log("marche pas")
                            }




                            staffListRole.forEach(s => {
                                if (s["name"] === m.user.username) {
                                    s["role"] = idRole
                                    s["roleName"] = roleStaff.name
                                    hasAlreadyPerm = true
                                }
                            })

                            if(!hasAlreadyPerm) {
                                let infos = {
                                    "name": m.user.username,
                                    "role": idRole,
                                    "roleName": roleStaff.name
                                }

                                staffListRole.push(infos)
                            }

                        }
                    })



                })


            })

            staffListRole.sort(triAlpha)

            staffListRole.reverse()

            staffListRole.forEach(s => {
                if(s.roleName === "Créateur"){
                    crea = crea + `<@&${s.role}> ${s.name}\n`
                }else if(s.roleName === "Gérant"){
                    gerant = gerant + `<@&${s.role}> ${s.name}\n`
                }else if(s.roleName === "Admin"){
                    admin = admin + `<@&${s.role}> ${s.name}\n`
                }else{
                    inList = inList + `<@&${s.role}> ${s.name}\n`
                }

            })

            endList = crea + gerant + admin + inList


            const newEmbed = new client.discord.MessageEmbed()
                .setTitle("Liste du Staff de FiveDev")
                .setThumbnail(config.logo)
                .setColor(config.colorFiveDev)
                .setDescription(endList)
                .setFooter({text: "FiveDev", iconURL: config.logo})

            channel.messages.fetch().then(m => {
                if(m.size > 0){
                    let message = m.first()
                    message.edit({embeds: [newEmbed]})
                }else{
                    channel.send({embeds: [newEmbed]})
                }
            })

        }

        setInterval (function () {
            reloadStaffList()
        }, ms('30s'));
    }
}

