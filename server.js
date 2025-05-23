import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import morgan from "morgan"
import dotenv from "dotenv"
import createHttpError from "http-errors"

// ROUTES
import routes from "./routes/index.js"

// CONFIG
dotenv.config()
const app = express()

// MIDDLEWARE GLOBALI
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

// ROTTE
app.use("/", routes) // es: POST /auth/register

// ROTTA DI TEST
app.get("/", (req, res) => {
  res.send("Server attivo! 🎭")
})

// 404 - not found
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

// CONNESSIONE A MONGO E AVVIO SERVER
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
