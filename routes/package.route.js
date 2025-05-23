import express from "express"
import {
  createPackage,
  getMyPackages,
  updatePackage,
  deletePackage,
  getPackagesByArtistId,
  getPackageById,
} from "../controllers/packageController.js"

import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { artistOnly } from "../middleware/roleMiddleware.js"

const router = express.Router()

// Rotta pubblica
router.get("/artist/:artistId", getPackagesByArtistId)
router.get("/:id", getPackageById) // pubblica

// Rotte private
router.use(JWTAuthMiddleware, artistOnly)

router.post("/", createPackage)
router.get("/", getMyPackages)
router.put("/:id", updatePackage)
router.delete("/:id", deletePackage)

export default router
