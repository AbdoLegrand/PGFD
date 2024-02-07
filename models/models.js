const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
    nom: String,
    email: String,
    motDePasse: String,
    dateDeCreation: { type: Date, default: Date.now }
});

const fichierSchema = new mongoose.Schema({
    nom: String,
    taille: Number,
    type: String,
    cheminFichier: String,
    proprietaire: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
    dateDeCreation: { type: Date, default: Date.now }
});

const dossierSchema = new mongoose.Schema({
    nom: String,
    proprietaire: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
    dateDeCreation: { type: Date, default: Date.now }
});

const partageSchema = new mongoose.Schema({
    fichier: { type: mongoose.Schema.Types.ObjectId, ref: 'Fichier' },
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
    autorisation: { type: String, enum: ['lecture_seule', 'modification'] },
    dateDePartage: { type: Date, default: Date.now }
});

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);
const Fichier = mongoose.model('Fichier', fichierSchema);
const Dossier = mongoose.model('Dossier', dossierSchema);
const Partage = mongoose.model('Partage', partageSchema);

module.exports = {
    Utilisateur,
    Fichier,
    Dossier,
    Partage
};
