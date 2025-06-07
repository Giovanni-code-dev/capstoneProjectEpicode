import jwt from "jsonwebtoken"
import createHttpError from "http-errors"

import Artist from "../models/Artist.js"
import Customer from "../models/Customer.js"
import Admin from "../models/Admin.js"

/**
 * Middleware di autenticazione JWT.
 * - Verifica la presenza e validità del token
 * - Carica il documento utente corretto dal DB
 * - Espone req.user (documento completo) e req.userType ("Artist", "Customer", "Admin")
 */
export const JWTAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith("Bearer ")) {
      throw createHttpError(401, "Token mancante o malformato")
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { _id, role } = decoded

    let user, model

    switch (role.toLowerCase()) {
      case "artist":
        user = await Artist.findById(_id)
        model = "Artist"
        break
      case "customer":
        user = await Customer.findById(_id)
        model = "Customer"
        break
      case "admin":
        user = await Admin.findById(_id)
        model = "Admin"
        break
      default:
        throw createHttpError(401, "Ruolo utente non riconosciuto")
    }

    if (!user) throw createHttpError(404, "Utente non trovato")

    console.log("Decoded JWT:", decoded)
    console.log(` Ruolo rilevato: ${role} → modello: ${model}`)
    console.log(" Utente autenticato:", user)

    req.user = user
    req.userType = model
    next()
  } catch (error) {
    next(error)
  }
}

