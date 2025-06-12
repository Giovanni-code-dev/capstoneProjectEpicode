import { Schema, model } from "mongoose"

const RequestSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  artist: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
  packages: [{ type: Schema.Types.ObjectId, ref: "Package" }],
  shows: [{ type: Schema.Types.ObjectId, ref: "Show" }],
  location: {
    address: String,
    city: String,
  },
  distanceKm: { type: Number },
  date: { type: Date, required: true },
  message: { type: String },
  // Campi aggiunti
  name: { type: String },   // nome del cliente al momento della richiesta
  email: { type: String },  // email del cliente al momento della richiesta
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
}, { timestamps: true })

// Indici utili
RequestSchema.index({ customer: 1 })                      // Per recupero richieste utente
RequestSchema.index({ artist: 1, status: 1 })             // Per dashboard artista
RequestSchema.index({ artist: 1, date: 1, status: 1 })    // Per verifica disponibilità

export default model("Request", RequestSchema)
