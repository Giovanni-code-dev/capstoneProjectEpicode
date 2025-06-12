# Indici del Database – Capstone

Questa documentazione elenca tutti gli indici definiti nei modelli Mongoose per migliorare le performance e prevenire duplicati.

---

## LikeSchema

models/Like.js`

```js
LikeSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true })
```

- Previene che un utente metta like due volte sullo stesso oggetto.
- Velocizza le query `isLikedByMe`, `getMyLikes`.

---

##  ReviewSchema

`models/Review.js`

```js
ReviewSchema.index({ artist: 1 })
ReviewSchema.index({ user: 1 })
```

- Ottimizza il recupero delle recensioni di un artista (`/reviews/artist/:id`)
- Permette a un viewer di vedere tutte le proprie recensioni (`/reviews/me`)

---

## RequestSchema

`models/Request.js`

```js
RequestSchema.index({ user: 1 })
RequestSchema.index({ artist: 1, status: 1 })
RequestSchema.index({ artist: 1, date: 1, status: 1 })
```

- Recupera richieste inviate da un viewer
- Mostra richieste ricevute da un artista (filtrate per stato)
- Verifica disponibilità di un artista in una determinata data

---

##  ShowSchema

`models/Show.js`

```js
ShowSchema.index({ artist: 1 })
```

- Recupera rapidamente tutti gli spettacoli di un artista

---

##  PackageSchema

 `models/Package.js`

```js
PackageSchema.index({ artist: 1 })
```

- Mostra tutti i pacchetti offerti da un artista in modo performante

---

##  Suggerimenti futuri

- Per collezioni con milioni di documenti, considera anche indici composti su date o filtri usati di frequente.
- Puoi visualizzare gli indici con:  
  `db.nome_collezione.getIndexes()`  
  nel terminale MongoDB.

---

**Ultimo aggiornamento:** ✍️ 2025-05-27
