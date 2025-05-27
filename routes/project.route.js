import express from "express"
import {
  createProject,
  getMyProjects,
  updateProject,
  deleteProject,
  getProjectsByArtistId,
} from "../controllers/projectController.js"

import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { artistOnly } from "../middleware/roleMiddleware.js"

const router = express.Router()

// Rotta pubblica: tutti i progetti di un artista (visibile anche ai visitatori)
router.get("/artist/:artistId", getProjectsByArtistId)

// Rotte private (solo per artisti loggati)
router.use(JWTAuthMiddleware, artistOnly)

router.post("/", createProject)
router.get("/", getMyProjects)
router.put("/:id", updateProject)
router.delete("/:id", deleteProject)

export default router
