import express from "express"
import { getPublicArtistProfile, searchArtistsByFilters, getHighlightedArtists } from "../services/artistService.js"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { artistOnly } from "../middleware/roleMiddleware.js"
import { getUserLocation, updateUserLocation } from "../services/locationService.js"
import UserModel from "../models/User.js"
import { getDashboardMessage } from "../services/dashboardService.js"
import { getUserProfile, updateUserProfile } from "../services/profileService.js"
import upload from "../config/upload.js"





const router = express.Router()

// usa la funzione condivisa prendere la dashboard di artist
router.get("/dashboard", JWTAuthMiddleware, artistOnly, getDashboardMessage)

// Rotta pubblica: profilo visibile a tutti
router.get("/public/:id", getPublicArtistProfile)

// Tutti gli artisti di una città (visibile pubblicamente)
router.get("/public", searchArtistsByFilters)

// usa la funzione prendere i dati di artist
router.get("/profile", JWTAuthMiddleware, artistOnly, getUserProfile)

// usa la funzione condivisa per dati location
router.get("/location", JWTAuthMiddleware, artistOnly, getUserLocation)

// usa la funzione condivisa per update location
router.put("/update-location", JWTAuthMiddleware, artistOnly, updateUserLocation)

// usa la funzione condivisa per update profile
router.patch("/update-profile", JWTAuthMiddleware, artistOnly, upload.single("avatar"),updateUserProfile)


router.get("/highlighted", getHighlightedArtists)


export default router
