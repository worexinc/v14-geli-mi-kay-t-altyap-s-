const { Schema, model } = require('mongoose')

const guildConfigSchema = new Schema({
    guildId: { type: String, required: true, unique: true },
    adminRole: { type: String, default: null },
    registerStaff: { type: String, default: null },
    maleRoles: [{ type: String }],
    femaleRoles: [{ type: String }],
    unregisterRoles: [{ type: String }],
    tag: { type: String, default: '' },
    secondaryTag: { type: String, default: '' },
    chatChannel: { type: String, default: null },
    welcomeChannel: { type: String, default: null },
    rulesChannel: { type: String, default: null },
    logChannel: { type: String, default: null },
    botVoiceChannel: { type: String, default: null }
})

module.exports = model('GuildConfig', guildConfigSchema)
