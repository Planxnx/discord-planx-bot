const chatService = require('./services/chat-service');
const commandHandler = require('./command-handler');

const config = require('../config.json');

module.exports = (msg) => {
    if (msg.content.startsWith(config.prefix) && !msg.author.bot) {
        commandHandler(msg, process.env.BOT_PREFIX || config.prefix);
    } else {
        chatService(msg);
    }
}