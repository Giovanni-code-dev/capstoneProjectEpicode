import express from "express"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { artistOnly } from "../middleware/roleMiddleware.js"

const router = express.Router()

// 🎭 Route visibile solo ad artisti loggati
router.get("/profile", JWTAuthMiddleware, artistOnly, (req, res) => {
  res.json({
    message: `Benvenuto artista! Il tuo ID è ${req.user._id}`,
    role: req.user.role,
  })
})

export default router
