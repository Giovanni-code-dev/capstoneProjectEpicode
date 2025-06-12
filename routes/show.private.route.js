import express from "express"
import {
  createShow,
  getMyShows,
  updateShow,
  deleteShow,
  updateShowImages,
  deleteShowImages,
  reorderImages,
  getMyShowById
} from "../controllers/showController.js"

import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { artistOnly } from "../middleware/roleMiddleware.js"
import upload from "../config/upload.js"

const router = express.Router()

// =====================================================
// Rotte private per artisti autenticati - Shows
// =====================================================

// Applica middleware per autenticazione e ruolo artista
router.use(JWTAuthMiddleware, artistOnly)

// Crea un nuovo spettacolo con possibilità di caricare immagini (max 5)
router.post("/", upload.array("images", 5), createShow)

// Recupera tutti gli spettacoli dell’artista loggato
router.get("/", getMyShows)

// Recupera i dettagli di un singolo show dell’artista loggato
router.get("/me/:id", getMyShowById)

// Aggiorna i dati di uno spettacolo esistente
router.patch("/:id", upload.array("images", 5), updateShow)



// Elimina uno spettacolo dell’artista loggato
router.delete("/:id", deleteShow)

// Aggiunge immagini a uno spettacolo esistente
router.patch("/:id/images", upload.array("images", 5), updateShowImages)

// Elimina una o più immagini di uno spettacolo
router.delete("/:id/images", deleteShowImages)

// Riordina le immagini (incluso il flag `isCover`)
router.patch("/:id/images/order", reorderImages)

export default router
