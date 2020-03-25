const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
    const message = msg.content;

    if (message.includes("ควย")){
        msg.channel.send('ไหนใครมีเหี้ยไร');
        msg.reply('มึงเหรอ');
    }
    if (msg.member.voice.channel) {
        const connection = await msg.member.voice.channel.join();
    }
});

client.login(auth.token);