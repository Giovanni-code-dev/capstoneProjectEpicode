import express from "express"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { viewerOnly } from "../middleware/roleMiddleware.js"
import { getUserLocation, updateUserLocation } from "../services/locationService.js"
import UserModel from "../models/User.js"
import { getDashboardMessage } from "../services/dashboardService.js"
import { getUserProfile, updateUserProfile } from "../services/profileService.js"
import upload from "../config/upload.js"

const router = express.Router()

//usa la funzione condivisa per prendere i dati dashboard di viewer
router.get("/dashboard", JWTAuthMiddleware, viewerOnly, getDashboardMessage)

//usa la funzione per prendere tutti i dati profile
router.get("/profile", JWTAuthMiddleware, viewerOnly, getUserProfile)

//usa la funzione condivisa per prendere i dati location
router.get("/location", JWTAuthMiddleware, viewerOnly, getUserLocation)

//usa la funzione condivisa per update location
router.put("/update-location", JWTAuthMiddleware, viewerOnly, updateUserLocation)

//usa la funzione condivisa per update profile
router.patch("/update-profile",JWTAuthMiddleware,viewerOnly,upload.single("avatar"),updateUserProfile)
  

export default router
