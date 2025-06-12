import express from "express"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { artistOnly } from "../middleware/roleMiddleware.js"
import {
  getMyCalendar,
  addCalendarEntry,
  deleteCalendarEntry,
  getOccupiedArtists //  IMPORTA LA FUNZIONE
} from "../controllers/calendarController.js"

const router = express.Router()

// =========================
// Rotta pubblica
// =========================
router.get("/occupied", getOccupiedArtists) // AGGIUNTA PRIMA DI auth

// =========================
//  Rotte per artisti loggati
// =========================
router.use(JWTAuthMiddleware, artistOnly)

router.get("/", getMyCalendar)
router.post("/", addCalendarEntry)
router.delete("/:id", deleteCalendarEntry)

export default router
