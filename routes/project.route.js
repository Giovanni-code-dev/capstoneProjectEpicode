// routes/project.route.js

import express from "express"
import {
  createProject,
  getMyProjects,
  updateProject,
  deleteProject,
  getProjectsByArtistId,
  updateProjectImages,
  deleteProjectImage,
  reorderProjectImages
} from "../controllers/projectController.js"

import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { artistOnly } from "../middleware/roleMiddleware.js"
import upload from "../config/upload.js"

const router = express.Router()

// Rotta pubblica
router.get("/artist/:artistId", getProjectsByArtistId)

// Rotte private (autenticazione + autorizzazione artista)
router.use(JWTAuthMiddleware, artistOnly)

router.post("/", upload.array("images", 5), createProject)
router.get("/", getMyProjects)
router.patch("/:id", updateProject)
router.delete("/:id", deleteProject)

router.patch("/:id/images", upload.array("images", 5), updateProjectImages)

// nuova rotta con public_id invece di index
router.delete("/:id/images", deleteProjectImage)

router.patch("/:id/images/order", reorderProjectImages)

export default router
