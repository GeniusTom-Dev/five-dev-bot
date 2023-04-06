getChannel = function(interaction, client,discordId, channelId){

    let channel

    client.guilds.cache.map(async guild => {

        if(guild.id === discordId){

            const otherDiscord = client.guilds.cache.get(discordId)

            channel = otherDiscord.channels.cache.get(channelId)


        }
    });

    return channel
}

module.exports = {getChannel}