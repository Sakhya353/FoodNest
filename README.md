# FoodNest

> **Discover. Order. Enjoy.**

FoodNest is a modern MERN stack food and grocery ordering platform designed for effortless browsing, smart shopping carts, and fast order checkout.

## Features
- **Discover**: Browse categories and food items with live search filtering.
- **Order**: Flexible portions, real-time quantity/size selection, and intuitive shopping cart.
- **Enjoy**: Track previous orders and enjoy seamless doorstep delivery.

## Tech Stack
- **Frontend**: React 18, React Router v6, Context API, Bootstrap 5
- **Backend**: Node.js, Express, MongoDB Atlas, Mongoose
- **Authentication**: JWT, bcryptjs

## Mobile App

A separate React Native (Expo) mobile client lives in [`mobile/FoodNest/`](./mobile/FoodNest/README.md).
It's a new, independently built app that reuses this repository's existing `server/`
backend and database as-is — `client/` and `server/` are unchanged. See that folder's
README for architecture, setup instructions, known backend limitations, and a security
note about credentials found in `server/db.js` that should be rotated.

## Author

**Sakhya Sharma** · GitHub: [@Sakhya353](https://github.com/Sakhya353)

## Deployment

The backend is designed for Render and reads MongoDB/JWT configuration from environment variables. Never commit `.env` files or database credentials.
