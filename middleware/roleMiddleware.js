import createHttpError from "http-errors"

export const adminOnly = (req, res, next) => {
  if (req.user.role === "admin") {
    next()
  } else {
    next(createHttpError(403, "Accesso riservato agli admin."))
  }
}

export const artistOnly = (req, res, next) => {
  if (req.user.role === "artist") {
    next()
  } else {
    next(createHttpError(403, "Accesso riservato agli artisti."))
  }
}
