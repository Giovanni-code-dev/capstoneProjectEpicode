import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import morgan from "morgan"
import dotenv from "dotenv"
import createHttpError from "http-errors"
import passport from "passport"

//  Variabili ambiente (MONGO_URI, PORT, ecc.)
dotenv.config()

//  Crea istanza Express
const app = express()

//  Inizializza Passport (necessario per OAuth)
app.use(passport.initialize())

//  Middleware globali
app.use(cors())                 // Consente richieste da altri domini
app.use(morgan("dev"))         // Log HTTP per debug
app.use(express.json())        // Parse JSON nel body delle richieste

// Import e monta tutte le routes centralizzate
import mainRouter from "./routes/index.js"
app.use("/", mainRouter)       // Tutte le rotte partono da qui

//  Rotta base di test
app.get("/", (req, res) => {
  res.send("Server attivo!")
})

//  404 Not Found per rotte non gestite
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint non trovato"))
})

//  Gestione globale degli errori
app.use((err, req, res, next) => {
  console.log("ERRORE:", err)
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Errore generico",
  })
})

// ⚙️ Avvio MongoDB e server
const PORT = process.env.PORT || 3001

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(" Connesso a MongoDB")
    app.listen(PORT, () => {
      console.log(`Server in ascolto su http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error(" Errore di connessione a MongoDB:", err)
  })

//  Debug per Google OAuth
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID)
