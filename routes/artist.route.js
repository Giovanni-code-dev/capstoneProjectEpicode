import express from "express"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { artistOnly } from "../middleware/roleMiddleware.js"
import upload from "../config/upload.js"

import {
  getArtistDashboard,
  getArtistProfile,
  updateArtistProfile,
  getArtistLocation,
  updateArtistLocation,
  getPublicArtist,
  searchArtists,
  getHighlighted
} from "../controllers/artistController.js"

const router = express.Router()

// === Rotte protette per artisti autenticati === //

// Restituisce dati per la dashboard dell'artista (es. richieste ricevute, statistiche)
router.get("/dashboard", JWTAuthMiddleware, artistOnly, getArtistDashboard)

// Recupera il profilo dell’artista loggato (privato)
router.get("/profile", JWTAuthMiddleware, artistOnly, getArtistProfile)

// Aggiorna il profilo dell’artista loggato (include supporto avatar)
router.patch(
  "/update-profile",
  JWTAuthMiddleware,
  artistOnly,
  upload.single("avatar"),
  updateArtistProfile
)

// Ottiene la geolocalizzazione dell’artista loggato (city, address, coordinates)
router.get("/location", JWTAuthMiddleware, artistOnly, getArtistLocation)

// Aggiorna la geolocalizzazione dell’artista (trigger per calcolo coordinate)
router.put("/update-location", JWTAuthMiddleware, artistOnly, updateArtistLocation)


// === Rotte pubbliche === //

// Ottiene il profilo pubblico di un artista specifico (visibile in frontend)
router.get("/public/:id", getPublicArtist)

// Ricerca artisti tramite query string (?name=&city=&category=...)
router.get("/public", searchArtists)

// Restituisce una selezione di artisti "in evidenza" (curati dall'admin o da algoritmo)
router.get("/highlighted", getHighlighted)

export default router
