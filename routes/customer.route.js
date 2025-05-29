import express from "express"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { customerOnly } from "../middleware/roleMiddleware.js"
import { getUserLocation, updateUserLocation } from "../services/locationService.js"
import { getDashboardMessage } from "../services/dashboardService.js"
import { getUserProfile, updateUserProfile } from "../services/profileService.js"
import upload from "../config/upload.js"

const router = express.Router()

//usa la funzione condivisa per prendere i dati dashboard di viewer
router.get("/dashboard", JWTAuthMiddleware, customerOnly, getDashboardMessage)

//usa la funzione per prendere tutti i dati profile
router.get("/profile", JWTAuthMiddleware, customerOnly, getUserProfile)

//usa la funzione condivisa per prendere i dati location
router.get("/location", JWTAuthMiddleware, customerOnly, getUserLocation)

//usa la funzione condivisa per update location
router.put("/update-location", JWTAuthMiddleware, customerOnly, updateUserLocation)

//usa la funzione condivisa per update profile
router.patch("/update-profile",JWTAuthMiddleware,customerOnly,upload.single("avatar"),updateUserProfile)
  

export default router
