const chatService = require('./services/chat-service');
const commandService = require('./services/command-service');

const config = require('../config.json');

module.exports = (msg) => {
    if (msg.content.startsWith(config.prefix) && !msg.author.bot) {
        commandService(msg,config.prefix);
    } else {
        chatService(msg);
    }
}