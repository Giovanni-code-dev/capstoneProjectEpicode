import express from "express"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { artistOnly } from "../middleware/roleMiddleware.js"
import upload from "../config/upload.js"
import {
  getArtistDashboard,
  getArtistProfile,
  updateArtistProfile,
  getArtistLocation,
  updateArtistLocation,
  getPublicArtist,
  searchArtists,
  getHighlighted
} from "../controllers/artistController.js"

const router = express.Router()

// Dashboard
router.get("/dashboard", JWTAuthMiddleware, artistOnly, getArtistDashboard)

// Profilo privato artista
router.get("/profile", JWTAuthMiddleware, artistOnly, getArtistProfile)
router.patch("/update-profile", JWTAuthMiddleware, artistOnly, upload.single("avatar"), updateArtistProfile)

// Location
router.get("/location", JWTAuthMiddleware, artistOnly, getArtistLocation)
router.put("/update-location", JWTAuthMiddleware, artistOnly, updateArtistLocation)

// Rotte pubbliche
router.get("/public/:id", getPublicArtist)
router.get("/public", searchArtists)
router.get("/highlighted", getHighlighted)

export default router
