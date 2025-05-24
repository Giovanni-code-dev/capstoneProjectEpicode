import express from "express"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { adminOnly } from "../middleware/roleMiddleware.js"
import UserModel from "../models/User.js"
import RequestModel from "../models/Request.js"


const router = express.Router()

router.get("/dashboard", JWTAuthMiddleware, adminOnly, (req, res) => {
  res.json({
    message: `Benvenuto admin! Il tuo ID è ${req.user._id}`,
    role: req.user.role,
  })
})

// 🔍 GET /admin/users → tutti gli utenti
router.get("/users", JWTAuthMiddleware, adminOnly, async (req, res, next) => {
    try {
      const users = await UserModel.find().select("-password") // esclude hash
      res.json(users)
    } catch (error) {
      next(error)
    }
  })

  // 🧠 Endpoint analisi generale richieste (admin)
  router.get("/requests", JWTAuthMiddleware, adminOnly, async (req, res, next) => {
    try {
      const { status } = req.query
  
      const query = {}
      if (status) query.status = status  // es: pending, accepted, declined
  
      const requests = await RequestModel.find(query)
        .populate("user", "email name")
        .populate("artist", "email name")
        .populate("packages", "title")
        .populate("shows", "title")
        .sort({ createdAt: -1 })
  
      res.json(requests)
    } catch (error) {
      next(error)
    }
  })

export default router
