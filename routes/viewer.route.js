import express from "express"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { viewerOnly } from "../middleware/roleMiddleware.js"
import { updateUserLocation } from "../services/locationService.js"
import UserModel from "../models/User.js"

const router = express.Router()

router.get("/profile", JWTAuthMiddleware, viewerOnly, (req, res) => {
  res.json({
    message: `Benvenuto viewer! Il tuo ID è ${req.user._id}`,
    role: req.user.role,
  })
})

router.get("/location", JWTAuthMiddleware, viewerOnly, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id).select("location")
    if (!user || !user.location) {
      return res.status(404).json({ message: "Nessuna posizione salvata." })
    }
    res.json({ location: user.location })
  } catch (error) {
    next(error)
  }
})

// ✅ usa la funzione condivisa
router.put("/update-location", JWTAuthMiddleware, viewerOnly, updateUserLocation)

export default router
