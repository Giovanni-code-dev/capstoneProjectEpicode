import express from "express"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { customerOnly } from "../middleware/roleMiddleware.js"
import upload from "../config/upload.js"

import {
  getCustomerDashboard,
  getCustomerProfile,
  updateCustomerProfile,
  getCustomerLocation,
  updateCustomerLocation
} from "../controllers/customerController.js"

const router = express.Router()

// === Rotte protette per utenti con ruolo "customer" (viewer) === //

// Restituisce dati utili al customer loggato per la sua dashboard (es. richieste inviate, preferiti, ecc.)
router.get("/dashboard", JWTAuthMiddleware, customerOnly, getCustomerDashboard)

// Ottiene il profilo utente (privato)
router.get("/profile", JWTAuthMiddleware, customerOnly, getCustomerProfile)

// Aggiorna il profilo utente (con possibilità di caricare immagine avatar)
router.patch(
  "/update-profile",
  JWTAuthMiddleware,
  customerOnly,
  upload.single("avatar"),
  updateCustomerProfile
)

// Recupera la posizione salvata del customer (city, address, coordinates)
router.get("/location", JWTAuthMiddleware, customerOnly, getCustomerLocation)

// Aggiorna la posizione del customer e ne ricalcola automaticamente le coordinate
router.put("/update-location", JWTAuthMiddleware, customerOnly, updateCustomerLocation)


// Restituisce i dati grezzi del customer loggato (token valido)
router.get("/me", JWTAuthMiddleware, customerOnly, (req, res) => {
  res.json(req.user)
})

export default router
