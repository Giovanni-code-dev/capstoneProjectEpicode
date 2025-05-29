import axios from "axios"

export const getCoordinatesFromAddress = async (city, address) => {
  const fullAddress = `${address}, ${city}`
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  console.log("📍 Cercando coordinate per:", fullAddress)

  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: fullAddress,
        key: apiKey
      },
      timeout: 5000 // ⏱️ protezione da lentezze o blocchi
    })

    const data = response.data
    console.log("📡 Risposta API:", data)

    if (data.status === "ZERO_RESULTS") {
      throw new Error("Indirizzo non trovato. Verifica città e via.")
    }

    if (data.status !== "OK" || !data.results?.length) {
      throw new Error("Errore durante la geolocalizzazione.")
    }

    const { lat, lng } = data.results[0].geometry.location
    return { lat, lng }

  } catch (err) {
    console.error("❌ Errore geocoding:", err.message)
    throw new Error("Impossibile ottenere le coordinate. Riprova più tardi.")
  }
}
