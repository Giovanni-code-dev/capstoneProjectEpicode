
# 📘 Floating Dreams – API Backend

Benvenuto nella documentazione delle API per il backend del progetto **Floating Dreams**.
Questa web app gestisce artisti, spettacoli, richieste e recensioni.

---

## 🔐 Autenticazione

### Customer
- `POST /customer/register` – Registrazione nuovo cliente
- `POST /customer/login` – Login cliente

### Artist
- `POST /artist/register` – Registrazione artista
- `POST /artist/login` – Login artista

### Admin
- `POST /admin/register` – Registrazione admin
- `POST /admin/login` – Login admin

### Google OAuth
- `GET /auth/google` – Avvia login con Google
- `GET /auth/google/callback` – Callback Google OAuth

---

## 👤 Admin

- `GET /admin/dashboard` – Statistiche generali (via service)
- `GET /admin/profile` – Dati profilo admin
- `PATCH /admin/update-profile` – Aggiorna profilo admin (upload avatar)
- `GET /admin/users` – Elenco di tutti gli utenti (tutti i modelli)
- `GET /admin/requests` – Elenco richieste con filtro status

---

## 🧑‍🎤 Artist

- `GET /artist/profile` – Visualizza profilo
- `PATCH /artist/update-profile` – Aggiorna profilo artista
- `GET /artist/requests` – Elenco richieste ricevute
- `GET /artist/public` – Ricerca pubblica artisti per città/categoria

---

## 📦 Package

- `GET /packages` – Pacchetti personali dell’artista
- `GET /packages/artist/:artistId` – Pacchetti pubblici di un artista
- `POST /packages` – Crea pacchetto (upload immagini)
- `PUT /packages/:id` – Modifica pacchetto
- `PATCH /packages/:id/images` – Aggiungi immagini
- `DELETE /packages/:id/images/:index` – Rimuovi immagine specifica
- `DELETE /packages/:id` – Elimina pacchetto

---

## 🎭 Show

- `GET /shows` – Spettacoli personali dell’artista
- `GET /shows/artist/:artistId` – Spettacoli pubblici di un artista
- `POST /shows` – Crea spettacolo (upload immagini)
- `PUT /shows/:id` – Modifica spettacolo
- `PATCH /shows/:id/images` – Aggiungi immagini
- `DELETE /shows/:id/images/:index` – Rimuovi immagine
- `DELETE /shows/:id` – Elimina spettacolo

---

## 🗓️ Calendar

- `GET /calendar` – Visualizza date disponibili
- `POST /calendar` – Aggiungi data disponibile
- `PUT /calendar/:id` – Modifica disponibilità
- `DELETE /calendar/:id` – Elimina disponibilità

---

## 📝 Review

- `GET /reviews/artist/:artistId` – Recensioni per un artista
- `POST /reviews` – Crea recensione
- `PUT /reviews/:id` – Modifica recensione
- `PATCH /reviews/:id/images` – Aggiungi immagini
- `DELETE /reviews/:id/images/:index` – Rimuovi immagine
- `DELETE /reviews/:id` – Elimina recensione

---

## ❤️ Like

- `POST /likes` – Metti like a artista/spettacolo/pacchetto
- `GET /likes/:targetId` – Visualizza like
- `DELETE /likes/:targetId` – Rimuovi like

---

## 📬 Requests

- `GET /requests` – (Artista) Richieste ricevute
- `GET /requests/customer` – (Customer) Richieste inviate
- `POST /requests` – Crea nuova richiesta
- `PUT /requests/:id` – Modifica richiesta (es. stato)
- `DELETE /requests/:id` – Cancella richiesta

---

## 📊 Stats (Admin)

- `GET /stats/overview` – Panoramica generale sistema

---

## ⚙️ Autenticazione

Tutte le rotte protette richiedono header:

```
Authorization: Bearer <token>
```

---

## 🧪 Testing

Puoi testare tutte le rotte con Postman. Ti consigliamo di creare una collection con:
- Variabili di ambiente (baseUrl, token artist, customer, admin)
- Body JSON per i test (register, login, richieste ecc.)

---

## ✨ Progetto realizzato per il Capstone finale – Epicode Web Dev.
