
const express = require ('express')

const bodyParser = require('body-parser')

const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce')
const path = require('path')
const app = express()
const mongoose = require('mongoose')

// connexion de la base de donnée a mongoose
mongoose.connect('mongodb+srv://mdp1234:mdp1234@cluster0.m68gw.mongodb.net/Cluster0?retryWrites=true&w=majority',
{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'))


// ajout du système de sécurité CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})



//  on enregistre les routeurs
app.use(bodyParser.json())
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes)



module.exports = app;