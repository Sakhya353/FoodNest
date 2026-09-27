# FoodNest — Discover. Order. Enjoy.

A React Native (Expo) mobile client for the existing **Crust-main** MERN food-ordering
project. This app is a genuine mobile redesign and re-implementation of the UI/UX layer,
built on top of the FoodNest `server/` backend and its MongoDB data.

## Project Overview

FoodNest lets a user browse a food/grocery catalog by category, search and filter it,
build a cart, check out, and review their past orders — all from a native Android/iOS
app instead of the existing React website.

## Problem Statement

The original Crust-main project only ships a web client (`client/`). There was no mobile
experience, and the web client's UI, state management, and code organization (a single
global cart reducer, fetch calls scattered across screen components, hard-coded API URLs)
don't hold up well as a foundation for a second, native surface.

## Solution

A separate Expo app in `mobile/FoodNest/` that talks to the **same backend and database**
through the same three existing REST routes, but with:
- a dedicated design system instead of Bootstrap classes,
- a centralized API/service layer instead of inline `fetch` calls,
- React Context for auth/cart/catalog state instead of a single reducer with no
  persistence,
- form validation, loading states, and error handling on every screen,
- an environment-based API configuration instead of a hard-coded URL.

## Key Features

Splash → Login/Signup → Home → Categories → Food Listing → Search & Filters → Food
Details → Cart → Checkout → Order Confirmation → My Orders → Order Details → Profile →
Logout.

## Technology Stack

**Mobile:** React Native, Expo (SDK 51), React Navigation (native-stack + bottom-tabs),
React Context, AsyncStorage.

**Backend (shared FoodNest backend):** Node.js, Express, Mongoose.

**Database (shared FoodNest backend):** MongoDB Atlas.

## Architecture

```
FoodNest mobile app (Expo)
        │  REST calls (POST, JSON)
        ▼
Existing Node/Express server (server/)
        │  Mongoose
        ▼
Existing MongoDB Atlas cluster
```

The mobile app is part of the FoodNest project and shares the same backend API as the web client.

## Project Structure

```
mobile/FoodNest/
├── assets/            (placeholder — add real app icon/splash image here, see below)
├── components/        Reusable UI: FoodCard, FormInput, PrimaryButton, chips, states
├── screens/
│   ├── auth/           Login, Signup
│   ├── home/           Home dashboard
│   ├── food/           Food list, Food details, Search
│   ├── cart/           Cart
│   ├── checkout/       Checkout, Order confirmation
│   ├── orders/         My Orders, Order details
│   └── profile/        Profile
├── navigation/         One stack per tab + the root navigator
├── services/           apiClient, authService, foodService, orderService
├── context/            AuthContext, CartContext, FoodDataContext
├── hooks/              useDebounce
├── utils/              validators.js, food.js (price parsing helper)
├── config/             api.js — the ONLY place the backend base URL is defined
├── constants/          theme.js — the design system (colors, spacing, type)
├── __tests__/          Jest unit tests
├── App.js
├── app.json
├── package.json
└── .env.example
```

## Authentication

Uses the existing `POST /api/createuser` and `POST /api/loginuser` routes exactly as
they are. On login, the backend returns a JWT (`authToken`); it is stored in
`AsyncStorage` alongside the user's email. **The backend does not implement any route
that verifies this token or returns a user profile** — no middleware reads it, and there
is no `GET /api/user` style endpoint. Route protection in this app is therefore
client-side only (unauthenticated users are routed to the Auth stack; there is no
server-side enforcement to defeat, because the server doesn't have any to begin with).

## API Integration

All backend calls go through `services/apiClient.js`, which centralizes the fetch call,
a request timeout, and error normalization. Three domain services sit on top of it and
map 1:1 to the three existing route files:

| Service | Backend route | File |
|---|---|---|
| `authService.signup` | `POST /api/createuser` | `server/Routes/CreateUser.js` |
| `authService.login` | `POST /api/loginuser` | `server/Routes/CreateUser.js` |
| `foodService.fetchFoodData` | `POST /api/foodData` | `server/Routes/DisplayData.js` |
| `orderService.placeOrder` | `POST /api/orderData` | `server/Routes/OrderData.js` |
| `orderService.fetchMyOrders` | `POST /api/myOrderData` | `server/Routes/OrderData.js` |

No new backend endpoints were invented. Category, price-range, and text search/filtering
happen client-side against the single `foodData` payload, matching how the existing
website already does it (the backend has no dedicated search/filter endpoint).

## State Management

Three small, focused React Contexts instead of one global reducer:
- **AuthContext** — session token, user email/name, persisted in AsyncStorage.
- **CartContext** — cart line items, quantities, totals (in-memory only, matching the
  existing website's cart, which also doesn't persist across sessions).
- **FoodDataContext** — the food/category catalog, fetched once and shared by Home,
  Search, and category listing screens instead of being re-fetched per screen.

## Cart Architecture

Each line is keyed by `(food id, size)`. Adding the same item/size again increases its
quantity instead of creating a duplicate row; quantities are clamped to a minimum of 1.
Note: this fixes a small bug in the original web reducer, where updating an existing
line added the new price on top of the old one instead of recalculating it.

## Order Flow

`Checkout → orderService.placeOrder → POST /api/orderData → clear cart → Order
Confirmation`. `My Orders` calls `POST /api/myOrderData` and reads back
`orderData.order_data`.

## Known Backend Limitations

These are limitations of the **existing, unmodified** backend, not gaps in the mobile
app. Per the project's own ground rules, they are documented here rather than papered
over with invented data:

- **No per-order ID or status.** `server/models/Orders.js` stores exactly *one* document
  per user email; each checkout appends an entry to that single document's `order_data`
  array. There is no per-order `_id` and no `status` field anywhere in the schema, so the
  UI uses the order's date as its identity and does not display a fabricated order ID or
  a fabricated status (e.g. "Delivered", "Preparing").
- **No user-profile endpoint.** Login only returns a JWT built from the user's Mongo
  `_id` — there's no route that returns the user's stored name back to the client. The
  Profile screen shows the name captured locally at signup time (this session only); a
  user who logs in on a new device/after clearing storage will see their email only,
  until the backend adds a `GET /api/user` style route.
- **No token verification middleware.** The `authToken` is stored but nothing on the
  server currently checks it on protected-seeming routes.
- **Checkout's "Customer Information" / "Delivery Address" fields are UI-only.** The
  `orderData` route only accepts `{ order_data, email, order_date }` — name, phone, and
  address are not persisted by the backend today. They're collected in the app for a
  complete checkout experience and shown back on the confirmation flow, but only the
  cart items, email, and date are actually sent to and stored by the server.
- **No price/rating/discount fields in the data model.** `food_items` documents don't
  have `price`; the app derives price the same way the existing website does — by
  parsing the leading number out of each size option's string value (e.g.
  `"220 ml"` → `220`). There's no `rating` or `discount` field, so those are simply not
  shown, per the "don't invent data" rule.

