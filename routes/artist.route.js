import express from "express"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { artistOnly } from "../middleware/roleMiddleware.js"
import { updateUserLocation } from "../services/locationService.js"
import UserModel from "../models/User.js"

const router = express.Router()

router.get("/profile", JWTAuthMiddleware, artistOnly, (req, res) => {
  res.json({
    message: `Benvenuto artista! Il tuo ID è ${req.user._id}`,
    role: req.user.role,
  })
})

router.get("/location", JWTAuthMiddleware, artistOnly, async (req, res, next) => {
  try {
    const artist = await UserModel.findById(req.user._id).select("location")
    if (!artist || !artist.location) {
      return res.status(404).json({ message: "Nessuna posizione salvata." })
    }
    res.json({ location: artist.location })
  } catch (error) {
    next(error)
  }
})

// ✅ usa la funzione condivisa
router.put("/update-location", JWTAuthMiddleware, artistOnly, updateUserLocation)

export default router
