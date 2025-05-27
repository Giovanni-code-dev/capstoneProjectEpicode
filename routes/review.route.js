import express from "express"
import {
  createReview,
  getReviewsForArtist,
  updateReview,
  deleteReview
} from "../controllers/reviewController.js"

import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { viewerOnly } from "../middleware/roleMiddleware.js"
import multer from "multer"

const router = express.Router()

// Config multer per immagini
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Viewer → crea recensione con foto
router.post("/", JWTAuthMiddleware, viewerOnly, upload.array("images", 5), createReview)

// Viewer → modifica la propria recensione
router.patch("/:id", JWTAuthMiddleware, viewerOnly, updateReview)

// Viewer → elimina la propria recensione
router.delete("/:id", JWTAuthMiddleware, viewerOnly, deleteReview)

// Pubblico → tutte le recensioni di un artista
router.get("/artist/:artistId", getReviewsForArtist)

export default router
