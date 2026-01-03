const { EmbedBuilder } = require('discord.js');
const { guilds, bannedTags } = require('../database/db');
const moment = require('moment');
require('moment-duration-format');

module.exports = {
    name: 'guildMemberAdd',
    execute: async (member, client) => {
        const config = guilds.get(member.guild.id);
        if (!config) return;

        if (config.unregisterRoles && config.unregisterRoles.length > 0) {
            await member.roles.add(config.unregisterRoles).catch(e => { });
        }

        const bTags = bannedTags.get(member.guild.id);
        if (bTags && bTags.some(t => member.user.username.includes(t))) {
        }

        if (config.welcomeChannel) {
            const ch = member.guild.channels.cache.get(config.welcomeChannel);
            if (ch) {
                const now = Date.now();
                const created = member.user.createdTimestamp;
                const isSus = (now - created) < (1000 * 60 * 60 * 24 * 7);

                if (config.tag && member.user.username.includes(config.tag)) {
                    // Taglı hoş geldin (opsiyonel geliştirme)
                }

                const embed = new EmbedBuilder()
                    .setTitle(`${member.guild.name} Sunucusuna Hoş Geldin!`)
                    .setDescription(`
                        🎉 Seninle birlikte **${member.guild.memberCount}** kişi olduk!

                        👤 **Kullanıcı:** ${member} (\`${member.id}\`)
                        📅 **Hesap Oluşturulma:** **${moment(member.user.createdAt).format('DD MMMM YYYY')}** (${moment(member.user.createdAt).fromNow()})
                        🛡️ **Güvenlik Durumu:** ${isSus ? '🔴 **Şüpheli**' : '🟢 **Güvenli**'}

                        Kayıt olmak için sol taraftaki ses teyit odalarına geçip yetkililerimizi bekleyebilirsin.
                        
                        ${config.tag ? `Sunucu tagımız: \`${config.tag}\`` : ''}
                    `)
                    .setColor(isSus ? 'Red' : 'Green')
                    .setImage('https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif')
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
                    .setTimestamp()
                    .setFooter({ text: `${member.guild.name} • Hoş Geldin`, iconURL: member.guild.iconURL({ dynamic: true }) });

                ch.send({ content: config.registerStaff ? `||<@&${config.registerStaff}>||` : null, embeds: [embed] });
            }
        }
    }
};
