const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const config = require('./config.json');
const ytdl = require('ytdl-core');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
    const message = msg.content;

    if (message.includes("ควย")){
        msg.channel.send('ไหนใครมีเหี้ยไร');
        msg.reply('มึงเหรอ');
    }
    if (message.startsWith(`${config.prefix}play`)){
        const connection = await msg.member.voice.channel.join();
        msg.channel.send('เดี๋ยวผมเล่นให้เลยครับพี่');
        setTimeout(()=>{
            connection.play(ytdl(message.slice(config.prefix.length+5), { filter: 'audioonly' }));
        }, 200)
        
    }
    else if (msg.member.voice.channel && !msg.author.bot) {
        const connection = await msg.member.voice.channel.join();
        setTimeout(()=>{
            connection.play('./sound/pen-kuy-rai.mp3')
        }, 200)
    }
});

client.login(process.env.BOT_TOKEN || auth.token);