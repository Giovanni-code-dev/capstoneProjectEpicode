import express from "express"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { adminOnly } from "../middleware/roleMiddleware.js"
import UserModel from "../models/User.js"
import RequestModel from "../models/Request.js"
import { getDashboardMessage } from "../services/dashboardService.js"
import { getUserProfile, updateUserProfile } from "../services/profileService.js"


const router = express.Router()



// usa la funzione condivisa prendere i dati dashboard di admin
router.get("/dashboard", JWTAuthMiddleware, adminOnly, getDashboardMessage)

// usa la funzione prendere i dati di admin
router.get("/profile", JWTAuthMiddleware, adminOnly, getUserProfile)

// //usa la funzione per prendere i dati di tutti gli users
router.get("/users", JWTAuthMiddleware, adminOnly, async (req, res, next) => {
    try {
      const users = await UserModel.find().select("-password") // esclude hash
      res.json(users)
    } catch (error) {
      next(error)
    }
  })

  // Endpoint analisi generale richieste (admin)
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

  // Rotta per aggiornare profilo admin
router.put("/update-profile", JWTAuthMiddleware, adminOnly, updateUserProfile)

export default router
