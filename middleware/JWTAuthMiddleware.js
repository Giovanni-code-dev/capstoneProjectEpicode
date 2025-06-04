import jwt from "jsonwebtoken"
import createHttpError from "http-errors"

import Artist from "../models/Artist.js"
import Customer from "../models/Customer.js"
import Admin from "../models/Admin.js"

/**
 * Middleware di autenticazione JWT.
 * - Verifica la presenza e validità del token
 * - Carica il documento utente corretto dal DB
 * - Espone req.user (documento utente completo) e req.userType ("Artist", "Customer", "Admin")
 */
export const JWTAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    //  Verifica presenza header e formato "Bearer ..."
    if (!authHeader?.startsWith("Bearer ")) {
      throw createHttpError(401, "Token mancante o malformato")
    }

    //  Estrae il token dalla stringa
    const token = authHeader.split(" ")[1]

    //  Decodifica il token con la chiave segreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const { _id, role } = decoded

    // Mappa il ruolo al modello corretto (capitalizzando la prima lettera)
    let user
    let model

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

    //  Espone l'utente autenticato
    req.user = user // documento completo
    req.userType = model // usato nei servizi per determinare il modello
    next()
  } catch (error) {
    next(error)
  }
}
