import createHttpError from "http-errors"
import { verifyAccessToken } from "../tools/jwtTools.js"

export const JWTAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(createHttpError(401, "Token mancante"))
  }

  const token = req.headers.authorization.replace("Bearer ", "")

  try {
    const payload = await verifyAccessToken(token)
    req.user = {
      _id: payload._id,
      role: payload.role || "visitor",
    }
    next()
  } catch (error) {
    next(createHttpError(401, "Token non valido o scaduto"))
  }
}
