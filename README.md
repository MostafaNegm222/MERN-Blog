# MERN Blog

A full-stack blog application built with the MERN stack.

## Tech Stack

- **Frontend (`client/`):** React, Material UI (MUI), Redux Toolkit
- **Backend (`server/`):** Node.js, Express, MongoDB with Mongoose
- **Auth:** JWT with bcrypt password hashing
- **Uploads:** Multer with GridFS image storage in MongoDB
- **Security:** Helmet

## Project Structure

```
├── client/   # React app (MUI + Redux Toolkit)
└── server/   # Express REST API
```

## Getting Started

```bash
# Backend
cd server && npm install && npm start

# Frontend (new terminal)
cd client && npm install && npm start
```

The backend needs a `.env` with the MongoDB connection string and JWT secret.
