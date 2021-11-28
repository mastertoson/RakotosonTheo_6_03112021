// initialisation de multer pour gerer et securiser les images
const multer = require('multer');

// on modifie l'extention de fichier
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  // on enregistre dans le dossier images
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // on génère le nom du fichier (nom d'origine + numéro unique + . + extension )
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');