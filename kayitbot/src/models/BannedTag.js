const { Schema, model } = require('mongoose');

const bannedTagSchema = new Schema({
    guildId: { type: String, required: true },
    tag: { type: String, required: true }
});

module.exports = model('BannedTags', bannedTagSchema);
