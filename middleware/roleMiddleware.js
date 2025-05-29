import createHttpError from "http-errors"

export const artistOnly = (req, res, next) => {
  if (req.userType !== "Artist") {
    return next(createHttpError(403, "Accesso riservato agli artisti"))
  }
  next()
}

export const customerOnly = (req, res, next) => {
  if (req.userType !== "Customer") {
    return next(createHttpError(403, "Accesso riservato ai clienti"))
  }
  next()
}

export const adminOnly = (req, res, next) => {
  if (req.userType !== "Admin") {
    return next(createHttpError(403, "Accesso riservato agli admin"))
  }
  next()
}
