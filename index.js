const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
    const message = msg.content;

    if (message.includes("ควย")){
        msg.channel.send('หน้ามึงสิ๊');
    }
});

client.login(process.env.BOT_TOKEN || config.token);