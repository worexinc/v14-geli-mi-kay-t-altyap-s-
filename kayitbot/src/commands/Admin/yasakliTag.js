const { PermissionsBitField } = require('discord.js');
const { bannedTags } = require('../../database/db');

module.exports = {
    name: 'yasakli-tag',
    aliases: ['ytag'],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply('Yetkin yok.');

        const action = args[0];
        const tag = args.slice(1).join(' ');

        let currentTags = bannedTags.get(message.guild.id) || [];

        if (action === 'ekle') {
            if (!tag) return;
            if (currentTags.includes(tag)) return message.reply('Zaten ekli.');
            currentTags.push(tag);
            bannedTags.set(message.guild.id, currentTags);
            return message.reply(`Eklendi: ${tag}`);
        }

        if (action === 'sil') {
            if (!tag) return;
            currentTags = currentTags.filter(t => t !== tag);
            bannedTags.set(message.guild.id, currentTags);
            return message.reply(`Silindi: ${tag}`);
        }

        if (action === 'liste') {
            return message.reply(currentTags.length ? currentTags.join(', ') : 'Yasaklı tag yok.');
        }

        message.reply('.ytag ekle/sil/liste <tag>');
    }
};
