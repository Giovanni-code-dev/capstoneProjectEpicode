import createHttpError from "http-errors"

export const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") return next()
  return next(createHttpError(403, "Accesso riservato agli admin."))
}

export const artistOnly = (req, res, next) => {
  if (req.user?.role === "artist") return next()
  return next(createHttpError(403, "Accesso riservato agli artisti."))
}

export const viewerOnly = (req, res, next) => {
  if (req.user?.role === "viewer") return next()
  return next(createHttpError(403, "Accesso riservato ai viewer."))
}
