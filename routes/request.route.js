import express from "express"
import {
  createRequest,
  getMyRequests,
  getRequestsForArtist,
  updateRequestStatus,
  getRequestById,
} from "../controllers/requestController.js"

import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { artistOnly, viewerOnly } from "../middleware/roleMiddleware.js"

const router = express.Router()

// 🔐 Tutte le rotte richiedono autenticazione
router.use(JWTAuthMiddleware)

// 👤 Viewer
router.post("/", viewerOnly, createRequest)      // invia richiesta
router.get("/me", viewerOnly, getMyRequests)     // lista proprie richieste

// 🎭 Artista
router.get("/artist", artistOnly, getRequestsForArtist)           // ricevute
router.patch("/:id/status", artistOnly, updateRequestStatus)      // cambia stato

// 🔍 Dettaglio singola richiesta (accesso autenticato)
router.get("/:id", getRequestById)

export default router
