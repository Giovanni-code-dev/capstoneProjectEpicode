// ===============================================================
// COMANDO PER ESEGUIRE QUESTO SCRIPT:
// node scripts/createAdmin.js
// ===============================================================

// Importa mongoose per connetterti al DB MongoDB
import mongoose from "mongoose"

// Importa dotenv per poter leggere variabili da file .env (come MONGO_URI)
import dotenv from "dotenv"

// Importa il modello Admin appena definito nel progetto
import Admin from "../models/Admin.js"

// Carica tutte le variabili da .env (es. MONGO_URI, JWT_SECRET, ecc.)
dotenv.config()

// Avvia la connessione al database usando la URI definita in .env
mongoose.connect(process.env.MONGO_URI)

// Funzione principale per creare un nuovo admin
const createAdmin = async () => {
  try {
    // Crea un nuovo documento Admin con i dati desiderati
    const admin = new Admin({
      email: "admin@example.com",     //  Cambia con la mail reale
      password: "adminpass",          //  Cambia con la password reale
      name: "Super Admin"             //  Cambia con il nome reale
    })

    // Salva l'admin nel database
    await admin.save()

    // Log di conferma se tutto è andato a buon fine
    console.log(" Admin creato con successo")
  } catch (err) {
    // Se qualcosa va storto, stampa il messaggio di errore
    console.error(" Errore nella creazione dell'admin:", err.message)
  } finally {
    // Chiudi la connessione al database, anche in caso di errore
    mongoose.connection.close()
  }
}

//Esegui la funzione
createAdmin()
