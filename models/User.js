const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// on crée le model user pour le stocker dans la base de donnée
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

// le plugin uniqueValidator évite a plusieurs users de s'inscire avec le même email
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)