import express from "express"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { adminOnly } from "../middleware/roleMiddleware.js"
import upload from "../config/upload.js"

import {
  getAdminDashboard,
  getAdminProfile,
  updateAdminProfile,
  getAllUsers,
  getAllRequests
} from "../controllers/adminController.js"

const router = express.Router()

// Recupera i dati della dashboard dell'amministratore (es. statistiche o messaggi personalizzati)
router.get("/dashboard", JWTAuthMiddleware, adminOnly, getAdminDashboard)

// Recupera il profilo dell'amministratore loggato
router.get("/profile", JWTAuthMiddleware, adminOnly, getAdminProfile)

// Aggiorna il profilo dell’amministratore, inclusa eventuale immagine avatar
router.patch(
  "/update-profile",
  JWTAuthMiddleware,
  adminOnly,
  upload.single("avatar"),
  updateAdminProfile
)

// Recupera la lista completa di tutti gli utenti del sistema (artisti, customer, admin)
router.get("/users", JWTAuthMiddleware, adminOnly, getAllUsers)

// Recupera tutte le richieste di preventivo filtrabili tramite query param ?status=
router.get("/requests", JWTAuthMiddleware, adminOnly, getAllRequests)

export default router
