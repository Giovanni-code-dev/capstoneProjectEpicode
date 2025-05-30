import { Schema, model } from "mongoose"

const RequestSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  artist: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
  packages: [{ type: Schema.Types.ObjectId, ref: "Package" }],
  shows: [{ type: Schema.Types.ObjectId, ref: "Show" }],
  location: { address: String, city: String },
  distanceKm: { type: Number },
  date: { type: Date, required: true },
  message: { type: String },
  status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" }
}, { timestamps: true })



// Indici utili

// Customer: recupera le proprie richieste
RequestSchema.index({ customer: 1 })

// Artista: recupera richieste ricevute per status
RequestSchema.index({ artist: 1, status: 1 })

// Per verifica disponibilità di data
RequestSchema.index({ artist: 1, date: 1, status: 1 })

export default model("Request", RequestSchema)
