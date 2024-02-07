const express = require("express");
const router = express.Router();
const { Fichier } = require("../models/models");
const multer = require("multer");
const fs = require("fs");

// Configuration de multer pour la gestion des fichiers téléchargés
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Dossier où les fichiers seront enregistrés
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Nom de fichier unique
  },
});

const upload = multer({ storage: storage });

// Route pour récupérer tous les fichiers
router.get("/", async (req, res) => {
  try {
    const fichiers = await Fichier.find()
    .then((fichiers) => {
        res.render("home", {
          title: "Home Page",
          fichiers: fichiers,
        });
      })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Route pour créer un nouveau fichier
router.post("/add", upload.single("fichier"), async (req, res) => {
  const fichier = new Fichier({
    nom: req.file.originalname,
    taille: req.file.size,
    type: req.file.mimetype,
    cheminFichier: req.file.path,
  });
  try {
    const nouveauFichier = await fichier.save();
    // res.status(201).json(nouveauFichier);
    res.redirect("/");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.get("/add", (req, res) => {
    res.render("add", { title: "Add File" });
  });


// Route pour mettre à jour un fichier par son ID
router.patch("/:id", getFichier, async (req, res) => {
  if (req.body.nom != null) {
    res.fichier.nom = req.body.nom;
  }
  if (req.body.taille != null) {
    res.fichier.taille = req.body.taille;
  }
  if (req.body.type != null) {
    res.fichier.type = req.body.type;
  }
  if (req.body.cheminFichier != null) {
    res.fichier.cheminFichier = req.body.cheminFichier;
  }
  try {
    const fichierMisAJour = await res.fichier.save();
    res.json(fichierMisAJour);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete file route
router.get("/delete/:id", (req, res) => {
    let id = req.params.id;
    Fichier.findByIdAndDelete(id)
        .then(result => {
            if (result && result.cheminFichier) {
                // Supprimer le fichier physique si nécessaire
                try {
                    fs.unlinkSync(result.cheminFichier);
                } catch (err) {
                    console.log(err);
                }
            }
            req.session.message = {
                type: "info",
                message: "Fichier supprimé avec succès!",
            };
            res.redirect("/");
        })
        .catch(err => {
            res.json({ message: err.message });
        });
});


// Middleware pour récupérer un fichier par son ID
async function getFichier(req, res, next) {
  let fichier;
  try {
    fichier = await Fichier.findById(req.params.id);
    if (fichier == null) {
      return res.status(404).json({ message: "Fichier non trouvé" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.fichier = fichier;
  next();
}

module.exports = router;
