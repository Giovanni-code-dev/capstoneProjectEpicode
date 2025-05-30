import express from "express"
import {
  createPackage,
  getMyPackages,
  updatePackage,
  deletePackage,
  getPackagesByArtistId,
  getPackageById,
  updatePackageImages,
  deletePackageImage,
  reorderImages,
  getPackageImages,
  getAllPackageImagesByArtist,
  getMyPackageById
} from "../controllers/packageController.js"

import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { artistOnly } from "../middleware/roleMiddleware.js"
import upload from "../config/upload.js"

const router = express.Router()

// 📦 Rotta pubblica: ottiene tutti i pacchetti di un artista
router.get("/artist/:artistId", getPackagesByArtistId)

// 📦 Rotta pubblica: ottiene solo le immagini di tutti i pacchetti di un artista
router.get("/artist/:artistId/images", getAllPackageImagesByArtist)

// 📦 Rotta pubblica: ottiene i dettagli di un singolo pacchetto
router.get("/:id", getPackageById)

// 📦 Rotta pubblica: ottiene solo le immagini di un pacchetto specifico
router.get("/:id/images", getPackageImages)

// 🔒 Da qui in poi: rotte protette, solo artista loggato
router.use(JWTAuthMiddleware, artistOnly)

// 📦 Crea un nuovo pacchetto (con upload immagini multiplo)
router.post("/", upload.array("images", 5), createPackage)

// 📦 Ottiene tutti i pacchetti dell’artista loggato
router.get("/", getMyPackages)

//  Dettaglio di un pacchetto per l'artista loggato
router.get("/me/:id", getMyPackageById)


// 📦 Modifica un pacchetto specifico
router.put("/:id", updatePackage)

// 📦 Elimina un pacchetto specifico
router.delete("/:id", deletePackage)

// 📦 Aggiunge nuove immagini a un pacchetto
router.patch("/:id/images", upload.array("images", 5), updatePackageImages)

// 📦 Rimuove una singola immagine da un pacchetto in base all’indice
router.delete("/:id/images/:index", deletePackageImage)

// 📦 Riordina le immagini del pacchetto e imposta la copertina
router.patch("/:id/images/order", reorderImages)

export default router
