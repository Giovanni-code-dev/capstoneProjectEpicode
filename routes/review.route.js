import express from "express"
import {
  createReview,
  getReviewsForArtist,
  updateReview,
  deleteReview,
  deleteReviewImages,
  addReviewImages,
  getMyReviews 
} from "../controllers/reviewController.js"

import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { customerOnly } from "../middleware/roleMiddleware.js"
import multer from "multer"

const router = express.Router()

// Config multer per upload immagini (in memoria)
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Customer → crea una nuova recensione (max 3 immagini)
router.post("/", JWTAuthMiddleware, customerOnly, upload.array("images", 3), createReview)

// Customer → modifica la propria recensione (solo rating/comment)
router.patch("/:id", JWTAuthMiddleware, customerOnly, updateReview)

// Customer → elimina una propria recensione
router.delete("/:id", JWTAuthMiddleware, customerOnly, deleteReview)

// Customer → aggiunge immagini a una recensione esistente
router.patch("/:id/images", JWTAuthMiddleware, customerOnly, upload.array("images", 3), addReviewImages)

// DELETE immagini da una recensione passando public_ids nel body
router.delete("/:id/images", JWTAuthMiddleware, customerOnly, deleteReviewImages) 

// Customer → visualizza tutte le proprie recensioni
router.get("/me", JWTAuthMiddleware, customerOnly, getMyReviews)

// Pubblico → tutte le recensioni di un artista
router.get("/artist/:artistId", getReviewsForArtist)

export default router
