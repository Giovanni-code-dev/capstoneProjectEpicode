import express from "express"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { customerOnly } from "../middleware/roleMiddleware.js"
import upload from "../config/upload.js"
import {
  getCustomerDashboard,
  getCustomerProfile,
  updateCustomerProfile,
  getCustomerLocation,
  updateCustomerLocation
} from "../controllers/customerController.js"

const router = express.Router()

// Dashboard
router.get("/dashboard", JWTAuthMiddleware, customerOnly, getCustomerDashboard)

// Profilo
router.get("/profile", JWTAuthMiddleware, customerOnly, getCustomerProfile)
router.patch("/update-profile", JWTAuthMiddleware, customerOnly, upload.single("avatar"), updateCustomerProfile)

// Geolocalizzazione
router.get("/location", JWTAuthMiddleware, customerOnly, getCustomerLocation)
router.put("/update-location", JWTAuthMiddleware, customerOnly, updateCustomerLocation)

export default router