## Installation

```bash
# from the repository root
cd server && npm install
cd ../client && npm install
cd ../mobile/FoodNest && npm install
```

## Environment Variables

Copy `.env.example` to `.env` inside `mobile/FoodNest/` and set `EXPO_PUBLIC_API_URL`.
**Do not** put database credentials, JWT secrets, or any server-side secret in this
file or anywhere under `mobile/` — see Security Considerations below.

## Running the Backend

```bash
cd server
npm install
node index.js
# or: npx nodemon index.js
```

Server listens on `process.env.PORT || 5000`.

## Running the Mobile App

```bash
cd mobile/FoodNest
npm install
npx expo start
```

Then press `a` for Android, `i` for iOS (macOS only), or scan the QR code with Expo Go.

## Android Device Setup

1. Install **Expo Go** from the Play Store on your phone.
2. Make sure your phone and computer are on the **same Wi-Fi network**.
3. Find your computer's LAN IP (`ipconfig` on Windows, `ifconfig`/`ip a` on
   macOS/Linux).
4. In `mobile/FoodNest/.env`, set `EXPO_PUBLIC_API_URL=http://<your-lan-ip>:5000/api`.
   Remember: `localhost` on the phone means the phone itself, not your computer.
5. `npx expo start`, then scan the QR code with the Expo Go app.

For the **Android emulator** instead of a physical device, use
`http://10.0.2.2:5000/api` — the emulator's alias for the host machine's `localhost`.

## Testing

```bash
cd mobile/FoodNest
npm test
```

Covers: price parsing, form validators (mirroring the backend's actual
`express-validator` rules), cart reducer behaviour (add/merge/clamp/remove/clear,
totals), and category/search filtering. Manual test pass performed against a local
backend: signup, login, invalid-credential handling, logout, category browsing, search
with no results, add/update/remove cart lines, checkout validation, order placement,
order history, navigation guards on protected tabs, and offline/API-down error banners.

## Error Handling

All API errors flow through `apiClient.js`, which classifies them (timeout / network /
4xx / 5xx) and attaches a `friendlyMessage`. Screens display that message in an
`ErrorBanner` with a retry action; no raw stack traces or backend error objects are ever
rendered to the user.

## Security Considerations

- No secrets are stored in `mobile/`. The only mobile-side configuration is the public
  API base URL (`EXPO_PUBLIC_API_URL`), which is not sensitive.
- ⚠️ **Action required, unrelated to this mobile app:** while inspecting the existing
  backend to build this app, `server/db.js` was found to contain a **live MongoDB
  connection string with a plaintext username and password**, and
  `server/Routes/CreateUser.js` contains a **hard-coded JWT signing secret**. Both are
  committed to source and should be treated as compromised: rotate the MongoDB Atlas
  database user's password and generate a new JWT secret (loaded from an environment
  variable, not a source file) as soon as possible, especially if this repository is or
  will be public.

## Future Improvements

- A backend endpoint for fetching the current user's profile.
- Per-order IDs and a real order-status field.
- Server-side search/filtering and pagination once the catalog grows.
- Moving the Mongo URI and JWT secret out of source into environment variables.

## Author

**Sakhya Sharma** · GitHub: [@Sakhya353](https://github.com/Sakhya353)
