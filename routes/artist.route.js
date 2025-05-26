import express from "express"
import { getPublicArtistProfile, searchArtistsByFilters } from "../services/artistService.js"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { artistOnly } from "../middleware/roleMiddleware.js"
import { getUserLocation, updateUserLocation } from "../services/locationService.js"
import UserModel from "../models/User.js"
import { getDashboardMessage } from "../services/dashboardService.js"
import { getUserProfile, updateUserProfile } from "../services/profileService.js"


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
router.put("/update-profile", JWTAuthMiddleware, artistOnly, updateUserProfile)


export default router
