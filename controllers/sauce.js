const Sauce = require('../models/sauce')
const fs = require('fs')

// Récuperer la liste de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error: error }))
}

// Récuperer une seule sauce 
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error: error }))
}

// Créer 
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id

    // création d'un nouvel objet (sauce)
    const sauce = new Sauce({
        ...sauceObject,
        // creation d'une url pour l'image : http://localhost:3000/images/nomdufichier 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // enregistrement de l'objet (sauce) dans la base de donnée
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
        .catch(error => res.status(400).json({ error }))
}

// Modifier 
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    // on check si une image existe
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }
    // si elle n'existe pas
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }))
}

// Supprimer 
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // recuperation nom du fichier
            const filename = sauce.imageUrl.split('/images/')[1]
            // effacement du fichier grâce a unlink
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error: error }))
            })
        })
        .catch(error => res.status(500).json({ error }))
}


// Création like/dislike (post:id/like)
exports.updateLike = (req, res, next) => {
    // ajout constante pour rendre plus propre
    const like = req.body.like
    const id = req.params.id
    const userId = req.body.userId
    // si l'utilisateur like 
    if (like === 1) {
        // on ajoute un like et on l'envoie dans le tableau dans "usersLiked"
        Sauce.updateOne({ _id: id }, { $inc: { like: 1 }, $push: { usersLiked: userId } })
            .then(() => res.status(200).json({ message: 'Sauce liké !' }))
            .catch(error => res.status(400).json({ error }))
    } else if (like === -1) {
        // si l'utilisateur dislike
        // on ajoute un dislike et on l'envoie dans le tableau dans "usersDisliked"
        Sauce.updateOne({ _id: id }, { $inc: { dislike: 1 }, $push: { usersDisliked: userId } })
            .then(() => res.status(200).json({ message: 'Sauce disliké !' }))
            .catch(error => res.status(400).json({ error }))
    } else {
        // Si like === 0 l'utilisateur supprime son vote
        Sauce.findOne({ _id: id })
            .then(sauce => {
                // Si le tableau "usersLiked" contient l'ID de l'utilisateur
                if (sauce.usersLiked.includes(userId)) {
                    // On enlève un like du tableau "usersLiked" 
                    Sauce.updateOne({ _id: id }, { $pull: { usersLiked: userId }, $inc: { like: -1 } })
                        .then(() => { res.status(200).json({ message: 'Like supprimé !' }) })
                        .catch(error => res.status(400).json({ error }))
                } else if (sauce.usersDisliked.includes(userId)) {
                    // Si le tableau "usersDisliked" contient l'ID de l'utilisateur
                    // On enlève un dislike du tableau "usersDisliked" 
                    Sauce.updateOne({ _id: id }, { $pull: { usersDisliked: userId }, $inc: { dislike: -1 } })
                        .then(() => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }));
    }
}
