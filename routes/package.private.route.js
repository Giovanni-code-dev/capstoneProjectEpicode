import express from "express"
import {
  createPackage,
  getMyPackages,
  getMyPackageById,
  updatePackage,
  deletePackage,
  updatePackageImages,
  deletePackageImages,
  reorderImages,
  getMyPackageCategories
} from "../controllers/packageController.js"

import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { artistOnly } from "../middleware/roleMiddleware.js"
import upload from "../config/upload.js"

const router = express.Router()

// Middleware globale: solo artisti autenticati possono accedere a queste rotte
router.use(JWTAuthMiddleware, artistOnly)

// ==============================
//  CRUD pacchetti artisti
// ==============================

// Crea un nuovo pacchetto con immagini (max 5)
router.post("/", upload.array("images", 5), createPackage)

// Recupera tutti i pacchetti dell'artista loggato
router.get("/", getMyPackages)

// Recupera un pacchetto specifico dell'artista loggato
router.get("/me/:id", getMyPackageById)

// Recupera tutte le categorie usate nei pacchetti dell'artista loggato
router.get("/categories/me", getMyPackageCategories)

// Modifica i dati di un pacchetto (senza immagini)
router.patch("/:id", updatePackage)

// Elimina un pacchetto esistente
router.delete("/:id", deletePackage)

// Aggiunge nuove immagini a un pacchetto (max 5 per chiamata)
router.patch("/:id/images", upload.array("images", 5), updatePackageImages)

// Elimina immagini specifiche da un pacchetto (via public_id[])
router.delete("/:id/images", deletePackageImages)

// Riordina immagini di un pacchetto (e assegna copertina)
router.patch("/:id/images/order", reorderImages)

export default router
