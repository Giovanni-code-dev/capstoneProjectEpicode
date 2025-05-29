import express from "express"
import {
  createShow,
  getMyShows,
  updateShow,
  deleteShow,
  getShowsByArtistId,
  updateShowImages,
  deleteShowImage,
  reorderImages
} from "../controllers/showController.js"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { artistOnly } from "../middleware/roleMiddleware.js"
import upload from "../config/upload.js"

const router = express.Router()

// Rotta pubblica: mostra tutti gli show di un artista
router.get("/artist/:artistId", getShowsByArtistId)

// Tutte le rotte da qui in giù richiedono JWT + artista
router.use(JWTAuthMiddleware, artistOnly)

// Rotte private
router.post("/", upload.array("images", 5), createShow)
router.get("/", getMyShows)
router.put("/:id", updateShow)
router.delete("/:id", deleteShow)
router.patch("/:id/images", upload.array("images", 5), updateShowImages)
router.delete("/:id/images/:index", deleteShowImage)
router.patch("/:id/images/order", reorderImages)

export default router
