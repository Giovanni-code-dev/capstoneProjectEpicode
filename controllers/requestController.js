import ArtistModel from "../models/Artist.js"
import PackageModel from "../models/Package.js"
import ShowModel from "../models/Show.js"
import RequestModel from "../models/Request.js"
import CalendarModel from "../models/CalendarEntry.js"
import createHttpError from "http-errors"
import { sendEmail } from "../utils/sendEmail.js" // ✉️ Email utility

// 1. Utente invia una nuova richiesta
export const createRequest = async (req, res, next) => {
  try {
    const {
      artist,
      packages = [],
      shows = [],
      location,
      distanceKm,
      date,
      message,
      name,
      email
    } = req.body

    if (!artist || !date) {
      throw createHttpError(400, "Artista e data sono obbligatori")
    }

    const artistExists = await ArtistModel.findById(artist)
    if (!artistExists) throw createHttpError(404, "Artista non trovato")

    if (packages.length > 0) {
      const existingPackages = await PackageModel.find({ _id: { $in: packages } })
      if (existingPackages.length !== packages.length) {
        throw createHttpError(400, "Alcuni ID di pacchetti non sono validi")
      }
    }

    if (shows.length > 0) {
      const existingShows = await ShowModel.find({ _id: { $in: shows } })
      if (existingShows.length !== shows.length) {
        throw createHttpError(400, "Alcuni ID di spettacoli non sono validi")
      }
    }

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
      customer: req.user._id,
      artist,
      packages,
      shows,
      name,
      email,
      location,
      distanceKm,
      date,
      message
    })

    const saved = await newRequest.save()

    //  Recupera titoli spettacoli (per email)
    let showTitles = []
    if (shows.length > 0) {
      const selectedShows = await ShowModel.find({ _id: { $in: shows } }, "title")
      showTitles = selectedShows.map(s => s.title)
    }

    // ✉️ Invia email all’artista
    try {
      if (artistExists.email) {
        await sendEmail({
          to: artistExists.email,
          subject: ` Nuova richiesta da ${name}`,
          text: `Hai ricevuto una richiesta per la data ${new Date(date).toLocaleDateString("it-IT")}.`,
          html: `
            <h2>Ciao ${artistExists.name}!</h2>
            <p>Hai ricevuto una nuova richiesta da <strong>${name}</strong> (${email}) per il giorno <strong>${new Date(date).toLocaleDateString("it-IT")}</strong>.</p>
            ${
              showTitles.length > 0
                ? `<p><strong>Spettacoli richiesti:</strong><br>${showTitles.join(", ")}</p>`
                : `<p>Nessuno spettacolo selezionato.</p>`
            }
            <p><strong>Messaggio:</strong></p>
            <blockquote>${message || "Nessun messaggio aggiunto"}</blockquote>
          `
        })
      }
    } catch (emailError) {
      console.error("Errore nell'invio email all'artista:", emailError.message)
    }

    console.log(
      `[REQUEST] ${req.user.name || req.user.email} ha richiesto uno o più spettacoli a ${artist} per il ${new Date(date).toLocaleDateString()}`
    )

    res.status(201).json(saved)
  } catch (error) {
    next(error)
  }
}

// 2. Utente visualizza tutte le sue richieste
export const getMyRequests = async (req, res, next) => {
  try {
    const query = { customer: req.user._id }
    if (req.query.status) query.status = req.query.status

    const requests = await RequestModel.find(query)
      .populate("artist", "name")
      .populate("packages", "title")
      .populate("shows", "title")

    res.json(requests)
  } catch (error) {
    next(error)
  }
}

// 3. Artista visualizza richieste ricevute
export const getRequestsForArtist = async (req, res, next) => {
  try {
    const query = { artist: req.user._id }
    if (req.query.status) query.status = req.query.status

    const requests = await RequestModel.find(query)
      .populate("customer", "name email")
      .populate("packages", "title")
      .populate("shows", "title")

    res.json(requests)
  } catch (error) {
    next(error)
  }
}

// 4. Artista accetta/rifiuta richiesta
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
      .populate("customer", "name email")
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

      console.log(`Calendario aggiornato: ${req.user.name || req.user.email} ha prenotato il ${dataStr}`)
    }

    res.json(updated)
  } catch (error) {
    next(error)
  }
}

// 5. Admin o artista visualizza una richiesta specifica
export const getRequestById = async (req, res, next) => {
  try {
    const found = await RequestModel.findById(req.params.id)
      .populate("customer", "name email")
      .populate("artist", "name")
      .populate("packages")
      .populate("shows")

    if (!found) throw createHttpError(404, "Richiesta non trovata")
    res.json(found)
  } catch (error) {
    next(error)
  }
}
