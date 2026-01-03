const { EmbedBuilder } = require('discord.js');
const { users } = require('../../database/db');

module.exports = {
    name: 'stat',
    aliases: ['me', 'kayıtlar'],
    run: async (client, message, args) => {
        const member = message.mentions.members.first() || message.member;

        const allData = users.get();

        let total = 0;
        let male = 0;
        let female = 0;

        if (allData) {
            Object.values(allData).forEach(userRecord => {
                if (userRecord.names && Array.isArray(userRecord.names)) {
                    const registeredByTarget = userRecord.names.filter(n => n.admin === member.id);
                    total += registeredByTarget.length;

                    registeredByTarget.forEach(rec => {
                        if (rec.rol === 'Erkek') male++;
                        if (rec.rol === 'Kadın') female++;
                    });
                }
            });
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true }) })
            .setTitle('Kayıt İstatistikleri')
            .addFields(
                { name: 'Toplam Kayıt', value: `${total}`, inline: true },
                { name: 'Erkek', value: `${male}`, inline: true },
                { name: 'Kadın', value: `${female}`, inline: true }
            )
            .setColor('Aqua')
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
