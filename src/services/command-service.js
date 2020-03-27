const ytdl = require('ytdl-core');

let isVoicePlaying = false;
const youtubeQueue = [];

const shwoQueue = (msg) => {
    let queue = youtubeQueue.map(element=>{
        return "- "+element.title;
    })
    msg.channel.send('รายการที่อยู่ในคิวนะค้าบ');
    msg.channel.send(queue);
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
    }
}

const showHelp = async (msg) => {
    msg.channel.send('~play : ให้โพรเล่นเพลงที่อยู่ในคิว');
    msg.channel.send('~play [Youtube URL] : ให้โพรเล่นเพลงจากยูทูป , เพิ่มลงในคิว');
    msg.channel.send('~stop : สั่งให้โพรหยุดพูด');
    msg.channel.send('~queue : ดูรายการที่อยู่ในคิว');
}

const playYouTubeQueue = (msg, connection) => {
    if (youtubeQueue.length > 0) {
        isVoicePlaying = true;
        const youtubeData = youtubeQueue.shift()
        const dispatcher = connection.play(ytdl(youtubeData.url, {
            filter: 'audioonly'
        }));
        dispatcher.setVolume(0.6);
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
        shwoQueue(msg);
    }
}