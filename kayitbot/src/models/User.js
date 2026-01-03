const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    names: [{
        name: String,
        Admin: String,
        Rol: String,
        Date: { type: Date, default: Date.now }
    }],
    gender: { type: String, default: null }
})

module.exports = model('User', userSchema)
