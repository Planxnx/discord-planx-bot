const ytdl = require('ytdl-core');

const stopBot = async (msg) => {
    if (msg.member.voice.channel) {
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
        msg.channel.send('เดี๋ยวผมเล่นให้เลยครับพี่');
        setTimeout(() => {
            connection.play(ytdl(msg.content.slice(prefix.length + 5), {
                filter: 'audioonly'
            }));
        }, 200)
    }
}

const showHelp = async (msg) => {
    msg.channel.send('~play [Youtube URL] : ให้โพรเล่นเพลงจากยูทูป');
    msg.channel.send('~stop : สั่งให้โพรหยุดพูด'); 
}

module.exports = (msg, prefix) => {
    if (msg.content == `${prefix}stop`) {
        stopBot(msg);
    } else if (msg.content.startsWith(`${prefix}play`)) {
        playYoutube(msg, prefix);
    } else if (msg.content == `${prefix}help`) {
        showHelp(msg);
    }
}