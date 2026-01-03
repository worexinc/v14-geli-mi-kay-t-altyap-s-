const { readdirSync } = require('fs');
const path = require('path');

module.exports = (client) => {
    const commandsPath = path.join(__dirname, '../commands');
    const commandFolders = readdirSync(commandsPath);

    const slashCommands = [];

    for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        const commandFiles = readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(path.join(folderPath, file));

            if (command.data) {
                client.commands.set(command.data.name, command);
                slashCommands.push(command.data.toJSON());
                console.log(`Slash: ${command.data.name}`);
            } else if (command.name) {
                client.commands.set(command.name, command);
                if (command.aliases && Array.isArray(command.aliases)) {
                    command.aliases.forEach(alias => client.aliases.set(alias, command.name));
                }
                console.log(`Prefix: ${command.name}`);
            }
        }
    }

    client.slashDatas = slashCommands;
};
