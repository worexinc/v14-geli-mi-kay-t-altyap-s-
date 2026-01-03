const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { guilds, users, bannedTags } = require('../../database/db');

module.exports = {
    name: 'k',
    aliases: ['kayıt', 'erkek', 'kadın', 'e', 'bayan', 'kiz', 'man', 'woman'],
    run: async (client, message, args) => {
        const config = guilds.get(message.guild.id);
        if (!config || !config.registerStaff) return message.reply('Kurulum eksik veya yetkili rol ayarlanmamış.');

        if (!message.member.roles.cache.has(config.registerStaff) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('Yetkin yok.');
        }

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const name = args[1];
        const age = args[2];

        if (!member) return message.reply('Üye etiketle.');
        if (!name || !age) return message.reply('.k @üye isim yaş');
        if (isNaN(age)) return message.reply('Yaş sayı olmalı.');

        const banned = bannedTags.get(message.guild.id);
        if (banned && Array.isArray(banned)) {
            if (banned.some(tag => member.user.username.includes(tag) || name.includes(tag))) {
                return message.reply('Yasaklı tag mevcut. İşlem iptal.');
            }
        }

        const newName = `${config.tag ? config.tag + ' ' : ''}${name} | ${age}`;

        const cmd = message.content.split(' ')[0].slice(1).toLowerCase();

        let initialGender = null;
        if (['e', 'erkek', 'man'].includes(cmd)) initialGender = 'man';
        if (['k', 'kiz', 'kadın', 'bayan', 'woman'].includes(cmd)) initialGender = 'woman';

        const register = async (gender, interaction) => {
            const context = interaction || message;

            let rolesAdd = gender === 'man' ? config.maleRoles : config.femaleRoles;
            let rolesRemove = config.unregisterRoles || [];
            let genderText = gender === 'man' ? 'Erkek' : 'Kadın';

            if (!rolesAdd || rolesAdd.length === 0) {
                const err = 'Roller ayarlanmamış!';
                if (interaction) return interaction.reply({ content: err, ephemeral: true });
                return message.reply(err);
            }

            await member.setNickname(newName).catch(e => console.log(e));
            await member.roles.add(rolesAdd).catch(e => console.log(e));
            await member.roles.remove(rolesRemove).catch(e => console.log(e));

            let userRecord = users.get(member.id) || { names: [], gender: null };
            userRecord.gender = genderText;
            userRecord.names.push({
                name: newName,
                rol: genderText,
                admin: message.author.id,
                date: Date.now()
            });
            users.set(member.id, userRecord);

            const embed = new EmbedBuilder()
                .setColor(gender === 'man' ? 'Blue' : 'Purple')
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setDescription(`${member} kullanıcısı **${genderText}** olarak kayıt edildi.\n\n` +
                    `**İsim:** \`${newName}\`\n` +
                    `**Yetkili:** ${message.author}\n` +
                    `**Roller:** ${rolesAdd.map(r => `<@&${r}>`).join(', ')}`)
                .setThumbnail(member.user.displayAvatarURL());

            if (interaction) await interaction.update({ embeds: [embed], components: [] });
            else await message.reply({ embeds: [embed] });

            if (config.chatChannel && message.guild.channels.cache.get(config.chatChannel)) {
                message.guild.channels.cache.get(config.chatChannel).send(`${member} aramıza katıldı!`);
            }

            if (config.logChannel && message.guild.channels.cache.get(config.logChannel)) {
                const logEmbed = new EmbedBuilder()
                    .setTitle('🎉 Bir Kayıt Gerçekleşti!')
                    .setColor(gender === 'man' ? 'Blue' : 'Purple')
                    .setDescription(`
                        👤 **Kullanıcı:** ${member} (\`${member.id}\`)
                        👮 **Yetkili:** ${message.author} (\`${message.author.id}\`)
                        🏷️ **Yeni İsim:** \`${newName}\`
                        🚻 **Cinsiyet:** ${genderText}
                        📅 **Tarih:** <t:${Math.floor(Date.now() / 1000)}:F>
                    `)
                    .addFields(
                        { name: 'Verilen Roller', value: rolesAdd.map(r => `<@&${r}>`).join(', '), inline: false },
                        { name: 'Alınan Roller', value: rolesRemove.length > 0 ? rolesRemove.map(r => `<@&${r}>`).join(', ') : 'Yok', inline: false }
                    )
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .setFooter({ text: 'Kayıt Sistemi', iconURL: message.guild.iconURL() })
                    .setTimestamp();
                message.guild.channels.cache.get(config.logChannel).send({ embeds: [logEmbed] });
            }
        };

        if (initialGender) return register(initialGender);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('man').setLabel('Erkek').setEmoji('🚹').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('woman').setLabel('Kadın').setEmoji('🚺').setStyle(ButtonStyle.Danger)
        );

        const embed = new EmbedBuilder().setDescription(`Kullanıcının ismi \`${newName}\` olacak. Cinsiyet seçiniz.`);
        const msg = await message.reply({ embeds: [embed], components: [row] });

        const filter = i => i.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', async i => {
            await register(i.customId, i);
        });

        collector.on('end', (_, reason) => {
            if (reason === 'time') msg.delete().catch(() => { });
        });
    }
};
