import express from "express"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { adminOnly } from "../middleware/roleMiddleware.js"
import upload from "../config/upload.js"

import {
  getAdminDashboard,
  getAdminProfile,
  updateAdminProfile,
  getAllUsers,
  getAllRequests
} from "../controllers/adminController.js"

const router = express.Router()

router.get("/dashboard", JWTAuthMiddleware, adminOnly, getAdminDashboard)
router.get("/profile", JWTAuthMiddleware, adminOnly, getAdminProfile)
router.patch("/update-profile", JWTAuthMiddleware, adminOnly, upload.single("avatar"), updateAdminProfile)
router.get("/users", JWTAuthMiddleware, adminOnly, getAllUsers)
router.get("/requests", JWTAuthMiddleware, adminOnly, getAllRequests)

export default router
