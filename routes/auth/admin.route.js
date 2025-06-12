import express from "express"
import { loginAdmin } from "../../controllers/auth/adminAuthController.js"

const router = express.Router()

// LOGIN ADMIN
router.post("/login", loginAdmin)

export default router
