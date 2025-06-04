/**
 * jwtTools.js
 *
 * Questo modulo gestisce:
 * - La generazione di token JWT (`createAccessToken`)
 * - La verifica e decodifica dei token JWT (`verifyAccessToken`)
 *
 * I token vengono firmati con un segreto e hanno una durata di 7 giorni.
 * I token includono informazioni utili per il frontend (es. nome, email, avatar).
 */

import jwt from "jsonwebtoken"

/**
 * Crea un token JWT contenente i dati essenziali dell'utente.
 *
 *  Campi inclusi nel token:
 * - _id: ID MongoDB dell'utente
 * - role: ruolo dell'utente (es. "artist", "customer", "admin")
 * - name: nome visibile
 * - email: email utente
 * - avatar: URL avatar
 * - model: modello Mongoose associato (es. "Artist", "Customer")
 *
 * @param {Object} payload - Dati utente da inserire nel token
 * @returns {Promise<string>} - Token JWT firmato
 */
export const createAccessToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      {
        _id: payload._id,
        role: payload.role,
        name: payload.name,
        email: payload.email,
        avatar: payload.avatar,
        model: payload.model,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) reject(err)
        else resolve(token)
      }
    )
  )

/**
 * Verifica la validità di un token JWT e restituisce il payload decodificato.
 *
 * @param {string} token - Token JWT da verificare
 * @returns {Promise<Object>} - Payload decodificato se valido
 */
export const verifyAccessToken = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) reject(err)
      else resolve(payload)
    })
  )
