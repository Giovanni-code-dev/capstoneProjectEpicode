import express from "express"
import {
  getPackagesByArtistId,
  getAllPackageImagesByArtist,
  getPackageById,
  getPackageImages,
  getPackageCategoriesByArtistId
} from "../controllers/packageController.js"

const router = express.Router()

// ==============================
// Rotte pubbliche - Pacchetti
// ==============================

// Ottiene tutti i pacchetti pubblici di un artista specifico
router.get("/artist/:artistId", getPackagesByArtistId)

// Recupera tutte le immagini dei pacchetti associati a un artista
router.get("/artist/:artistId/images", getAllPackageImagesByArtist)

// Recupera i dettagli di un pacchetto specifico (visibile pubblicamente)
router.get("/:id", getPackageById)

// Recupera le immagini associate a un singolo pacchetto
router.get("/:id/images", getPackageImages)

// Recupera le categorie usate nei pacchetti di un artista (per filtri o tag pubblici)
router.get("/categories/artist/:artistId", getPackageCategoriesByArtistId)

export default router
