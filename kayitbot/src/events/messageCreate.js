const config = require('../config.js');

module.exports = {
    name: 'messageCreate',
    execute: async (message, client) => {
        if (message.author.bot) return;
        if (!message.guild) return;

        let prefix = config.prefix || ".";

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));

        if (commandName === 'setup') {
            return message.reply('Kurulum için lütfen /setup kullanın.');
        }

        if (!command) return;

        try {
            command.run(client, message, args);
        } catch (error) {
            console.error(error);
            message.reply('Hata oluştu.');
        }
    }
};
