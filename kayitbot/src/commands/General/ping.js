module.exports = {
    name: 'ping',
    aliases: ['pong'],
    run: async (client, message, args) => {
        message.reply(`Pong! ${client.ws.ping}ms`);
    }
};
