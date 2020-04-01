const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const botService = require('./bot-service');
const messageContext = require('../../message-context.json')

let soundVolume = process.env.BOT_VOLUME || 0.5;
let isVoicePlaying = false;
const youtubeQueue = [];

const showQueue = (msg) => {
    if (!youtubeQueue.length) {
        msg.channel.send(messageContext.emptyQueue);
        return;
    }
    let queue = youtubeQueue.map(element => {
        return "- " + element.title;
    })
    const queueEmbed = new Discord.MessageEmbed()
        .setColor('#5f4b8b')
        .setTitle('รายการที่อยู่ในคิวนะค้าบ')
        .setDescription(queue)
    msg.channel.send(queueEmbed);
}

const skipQueue = async (msg) => {
    if (msg.member.voice.channel) {
        const connection = await msg.member.voice.channel.join();
        if (!youtubeQueue.length) {
            msg.channel.send(messageContext.emptyQueue);
            return;
        }
        playYouTubeQueue(msg, connection);
    } else {
        msg.reply(messageContext.needUserJoin);
    }
}

const stopBot = async (msg) => {
    if (msg.member.voice.channel) {
        isVoicePlaying = false;
        const connection = await msg.member.voice.channel.join();
        setTimeout(() => {
            connection.play('./src/sound/ok.mp3')
        }, 200);
        msg.channel.send(messageContext.botStop);
    } else {
        msg.reply(messageContext.needUserJoin);
    }
}

const playYoutube = async (msg, prefix) => {
    if (msg.member.voice.channel) {
        const connection = await msg.member.voice.channel.join();
        if (msg.content != prefix + 'play') {
            let url = msg.content.slice(prefix.length + 5);
            if (!ytdl.validateURL(url)) {
                try {
                    msg.channel.send(messageContext.youtubeSearching);
                    url = await botService.searchYoutube(msg.content.slice(prefix.length + 5));
                    msg.channel.send(`เจอ ${url} นะครับ`);
                } catch (error) {
                    console.log(`ERROR in play : ${msg.content.slice(prefix.length + 5)}, \n ${error}`);
                }
            }
            ytdl.getInfo(url, (err, info) => {
                if (err) {
                    msg.channel.send(messageContext.youtubeErrorSkip);
                    return;
                }
                if (youtubeQueue.length > 0) {
                    msg.channel.send(`เพิ่ม ${info.title} ลงในคิวนะครับ`);
                }
                youtubeQueue.push({
                    title: info.title,
                    url: url
                })
                if (!isVoicePlaying) {
                    playYouTubeQueue(msg, connection);
                }
            })
        } else {
            playYouTubeQueue(msg, connection);
        }
    } else {
        msg.reply(messageContext.needUserJoin);
    }
}

const showHelp = async (msg, prefix) => {
    const helpEmbed = new Discord.MessageEmbed()
        .setColor('#5f4b8b')
        .setTitle('คำสั่งสำหรับน้องโพรนะครับณร๊องๆ')
        .setDescription(`${prefix}play : ให้โพรเริ่มเล่นเพลงที่อยู่ในคิวต่อ \n
        ${prefix}play [ชื่อคลิปยูทูป / Youtube URL] : ให้โพรเล่นเพลงจากยูทูป ,เพิ่มลงในคิวและเล่น \n
        ${prefix}add [ชื่อคลิปยูทูป / Youtube URL] : เพิ่มเพลงลงในคิว \n
        ${prefix}skip : สั่งให้โพรข้ามรายการที่กำลังเล่น \n
        ${prefix}stop : สั่งให้โพรหยุดพูด \n
        ${prefix}queue : ดูรายการที่อยู่ในคิวทั้งหมด \n
        `)
    msg.channel.send(helpEmbed);
}

const playYouTubeQueue = (msg, connection) => {
    if (youtubeQueue.length > 0) {
        isVoicePlaying = true;
        const youtubeData = youtubeQueue.shift()
        const dispatcher = connection.play(ytdl(youtubeData.url, {
            filter: 'audioonly'
        }));
        dispatcher.setVolume(soundVolume);
        const messageEmbed = new Discord.MessageEmbed()
            .setColor('#5f4b8b')
            .setDescription(`กำลังจะเล่น ${youtubeData.title} นะครับ`)
        msg.channel.send(messageEmbed);
        dispatcher.on('finish', () => {
            playYouTubeQueue(msg, connection)
        });
    } else {
        isVoicePlaying = false;
        msg.channel.send(messageContext.emptyQueue);
        return;
    }
}

const addQueue = async (msg, prefix) => {
    if (msg.content == prefix + 'add') {
        const addQueueEmbed = new Discord.MessageEmbed()
        .setColor('#5f4b8b')
        .setTitle('คำสั่งไม่ครบนะครับ')
        .setDescription(`${prefix}add [ชื่อคลิปในยูทูป / Youtube URL] `)
        msg.channel.send(addQueueEmbed);
    } else {
        let url = msg.content.slice(prefix.length + 4);
        if (!ytdl.validateURL(url)) {
            try {
                msg.channel.send(messageContext.youtubeSearching);
                url = await botService.searchYoutube(msg.content.slice(prefix.length + 4));
                msg.channel.send(`เจอ ${url} นะครับ`);
            } catch (error) {
                console.log(`ERROR in addQueue : ${msg.content.slice(prefix.length)} \n ${error}`);
            }
        }
        ytdl.getInfo(url, (err, info) => {
            if (err) {
                msg.channel.send(messageContext.youtubeErrorSkip);
                return;
            }
            msg.channel.send(`เพิ่ม ${info.title} ลงในคิวนะครับ`);
            youtubeQueue.push({
                title: info.title,
                url: url
            })
        })
    }
}

module.exports = (msg, prefix) => {
    //todo : remove idiot trycatch
    try {
        if (msg.content == `${prefix}stop` || msg.content == `${prefix}pause`) {
            stopBot(msg);
        } else if (msg.content.startsWith(`${prefix}play`)) {
            playYoutube(msg, prefix);
        } else if (msg.content.startsWith(`${prefix}add`)) {
            addQueue(msg, prefix);
        } else if (msg.content == `${prefix}help`) {
            showHelp(msg, prefix);
        } else if (msg.content == `${prefix}queue`) {
            showQueue(msg);
        } else if (msg.content == `${prefix}skip`) {
            skipQueue(msg);
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