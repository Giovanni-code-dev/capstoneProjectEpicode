import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import morgan from "morgan"
import dotenv from "dotenv"
import createHttpError from "http-errors"
import passport from "passport"

// ✅ Carica le variabili prima di tutto
dotenv.config()

// ✅ Crea l'app dopo dotenv
const app = express()

// ✅ Inizializza passport DOPO express
app.use(passport.initialize())

// ROUTES
import routes from "./routes/index.js"

// MIDDLEWARE GLOBALI
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

// ROTTE
app.use("/", routes)

// ROTTA DI TEST
app.get("/", (req, res) => {
  res.send("Server attivo! 🎭")
})

// 404
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint non trovato"))
})

// GESTIONE ERRORI
app.use((err, req, res, next) => {
  console.log("ERRORE:", err)
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Errore generico",
  })
})

// MONGO + AVVIO
const PORT = process.env.PORT || 3001
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connesso a MongoDB")
    app.listen(PORT, () => {
      console.log(`🚀 Server in ascolto su http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error("❌ Errore di connessione a MongoDB:", err)
  })

// ✅ Debug: stampa client ID
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID)
