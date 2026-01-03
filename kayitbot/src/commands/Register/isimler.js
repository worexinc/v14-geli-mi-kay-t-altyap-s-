const { EmbedBuilder } = require('discord.js');
const { users } = require('../../database/db');

module.exports = {
    name: 'isimler',
    aliases: ['names', 'geçmiş'],
    run: async (client, message, args) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        const data = users.get(member.id);
        if (!data || !data.names || data.names.length === 0) {
            return message.reply(`${member} kullanıcısının geçmiş kayıt bilgisi bulunamadı.`);
        }

        const namesMapped = data.names.reverse().slice(0, 10).map((n, index) => {
            const dateStr = n.date ? new Date(n.date).toLocaleDateString() : 'Tarih Yok';
            return `\`${index + 1}.\` **${n.name}** (${n.rol}) - <@${n.admin}>\n<t:${Math.floor(n.date / 1000)}:R>`;
        }).join('\n');

        const embed = new EmbedBuilder()
            .setTitle(`${member.displayName} Kullanıcısının Geçmiş İsimleri`)
            .setDescription(namesMapped)
            .setColor('Gold')
            .setFooter({ text: `Toplam ${data.names.length} kayıt bulundu.` });

        message.reply({ embeds: [embed] });
    }
};
