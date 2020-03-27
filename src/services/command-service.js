const ytdl = require('ytdl-core');

let isVoicePlaying = false;
const youtubeQueue = [];

const showQueue = (msg) => {
    let queue = youtubeQueue.map(element=>{
        return "- "+element.title;
    })
    msg.channel.send('รายการที่อยู่ในคิวนะค้าบ');
    msg.channel.send(queue);
}

const skipQueue = async (msg) => {
    if (msg.member.voice.channel) {
        const connection = await msg.member.voice.channel.join();
        if(!youtubeQueue.length){
            msg.channel.send('ไม่เหลือให้ข้ามแล้วครับ');
            return;
        }
        playYouTubeQueue(msg, connection);
    }
}

const stopBot = async (msg) => {
    if (msg.member.voice.channel) {
        isVoicePlaying = false;
        const connection = await msg.member.voice.channel.join();
        setTimeout(() => {
            connection.play('./src/sound/ok.mp3')
        }, 200);
        msg.channel.send('หยุดแล้วครับ');
    }
}

const playYoutube = async (msg, prefix) => {
    if (msg.member.voice.channel) {
        const connection = await msg.member.voice.channel.join();
        if (msg.content != prefix + 'play') {
            const url = msg.content.slice(prefix.length + 5);
            ytdl.getInfo(url, (err, info) => {
                if (err) {
                    msg.channel.send('เล่นไม่ได้จ้า ขอผ่านน้า');
                    return;
                }
                if (youtubeQueue.length > 0) {
                    msg.channel.send(`เพิ่ม ${info.title} ลงในคิวนะครับ`);
                }
                youtubeQueue.push({
                    title: info.title,
                    url: url
                })
                if(!isVoicePlaying){
                    playYouTubeQueue(msg, connection);
                }
            })
        }else {
            playYouTubeQueue(msg, connection);
        }
    }else {
        msg.reply('ต้องเข้าไปอยู่ในห้องก่อนค้าบ');
    }
}

const showHelp = async (msg) => {
    msg.channel.send('~play : ให้โพรเล่นเพลงที่อยู่ในคิวต่อ');
    msg.channel.send('~play [Youtube URL] : ให้โพรเล่นเพลงจากยูทูป , เพิ่มลงในคิว');
    msg.channel.send('~skip : สั่งให้โพรข้ามรายการที่กำลังเล่น');
    msg.channel.send('~stop : สั่งให้โพรหยุดพูด');
    msg.channel.send('~queue : ดูรายการที่อยู่ในคิวทั้งหมด');
}

const playYouTubeQueue = (msg, connection) => {
    if (youtubeQueue.length > 0) {
        isVoicePlaying = true;
        const youtubeData = youtubeQueue.shift()
        const dispatcher = connection.play(ytdl(youtubeData.url, {
            filter: 'audioonly'
        }));
        dispatcher.setVolume(0.2);
        msg.channel.send(`กำลังจะเล่น ${youtubeData.title} นะครับ`);
        dispatcher.on('finish', () => {
            playYouTubeQueue(msg, connection)
        });
    } else {
        isVoicePlaying = false;
        return;
    }
}

module.exports = (msg, prefix) => {
    if (msg.content == `${prefix}stop` || msg.content == `${prefix}pause` ) {
        stopBot(msg);
    } else if (msg.content.startsWith(`${prefix}play`)) {
        playYoutube(msg, prefix);
    } else if (msg.content == `${prefix}help`) {
        showHelp(msg);
    }else if (msg.content == `${prefix}queue`) {
        showQueue(msg);
    }else if (msg.content == `${prefix}skip`) {
        skipQueue(msg);
    }
}