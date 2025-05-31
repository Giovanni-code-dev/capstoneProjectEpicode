import express from "express"
import {
  getShowsByArtistId,
  getShowById,
  getShowImages,
  getAllShowImagesByArtist
} from "../controllers/showController.js"

const router = express.Router()

// =====================================================
// Rotte pubbliche - Shows
// =====================================================

// Recupera tutti gli spettacoli pubblici di un determinato artista
router.get("/artist/:artistId", getShowsByArtistId)

// Recupera i dettagli pubblici di uno spettacolo tramite ID
router.get("/:id", getShowById)

// Recupera le immagini associate a uno spettacolo specifico
router.get("/:id/images", getShowImages)

// Recupera tutte le immagini degli spettacoli di un artista
router.get("/artist/:artistId/images", getAllShowImagesByArtist)

export default router
