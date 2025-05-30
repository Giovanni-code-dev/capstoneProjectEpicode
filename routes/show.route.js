import express from "express"
import {
  createShow,
  getMyShows,
  updateShow,
  deleteShow,
  getShowsByArtistId,
  updateShowImages,
  deleteShowImage,
  reorderImages,
  getShowImages,
  getAllShowImagesByArtist,
  getShowById,
  getMyShowById
} from "../controllers/showController.js"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { artistOnly } from "../middleware/roleMiddleware.js"
import upload from "../config/upload.js"

const router = express.Router()

// Rotta pubblica: mostra tutti gli show di un artista
router.get("/artist/:artistId", getShowsByArtistId)
router.get("/:id", getShowById) // Senza middleware JWT
router.get("/:id/images", getShowImages) // rest tutte le immagini di uno show
router.get("/artist/:artistId/images", getAllShowImagesByArtist) // rest tutte le img di tutti i shows di un artista


// Tutte le rotte da qui in giù richiedono JWT + artista
router.use(JWTAuthMiddleware, artistOnly)

// Rotte private
router.post("/", upload.array("images", 5), createShow)
router.get("/", getMyShows)
router.get("/me/:id", getMyShowById) // nuova rotta privata


router.patch("/:id", updateShow)
router.delete("/:id", deleteShow)
router.patch("/:id/images", upload.array("images", 5), updateShowImages)
router.delete("/:id/images/:index", deleteShowImage)
router.patch("/:id/images/order", reorderImages)

export default router

