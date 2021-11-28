const mongoose = require('mongoose')

// on crée le model Sauce pour le stocker dans la base de donnée
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    like: { type: Number, required: true, default: 0},
    dislike: { type: Number, required: true, default: 0},
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
})

// exportation de la sauce
module.exports = mongoose.model('Sauce', sauceSchema)