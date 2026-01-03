const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { readdirSync } = require('fs');
const path = require('path');
const config = require('./src/config.js');

if (!config.token) {
  console.error("Token Girilmedi!");
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember]
});

client.commands = new Collection();
client.aliases = new Collection();
client.config = config;

const loadHandlers = async () => {
  const handlersPath = path.join(__dirname, 'src', 'handlers');
  const handlerFiles = readdirSync(handlersPath).filter(file => file.endsWith('.js'));

  for (const file of handlerFiles) {
    console.log(`Loading handler: ${file}`);
    require(path.join(handlersPath, file))(client);
  }
};

loadHandlers();

client.login(config.token).catch(e => {
  console.error("Token Hatası");
});
