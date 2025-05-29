import RequestModel from "../models/Request.js"
import CalendarModel from "../models/CalendarEntry.js"
import createHttpError from "http-errors"

// 🔹 1. Utente invia una nuova richiesta
export const createRequest = async (req, res, next) => {
  try {
    const { artist, packages, shows, location, distanceKm, date, message } = req.body

    if (!artist || !date) {
      throw createHttpError(400, "Artista e data sono obbligatori")
    }

    // Verifica se l'artista è già impegnato
    const conflict = await CalendarModel.findOne({
      artist,
      date,
      status: { $in: ["booked", "unavailable"] }
    })

    if (conflict) {
      return res.status(409).json({
        status: "error",
        message: "L'artista non è disponibile per la data selezionata"
      })
    }

    const newRequest = new RequestModel({
      user: req.user._id,
      artist,
      packages,
      shows,
      location,
      distanceKm,
      date,
      message
    })

    const saved = await newRequest.save()

    console.log(`[REQUEST] ${req.user.name || req.user.email} ha richiesto uno o più spettacoli a ${artist} per il ${new Date(date).toLocaleDateString()}`)

    res.status(201).json(saved)
  } catch (error) {
    next(error)
  }
}

// 🔹 2. Utente visualizza tutte le sue richieste
export const getMyRequests = async (req, res, next) => {
  try {
    const query = { user: req.user._id }
    if (req.query.status) query.status = req.query.status

    const requests = await RequestModel.find(query)
      .populate("artist", "name")
      .populate("packages")
      .populate("shows")

    res.json(requests)
  } catch (error) {
    next(error)
  }
}

// 🔹 3. Artista visualizza richieste ricevute
export const getRequestsForArtist = async (req, res, next) => {
  try {
    const query = { artist: req.user._id }
    if (req.query.status) query.status = req.query.status

    const requests = await RequestModel.find(query)
      .populate("user", "name email")
      .populate("packages", "title")
      .populate("shows", "title")

    res.json(requests)
  } catch (error) {
    next(error)
  }
}

// 🔹 4. Artista accetta/rifiuta richiesta
export const updateRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!["accepted", "declined"].includes(status)) {
      throw createHttpError(400, "Stato non valido. Usa 'accepted' o 'declined'")
    }

    const updated = await RequestModel.findOneAndUpdate(
      { _id: id, artist: req.user._id },
      { status },
      { new: true }
    )
      .populate("user", "name email")
      .populate("artist", "name")
      .populate("packages", "title")
      .populate("shows", "title")

    if (!updated) throw createHttpError(404, "Richiesta non trovata o non autorizzato")

    const username = updated.user?.name || updated.user?.email || "utente"
    const city = updated.location?.city || "luogo sconosciuto"
    const dataStr = new Date(updated.date).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })

    console.log(`Richiesta ${status} da ${username} per il ${dataStr} a ${city}`)

    if (status === "accepted") {
      const conflict = await CalendarModel.findOne({
        artist: req.user._id,
        date: updated.date,
        status: { $in: ["booked", "unavailable"] }
      })

      if (conflict) {
        updated.status = "declined"
        await updated.save()

        console.log(`⚠️ Richiesta ${updated._id} rifiutata automaticamente: data già occupata (${updated.date.toISOString().slice(0, 10)})`)
        return res.status(200).json({
          message: "La richiesta è stata rifiutata automaticamente: la data è già occupata.",
          request: updated
        })
      }

      await CalendarModel.create({
        artist: req.user._id,
        date: updated.date,
        status: "booked",
        notes: `Data confermata per richiesta ${updated._id}`
      })

      console.log(`📆 Calendario aggiornato: ${req.user.name || req.user.email} ha prenotato il ${dataStr}`)
    }

    res.json(updated)
  } catch (error) {
    next(error)
  }
}

// 🔹 5. Admin o artista visualizza una richiesta specifica
export const getRequestById = async (req, res, next) => {
  try {
    const found = await RequestModel.findById(req.params.id)
      .populate("user", "name email")
      .populate("artist", "name")
      .populate("packages")
      .populate("shows")

    if (!found) throw createHttpError(404, "Richiesta non trovata")
    res.json(found)
  } catch (error) {
    next(error)
  }
}
