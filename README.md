# overwatch

> One place to collate everything you play, watch and read.

overwatch is a personal hobby logger. The v1 goal is simple: let a user browse **games, films/TV and books**, then save the ones they care about into their own library and track them over time.

This repository is named `overwatch`; the product is **overwatch**.

- **Backend:** Node.js + Express + MongoDB (`/server`), deployed on Render
- **Frontend:** React + Vite (`/client`, scaffolding in progress)
- **Live API:** https://overwatch-m4jq.onrender.com

---

## Table of contents

1. [Where the project stands](#where-the-project-stands)
2. [V1 scope](#v1-scope)
3. [Architecture overview](#architecture-overview)
4. [Backend](#backend)
5. [Frontend](#frontend)
6. [Getting started](#getting-started)
7. [Design decisions](#design-decisions)
8. [Known issues and cleanup before v1](#known-issues-and-cleanup-before-v1)
9. [Testing](#testing)
10. [Roadmap](#roadmap)

---

## Where the project stands

The backend is largely feature-complete for the **browse and discover** half of v1: all three media sources are integrated, normalized and exposed through public routes, and authentication is in place. The remaining work is mostly on the **library** half (saving items per user) and the **frontend**, which is still being scaffolded.

| Area | Status |
| --- | --- |
| Mongoose schemas (users, items) | Done |
| JWT authentication (register, login) | Done |
| Current-user endpoint (`GET /auth/me`) | Built, being wired into the frontend |
| Items CRUD controllers (library) | Done, being revisited as the per-user model firms up |
| Films and TV (TMDB): discover + search | Done |
| Games (RAWG): discover, by genre, search, detail | Done |
| Books (Open Library): discover, search, detail | Done, with ratings and author names to follow on the detail view |
| Public (unauthenticated) browsing | Done |
| Deployment (Render) | Done |
| Frontend | Scaffolding and local work |
| Library UI (add, view, edit, remove items) | Not started |
| Playlists | Planned after v1 |
| Automated tests | Not started |

---

## V1 scope

**In scope**

- Browse a discover feed for each of games, films/TV and books, without logging in
- Search each category by name
- View the details of a single game, film or book
- Register, log in, and stay logged in across refreshes
- Save a title to your own library and manage it (status, rating, notes)
- View your library

**Out of scope for v1**

- Playlists (designed for, not built; see [Roadmap](#roadmap))
- Social features, sharing, recommendations
- Importing from other services

---

## Architecture overview

```
 React + Vite client
        |
        |  axios (Bearer token on protected calls)
        v
 Express API  ──────────────►  MongoDB (users, library items)
        |
        |  server-side fetch + normalization
        v
 TMDB (films/TV)   RAWG (games)   Open Library (books)
```

The key idea is that the **client never talks to the external APIs**. Every source is fetched and **normalized on the server** into one consistent shape, so the frontend renders a film, a game or a book through the same kind of components, and a change in an upstream API is absorbed in one place.

---

## Backend

### Stack

| Concern | Choice |
| --- | --- |
| Runtime | Node.js (ES modules, `"type": "module"`) |
| Framework | Express 5 |
| Database | MongoDB via Mongoose 9 |
| Auth | `jsonwebtoken` (JWT) and `bcrypt` (password hashing) |
| HTTP | native `fetch` and `axios` |
| Config | `dotenv` |
| Dev server | `nodemon` |
| Package manager | pnpm |

### Folder layout (`/server`)

```
server/
├── server.js
├── package.json
└── src/
    ├── controllers/     # films, books, games, items, auth
    ├── routes/
    ├── middleware/      # JWT verification
    ├── models/          # Mongoose schemas
    └── utils/           # normalizers, DISCOVER_SUBJECTS, helpers
```

### Environment variables

Create `server/.env` (never commit it):

| Variable | Purpose |
| --- | --- |
| `PORT` | Port the API listens on |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign tokens |
| `TMDB_KEY` | TMDB API key |
| `RAWG_KEY` | RAWG API key |



### Authentication

- `POST /auth/reg` registers a user. The response is a success message.
- `POST /auth/login` returns `{ user, token }`. The user object contains `id`, `email`, `userName` and `createdAt`.
- `GET /auth/me` returns the current user, looked up from the token. It exists so the frontend can restore a session after a refresh. It returns only safe fields (never the password hash) and responds `401` when the token is missing or invalid.
- Protected routes expect `Authorization: Bearer <token>`. The middleware verifies the token and attaches the user to `req.user`.
- **Browsing routes are public.** Discover and search endpoints sit outside the auth middleware on purpose, so people can use the app before creating an account.

### API reference

Base URL: `https://overwatch-m4jq.onrender.com`

**Auth**

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/reg` | No | Register |
| POST | `/auth/login` | No | Log in, returns user and token |
| GET | `/auth/me` | Yes | Current user |

**Films and TV (TMDB)**

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/items/films` | No | Discover films and shows |
| GET | `/items/films/search?q=&page=` | No | Search movies and TV together |

`searchFilms` queries the movie and TV endpoints in parallel with `Promise.allSettled`, so one failing half doesn't discard the other. Results are normalized and returned as `{ page, films: [...] }`.

**Books (Open Library)**

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/items/books` | No | Discover books, grouped by genre |
| GET | `/items/books/find` | No | Free-text book search |
| GET | `/items/books/book/:id` | No | Single book detail |

Discover returns one shelf per genre in `DISCOVER_SUBJECTS`:

```json
{
  "results": [
    { "genre": "fantasy", "books": [ { "externalId": "/works/OL...W", "title": "..." } ] }
  ]
}
```

**Games (RAWG)**

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/items/games` | No | Default discover feed |
| GET | `/items/games/find-genre` | No | Discover by genre |
| GET | `/items/games/find?search=` | No | Search games |
| GET | `/items/games/:slug` | No | Single game by slug or id |

> **Route order matters.** Express matches top to bottom and stops at the first match. Literal paths (`/games/find`) must be registered before dynamic ones (`/games/:slug`), or the dynamic route swallows them.

**Library items (per user)**

CRUD controllers exist for saving and managing a user's items. Paths will be documented here once the library routes settle.

### Data normalization

Each source returns a different shape, so each has its own normalizer (`normalizeMovie`, `normalizeShow`, `normalizeBook`, `normalizeGame`). They share a common core so the client can treat them uniformly:

```js
{
  externalId,   // identity at the source API
  category,     // "film" | "show" | "book" | "game"
  title,
  images,
  externalUrl,
  // ...category-specific fields
}
```

A normalized book currently looks like this:

```js
{
  externalId: "/works/OL16813053W",
  category: "book",
  title: "Words of Radiance",
  authors: ["Brandon Sanderson"],
  publishDate: "2012",
  genre: ["Fantasy fiction", "..."],
  images: { thumbnail: "https://covers.openlibrary.org/b/id/14658334-M.jpg" },
  externalUrl: "https://openlibrary.org/works/OL16813053W",
  bookDesc: "",
  pageCount: null,
  metadata: { averageRating: null, ratingsCount: null }
}
```

Fields an endpoint doesn't provide are filled with empty defaults, so the shape stays predictable. Descriptions, ratings and author details are filled in on the detail view.

### Data model

**User**

- `email`, `userName`, `passwordHash`, `createdAt`

**Item** (a user's library entry)

- `user`: reference to the owner
- `externalId` and `category`: the source identity
- A snapshot of the normalized data (title, cover, authors, and so on) saved at the time the item is added, so library pages render without hitting the upstream APIs
- User-specific fields (status, rating, notes)
- A compound unique index on `{ user, externalId }` prevents logging the same title twice

---

## Frontend

The frontend lives in `/client` and is in **scaffolding and local work**. It isn't ready to run as a product yet.

Chosen stack:

- **React + Vite** (TypeScript)
- **MUI** for theming and UI design
- **axios** and **TanStack Query** for data fetching
- **React's built-in hooks and Context** for state, including a `UserProvider` and `useUser` hook for auth
- **react-router-dom** for routing

Configuration: set `VITE_API_BASE_URL` in `client/.env` to the API base URL.

---

## Getting started

### Prerequisites

- A current LTS release of Node.js
- pnpm
- A MongoDB database (local or Atlas)
- TMDB and RAWG API keys

### Run the backend

```bash
cd server
pnpm install
# create .env as described above
pnpm dev
```

`pnpm dev` runs `nodemon server.js`, restarting on file changes.

### Run the frontend

```bash
cd client
pnpm install
# create .env with VITE_API_BASE_URL
pnpm dev
```

### Deployment

The API is deployed on Render. Set the same environment variables there. If the service is on Render's free tier, the first request after a period of inactivity can be slow while it wakes up, so the frontend should treat a slow or failed first call as a retry case, not as a logout.

---

## Design decisions

A short log of choices that shaped the codebase, and why.

- **Normalize on the server.** One shape for every media type keeps the client simple and isolates it from upstream changes.
- **Public browsing, protected library.** Discovery routes sit outside the auth middleware so the app is useful before sign-up.
- **Books moved entirely to Open Library.** Google Books has no popularity signal, and its `subject:` filter turned out to be unreliable for genre browsing. Open Library has a dedicated subjects endpoint that filters properly and needs no key.
- **Ratings are not fetched on list views.** Open Library serves ratings from a separate endpoint per work. Fetching them for every card meant 50+ concurrent requests per discover load and caused connect timeouts. Lists now return only the works, and ratings load on the detail view.
- **Partial failure over total failure.** Fan-out calls use `Promise.allSettled`, so one failed source or genre doesn't empty the whole response.
- **Items are per-user entries.** Every library item has its own `_id` and an owner. Playlists will hold references to item ids, so adding them later requires no change to the items collection.
- **Token in the response body.** The JWT is returned from login and sent as a Bearer header via an axios interceptor. It is stored in `localStorage`, which is a pragmatic choice for a hobby project with a known XSS tradeoff.

---

## Known issues and cleanup before v1

Housekeeping to tidy before calling v1 done:

- [ ] Standardize error responses (`error` vs `message` keys currently vary between controllers)
- [ ] Audit status codes in catch blocks (server failures should not return `200` or `401`)
- [ ] Standardize `userName` spelling between login and `/auth/me`
- [ ] Confirm CORS allows the frontend origin and the `Authorization` header
- [ ] Add the `{ user, externalId }` unique index on items
- [ ] Add a minimum-length guard on search queries to avoid wasted upstream calls
- [ ] Validate and clamp pagination parameters (non-numeric `page` values)
- [ ] Decide whether upstream failures in search should surface a `warnings` field
- [ ] Remove any leftover Google Books code and keys
- [ ] Resolve book author names and descriptions on the detail endpoint

---

## Testing

There is no automated test suite yet (`pnpm test` is a placeholder). Planned first targets are the controllers, mocking the fetch helpers so the real APIs aren't hit:

- Happy paths (valid query returns normalized results)
- Missing or invalid query parameters (`400`)
- Pagination edge cases (default, zero, negative, non-numeric)
- Upstream failure handling (`500`, and partial results where `allSettled` is used)
- Empty results (`200` with an empty list, not an error)

---

## Roadmap

**To finish v1**

1. Finalize the library routes and item schema
2. Complete the frontend auth flow (`UserProvider`, session restore, protected routes)
3. Build discover, search and detail pages for each category
4. Build the library UI (add, view, edit, remove)
5. Work through the cleanup checklist above

**After v1**

- **Playlists:** a separate collection with an owner and an ordered array of item references. Deleting an item will also need to remove it from any playlist that holds it.
- Automated test coverage
- Accessibility and responsive polish
- Start logical reasoning for concurrent user instances/social-media-ry feature for the app.
