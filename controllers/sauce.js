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
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
        .catch(error => res.status(400).json({ error }))
}

// Modifier 
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body }
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }))
}

// Supprimer 
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error: error }))
            })
        })
        .catch(error => res.status(500).json({ error }))
}


// like
exports.updateLike = (req, res, next) => {
    const like = req.body.like
    const id = req.params.id
    if (like === 1) {
        Sauce.updateOne({_id : id}, { $inc: { like: 1 }, $push: {  usersLiked: req.body.userId } } )
        .then(() => res.status(200).json({ message: 'Sauce liké !' }))
        .catch(error => res.status(400).json({ error }))
    }else if (like === -1){
            console.log('pouet');
            Sauce.updateOne({_id : id}, { $inc: { dislike: 1 }, $push: {  usersDisliked: req.body.userId } } )
            .then(() => res.status(200).json({ message: 'Sauce liké !' }))
            .catch(error => res.status(400).json({ error }))
        }else { 
            // Si like === 0 l'utilisateur supprime son vote
            Sauce.findOne({ _id: id })
              .then(sauce => {
                // Si le tableau "userLiked" contient l'ID de l'utilisateur
                if (sauce.usersLiked.includes(req.body.userId)) { 
                  // On enlève un like du tableau "userLiked" 
                  Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { like: -1 } })
                      .then(() => { res.status(200).json({ message: 'Like supprimé !' }) })
                      .catch(error => res.status(400).json({ error }))
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    // Si le tableau "userDisliked" contient l'ID de l'utilisateur
                    // On enlève un dislike du tableau "userDisliked" 
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislike: -1 } })
                      .then(() => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                      .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }));
    }
}
