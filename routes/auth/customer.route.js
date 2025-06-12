import express from "express"
import { registerCustomer, loginCustomer } from "../../controllers/auth/customerAuthController.js"

const router = express.Router()

// ROTTE AUTENTICAZIONE CUSTOMER
router.post("/register", registerCustomer)
router.post("/login", loginCustomer)

export default router
