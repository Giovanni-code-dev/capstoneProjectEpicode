import express from "express"
import { register, login } from "../controllers/authController.js"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import UserModel from "../models/User.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)

// Profilo dell'utente autenticato
router.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id).select("-password")
    if (!user) return res.status(404).json({ message: "Utente non trovato" })
    res.json(user)
  } catch (error) {
    next(error)
  }
})

export default router
