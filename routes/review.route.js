import express from "express"
import {
  createReview,
  getReviewsForArtist,
  updateReview,
  deleteReview,
  getMyReviews 
} from "../controllers/reviewController.js"

import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { customerOnly } from "../middleware/roleMiddleware.js"
import multer from "multer"

const router = express.Router()

// Config multer per immagini
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Viewer → crea recensione con foto
router.post("/", JWTAuthMiddleware, customerOnly, upload.array("images", 5), createReview)

// Viewer → modifica la propria recensione
router.patch("/:id", JWTAuthMiddleware, customerOnly, updateReview)

// Viewer → elimina la propria recensione
router.delete("/:id", JWTAuthMiddleware, customerOnly, deleteReview)

// Viewer → ottieni tutte le recensioni scritte da te
router.get("/me", JWTAuthMiddleware, customerOnly, getMyReviews)

// Pubblico → tutte le recensioni di un artista
router.get("/artist/:artistId", getReviewsForArtist)

export default router
