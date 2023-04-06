const channelId = require('../json/channelId.json')

getVoiceChannel = async function (interaction, client){

    let TextChannel

    const category = await client.channels.cache.get(channelId.createAutoCatId);


    category.children.forEach(channel => {
        if (channel.type === "GUILD_VOICE") {
            try{
                if(channel.name.substring(4, channel.name.length) === interaction.user.username){
                    TextChannel = channel
                }
            }catch (e) {
                if(channel.name.substring(4, channel.name.length) === interaction.author.username){
                    TextChannel = channel
                }
            }

        }
    });

    return TextChannel
}

getTextChannel = async function (interaction, client){

    let TextChannel

    const category = await client.channels.cache.get(channelId.createAutoCatId);

    category.children.forEach(channel => {
        if (channel.type === "GUILD_TEXT" && channel.id !== channelId.ticketChannel) {
            if(!channel.topic) return
            const topic = channel.topic
            const proprietaryId = topic.replace(new RegExp("[^(0-9)]", "g"), '')

            try{
                if (proprietaryId === interaction.user.id) {
                    TextChannel = channel
                }
            }catch (e){
                if (proprietaryId === interaction.author.id) {
                    TextChannel = channel
                }
            }

        }
    });

    return TextChannel
}

deleteMessage = function(channel) {
    if (channel.type === "GUILD_TEXT") {
        setTimeout(() => {
            channel.messages.fetch().then(messages => {
                lengthChan = messages.size
                messages.forEach(msg => {
                    if (lengthChan > 1) {
                        lengthChan--
                        msg.delete()
                    }
                });
            });
            ;
        }, 2000)
    }
}

module.exports = {getTextChannel, getVoiceChannel,deleteMessage}