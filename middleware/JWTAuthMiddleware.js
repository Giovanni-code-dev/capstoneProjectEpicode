import jwt from "jsonwebtoken"
import createHttpError from "http-errors"

import Artist from "../models/Artist.js"
import Customer from "../models/Customer.js"
import Admin from "../models/Admin.js"

export const JWTAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith("Bearer ")) {
      throw createHttpError(401, "Token mancante o malformato")
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const { _id, model } = decoded

    let user
    switch (model) {
      case "Artist":
        user = await Artist.findById(_id)
        break
      case "Customer":
        user = await Customer.findById(_id)
        break
      case "Admin":
        user = await Admin.findById(_id)
        break
      default:
        throw createHttpError(401, "Modello utente sconosciuto")
    }

    if (!user) throw createHttpError(404, "Utente non trovato")

    req.user = user
    req.userType = model // utile se vuoi distinguere anche dopo
    next()
  } catch (error) {
    next(error)
  }
}
