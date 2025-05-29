import createHttpError from "http-errors"
import { getCoordinatesFromAddress } from "../utils/geocoding.js"

import Artist from "../models/Artist.js"
import Customer from "../models/Customer.js"
import Admin from "../models/Admin.js"

// Helper per ottenere il modello corretto
const getModelByUserType = (type) => {
  switch (type) {
    case "Artist":
      return Artist
    case "Customer":
      return Customer
    case "Admin":
      return Admin
    default:
      throw new Error("Tipo utente sconosciuto")
  }
}

// Aggiorna la posizione dell'utente
export const updateUserLocation = async (req, res, next) => {
  try {
    /*
    console.log("updateUserLocation chiamato")
    console.log("Body ricevuto:", req.body)
    console.log("Utente autenticato:", req.user)
    console.log("Tipo utente:", req.userType)
    */
    const { city, address } = req.body

    if (!city || !address) {
      throw createHttpError(400, "City e address sono obbligatori")
    }

    const coordinates = await getCoordinatesFromAddress(city, address)

    //console.log("Coordinate ottenute:", coordinates)

    const Model = getModelByUserType(req.userType)

    //console.log("Modello usato:", Model.modelName)

    const updatedUser = await Model.findByIdAndUpdate(
      req.user._id,
      {
        location: {
          city,
          address,
          coordinates,
        },
      },
      { new: true }
    )

    if (!updatedUser) {
      throw createHttpError(404, "Utente non trovato")
    }

    console.log("Utente aggiornato:", updatedUser)

    res.json({
      message: "Posizione aggiornata con successo!",
      location: updatedUser.location,
    })
  } catch (error) {
    console.error("Errore updateUserLocation:", error)
    next(error)
  }
}


// Recupera la posizione dell'utente
export const getUserLocation = async (req, res, next) => {
  try {
    const Model = getModelByUserType(req.userType)

    const user = await Model.findById(req.user._id).select("location")

    if (!user || !user.location) {
      throw createHttpError(404, "Posizione non trovata.")
    }

    res.json({ location: user.location })
  } catch (error) {
    next(error)
  }
}
