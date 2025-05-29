/**
 * jwtTools.js
 *
 * Questo file gestisce la creazione e la verifica dei token JWT.
 * I token JWT sono usati per identificare un utente dopo il login.
 * 
 * - createAccessToken(payload): genera un token firmato contenente i dati dell'utente (_id, role, ecc.)
 *   Il token è valido per una settimana.
 * 
 * - verifyAccessToken(token): verifica che il token sia valido, non scaduto, e non modificato.
 *   Se valido, restituisce il payload originale (_id, role, ecc.).
 * 
 * Usato per autenticazione e autorizzazione nel backend.
 */


/*
import jwt from "jsonwebtoken"

/**
 * Crea un token JWT firmato con il segreto
 * Contiene l'id utente e il ruolo, e dura 1 settimana
 
export const createAccessToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1w" },
      (err, token) => {
        if (err) reject(err)
        else resolve(token)
      }
    )
  )

/**
 * Verifica la validità di un token JWT e restituisce il payload
 
export const verifyAccessToken = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) reject(err)
      else resolve(payload)
    })
  )

  */

  import jwt from "jsonwebtoken"

// Genera un token con _id e tipo di modello (Artist, Viewer, Admin)
export const createAccessToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) reject(err)
        else resolve(token)
      }
    )
  )

// Verifica validità e decodifica il token
export const verifyAccessToken = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) reject(err)
      else resolve(payload)
    })
  )
