const { InteractionType } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    execute: async (interaction, client) => {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'Komut çalışırken hata oluştu!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'Komut çalışırken hata oluştu!', ephemeral: true });
                }
            } catch (err) {
                console.error('Error sending error message:', err);
            }
        }
    }
};
