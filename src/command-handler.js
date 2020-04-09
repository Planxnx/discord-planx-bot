const commandService = require('./services/command-service');
const Discord = require('discord.js');

module.exports = (msg, prefix) => {
    //todo : remove idiot trycatch
    try {
        if (msg.content == `${prefix}stop` || msg.content == `${prefix}pause`) {
            commandService.stopBot(msg);
        } else if (msg.content.startsWith(`${prefix}play`)) {
            commandService.playYoutube(msg, prefix);
        } else if (msg.content.startsWith(`${prefix}add`)) {
            commandService.addQueue(msg, prefix);
        } else if (msg.content == `${prefix}help`) {
            commandService.showHelp(msg, prefix);
        } else if (msg.content == `${prefix}queue`) {
            commandService.showQueue(msg);
        } else if (msg.content == `${prefix}skip`) {
            commandService.skipQueue(msg);
        } else if (msg.content == `${prefix}removeall`) {
            commandService.removeAllQueue(msg);
        } else if (msg.content == `${prefix}mute`) {
            commandService.muteBot(msg);
        } else if (msg.content == `${prefix}deaf`) {
            commandService.deafBot(msg);
        } else {
            const messageEmbed = new Discord.MessageEmbed()
                .setColor('#5f4b8b')
                .setDescription(`${prefix}help เพื่อดูคำสั่งทั้งหมดนะค้าบ`)
            msg.channel.send(messageEmbed);
        }
    } catch (error) {
        console.log(`ERROR in idiot trycatch command-services : msg.content = ${msg.content}  \n ${error}`)
    }

}