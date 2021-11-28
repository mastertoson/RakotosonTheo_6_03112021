const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Créer un compte utilisateur
exports.signup = (req, res, next) => {
    // hash du mot de passe grâce a bcrypt
    bcrypt.hash(req.body.password, 10)
    
        .then(hash => {
            // creation de l'utilisateur
            const user = new User({
                email: req.body.email,
                password: hash
            })
            //  on sauvegarde l'utilisateur dans la base de donnée
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}

// Se connecter à un compte utilisateur
exports.login = (req, res, next) => {
    // recherche de l'utilisateur dans la base de donnée
    User.findOne({ email: req.body.email })
        .then(user => {
            // si utilisateur non trouvé
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' })
            }
            // comparaison u mot de passe dans la requete avec la base de donnée
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' })
                    }
                    res.status(200).json({
                        userId: user._id,
                        // creation du token jwt (jsonwebtoken) pour le compte de l'utilisateur
                        token: jwt.sign(
                            { userId: user._id },
                            `${process.env.RND_TKN}`,
                            { expiresIn: '24h' }
                        )
                    })
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}