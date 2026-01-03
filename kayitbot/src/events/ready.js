const { ActivityType, REST, Routes, Events } = require('discord.js');
const config = require('../config.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} active!`);
        client.user.setActivity('Shadex 🍺 Worex INC', { type: ActivityType.Watching });

        if (client.slashDatas && client.slashDatas.length > 0) {
            const rest = new REST({ version: '10' }).setToken(config.token);
            try {
                console.log('Refresh Slash Commands...');
                await rest.put(
                    Routes.applicationCommands(client.user.id),
                    { body: client.slashDatas },
                );
                console.log('Slash Commands Registered.');
            } catch (error) {
                console.error(error);
            }
        }
    },
};
