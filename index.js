const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const handler = require('./src/handler');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => handler(msg));

client.login(process.env.BOT_TOKEN || config.token);