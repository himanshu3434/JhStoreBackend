# JHStore Backend

## Project Overview

it is a ecommerce Website build using Typescript ,React ,Mongodb ,Express . it has features like Cart,Payment With Stripe, Admin Panel and many more .

# JHStore

## Introduction

Welcome to **JHStore**, an e-commerce website . With advanced features like cart management, admin panel, and secure transactions, JHStore is your one-stop shop for all your shopping needs.

![JHStore Logo](https://github.com/user-attachments/assets/5fdb8853-b1f4-48a5-aee5-0186903bf441)


## Links

- [Frontend Hosted](https://jh-store-client.vercel.app/)
- [Backend Hosted](https://jhstorebackend.onrender.com/api/v1/test)
- [Frontend GitHub Repository](https://github.com/himanshu3434/JhStoreFrontend)
- [Backend GitHub Repository](https://github.com/himanshu3434/JhStoreBackend)

## Content Page

1. [Introduction](#introduction)
2. [Links](#links)
3. [Content Page](#content-page)
4. [Technology Used](#technology-used)
5. [Features](#features)
6. [Setup](#setup)
7. [Database Schema](#database-schema)
8. [Thank You](#thank-you)

### Technology Used

- React
- TypeScript
- Express
- React Router DOM
- Redux Toolkit
- Stripe
- MongoDB Aggregation Pipeline
- MongoDB

## Features

- **Persistent Cart:** Cart data is stored in the backend, accessible from any device upon login.
- **Admin Panel:** Manage users, orders, inventory, and update or add products and categories.
- **Scalable Tables:** Database tables are designed for scalability.
- **Filter System:** Implemented using Redux Toolkit for efficient product filtering.
- **Secure Sessions:** Uses refresh and access tokens for session management, enhancing user experience by preventing repetitive logins.
- **Encrypted Passwords:** User passwords are encrypted with bcrypt for added security.
- **Form Validation:** React Hook Form is used for collecting and validating user data.
- **Cloudinary Integration:** Images are stored and managed in Cloudinary via Multer.
- **JWT Authentication:** Implemented with JSON Web Tokens for refresh and access tokens.

## Setup

1. **Fork the Repository:** 
2. **Clone the Repository:**
   ```bash
   git clone <repository-url>

3. **Environment Variables:** Create a `.env` file in the root folder with the following schema:
   ```
    PORT=""
    MONGO_DB_URI=""
   CORS_ORIGIN=""
   ACCESS_TOKEN_SECRET=""
   ACCESS_TOKEN_EXPIRY=""
   REFRESH_TOKEN_SECRET=""
   REFRESH_TOKEN_EXPIRY=""
   CLOUDINARY_CLOUD_NAME=""
   CLOUDINARY_API_KEY=""
   CLOUDINARY_API_SECRET=""
   PAGE_LIMIT=""
   STRIPE_SECRET_KEY=""


   ```

4. **CORS Configuration:** Update the `CORS_ORIGIN` in the backend's `app.js` file to the frontend URL, e.g., `http://localhost:5173` for local development.

5. **Install Dependencies:**
   ```bash
   npm install
6. In both frontend and backend directories
   ```bash
    npm run dev



   
## Database Schema

![Database Schema](https://github.com/user-attachments/assets/dc6b083c-ab6b-4ccb-9f3b-01bc2cffbae3)


## Thank You

**Happy Coding!**

**HY**


