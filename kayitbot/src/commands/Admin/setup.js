const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { guilds } = require('../../database/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sunucu yapılandırma ayarlarını tek seferde yapın')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addRoleOption(op => op.setName('yetkili_rol').setDescription('Kayıt yetkilisi rolü'))
        .addRoleOption(op => op.setName('erkek_rol').setDescription('Erkek rolü'))
        .addRoleOption(op => op.setName('kadin_rol').setDescription('Kadın rolü'))
        .addRoleOption(op => op.setName('kayitsiz_rol').setDescription('Kayıtsız rolü'))
        .addStringOption(op => op.setName('tag').setDescription('Sunucu tagı'))
        .addChannelOption(op => op.setName('chat_kanal').setDescription('Chat kanalı'))
        .addChannelOption(op => op.setName('log_kanal').setDescription('Kayıt log kanalı'))
        .addChannelOption(op => op.setName('hosgeldin_kanal').setDescription('Hoşgeldin kanalı'))
        .addBooleanOption(op => op.setName('reset').setDescription('Ayarları sıfırlar')),

    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false });

        if (interaction.options.getBoolean('reset')) {
            guilds.delete(interaction.guild.id);
            return interaction.editReply({ content: '✅ Kurulum başarıyla sıfırlandı.' });
        }

        let config = guilds.get(interaction.guild.id) || {
            registerStaff: null,
            maleRoles: [],
            femaleRoles: [],
            unregisterRoles: [],
            tag: "",
            chatChannel: null,
            logChannel: null,
            welcomeChannel: null
        };

        let updates = [];
        const botRole = interaction.guild.members.me.roles.highest;

        const checkRole = (role) => {
            if (role.position >= botRole.position) return false;
            return true;
        };

        const yetkili = interaction.options.getRole('yetkili_rol');
        if (yetkili) {
            if (!checkRole(yetkili)) return interaction.editReply({ content: '❌ Yetkili rolü benim rolümden yüksek veya eşit olamaz.' });
            config.registerStaff = yetkili.id;
            updates.push(`✅ Yetkili Rolü: ${yetkili}`);
        }

        const erkek = interaction.options.getRole('erkek_rol');
        if (erkek) {
            if (!checkRole(erkek)) return interaction.editReply({ content: '❌ Erkek rolü benim rolümden yüksek veya eşit olamaz.' });
            if (!config.maleRoles.includes(erkek.id)) config.maleRoles.push(erkek.id);
            updates.push(`✅ Erkek Rolü Eklendi: ${erkek}`);
        }

        const kadin = interaction.options.getRole('kadin_rol');
        if (kadin) {
            if (!checkRole(kadin)) return interaction.editReply({ content: '❌ Kadın rolü benim rolümden yüksek veya eşit olamaz.' });
            if (!config.femaleRoles.includes(kadin.id)) config.femaleRoles.push(kadin.id);
            updates.push(`✅ Kadın Rolü Eklendi: ${kadin}`);
        }

        const kayitsiz = interaction.options.getRole('kayitsiz_rol');
        if (kayitsiz) {
            if (!checkRole(kayitsiz)) return interaction.editReply({ content: '❌ Kayıtsız rolü benim rolümden yüksek veya eşit olamaz.' });
            if (!config.unregisterRoles.includes(kayitsiz.id)) config.unregisterRoles.push(kayitsiz.id);
            updates.push(`✅ Kayıtsız Rolü Eklendi: ${kayitsiz}`);
        }

        const tag = interaction.options.getString('tag');
        if (tag) {
            config.tag = tag;
            updates.push(`✅ Tag: \`${tag}\``);
        }

        const chat = interaction.options.getChannel('chat_kanal');
        if (chat) {
            config.chatChannel = chat.id;
            updates.push(`✅ Chat Kanalı: ${chat}`);
        }

        const log = interaction.options.getChannel('log_kanal');
        if (log) {
            config.logChannel = log.id;
            updates.push(`✅ Log Kanalı: ${log}`);
        }

        const welcome = interaction.options.getChannel('hosgeldin_kanal');
        if (welcome) {
            config.welcomeChannel = welcome.id;
            updates.push(`✅ Hoşgeldin Kanalı: ${welcome}`);
        }

        guilds.set(interaction.guild.id, config);

        if (updates.length > 0) {
            updates.push('\nℹ️ **Bilgi:** Erkek kayıt için `.e`, Kız kayıt için `.k` komutlarını kullanabilirsiniz.');
            const embed = new EmbedBuilder()
                .setTitle('Kurulum Güncellendi')
                .setDescription(updates.join('\n'))
                .setColor('Green')
                .setTimestamp();
            return interaction.editReply({ embeds: [embed] });
        } else {
            return interaction.editReply({ content: '⚠️ Hiçbir değişiklik yapılmadı. Lütfen en az bir ayar seçin veya sıfırlama yapın.' });
        }
    }
};
