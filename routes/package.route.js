import express from "express"
import {
  createPackage,
  getMyPackages,
  updatePackage,
  deletePackage,
  getPackagesByArtistId,
  getPackageById,
  updatePackageImages,
  deletePackageImage,
  reorderImages
} from "../controllers/packageController.js"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { artistOnly } from "../middleware/roleMiddleware.js"
import upload from "../config/upload.js"

const router = express.Router()

//  Rotte pubbliche
router.get("/artist/:artistId", getPackagesByArtistId)
router.get("/:id", getPackageById)

//  Tutte le rotte sotto richiedono autenticazione + artista
router.use(JWTAuthMiddleware, artistOnly)

//  Rotte private (protette da middleware sopra)
router.post("/", upload.array("images", 5), createPackage)
router.get("/", getMyPackages)
router.put("/:id", updatePackage)
router.delete("/:id", deletePackage)
router.patch("/:id/images", upload.array("images", 5), updatePackageImages)
router.delete("/:id/images/:index", deletePackageImage)
router.patch("/:id/images/order", reorderImages)

export default router
