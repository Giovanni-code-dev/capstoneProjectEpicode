import express from "express"
import {
  createShow,
  getMyShows,
  updateShow,
  deleteShow,
  getShowsByArtistId,
} from "../controllers/showController.js"

import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { artistOnly } from "../middleware/roleMiddleware.js"

const router = express.Router()

// 🎭 Rotta pubblica per vedere gli show di un artista (visibile anche ai visitatori)
router.get("/artist/:artistId", getShowsByArtistId)

// 🔐 Rotte private per artisti loggati
router.use(JWTAuthMiddleware, artistOnly)

router.post("/", createShow)
router.get("/", getMyShows)
router.put("/:id", updateShow)
router.delete("/:id", deleteShow)

export default router
