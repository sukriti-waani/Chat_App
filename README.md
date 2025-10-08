# 💬 Chat App

> A real-time chat application built with the **MERN Stack** — **MongoDB, Express.js, React.js, Node.js** — combined with **Socket.io** for instant, bidirectional communication.  
> The project provides a responsive, reliable, and scalable platform for users to exchange messages in real time.

**Live / Backend:** https://chat-app-backend-phi-woad.vercel.app/

---

## 📘 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Functional Workflow](#functional-workflow)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Running Locally](#installation--running-locally)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Socket.io Events](#socketio-events)
- [Deployment](#deployment)
- [Security](#security)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🧩 Overview

This Chat App allows users to communicate in real-time using web sockets.  
It demonstrates a **complete full-stack integration** — from secure backend APIs to a dynamic React frontend with **live message updates**.

The system uses:

- **REST APIs** for authentication and user management.
- **WebSockets (Socket.io)** for live, bidirectional communication.
- **MongoDB** for persistent message storage and retrieval.

It follows a **modular and scalable architecture**, designed for both learning and production deployment.

---

## ✨ Key Features

✅ Real-time private chat between users.  
✅ Authentication using JWT (Login & Registration).  
✅ MongoDB-based message persistence (chat history).  
✅ Online/offline presence indicators.  
✅ Efficient reconnection and message delivery handling.  
✅ Modern responsive frontend (React).  
✅ Scalable architecture (client–server separation).  
✅ Secure data handling with backend validation.  
✅ Extensible to include group chats, media sharing, and notifications.

---

## 🏗️ System Architecture

The Chat App uses a **two-layered MERN architecture**:

### 1️⃣ Frontend (React)

- Developed using **React.js** and **Socket.io-client**.
- Handles:
  - User Interface (UI)
  - Message rendering and chat UI
  - API communication with backend (via Axios)
  - WebSocket connections for live messaging
  - Local state management (messages, users, active chat)

### 2️⃣ Backend (Node.js + Express.js)

- Manages:
  - RESTful API routes for authentication and user data.
  - Real-time message handling using **Socket.io**.
  - Database operations (create, store, fetch messages and users).
  - Secure JWT-based user session handling.

### 3️⃣ Database Layer (MongoDB)

- Stores:
  - User information (username, password, status)
  - Messages (sender, receiver, content, timestamp)
  - Chat rooms (optional for group chat scalability)

---

## ⚙️ Functional Workflow

### 🔐 1. User Authentication

- User registers or logs in through REST APIs (`/api/auth/register` and `/api/auth/login`).
- On login, server generates a **JWT token**.
- Token is stored on client-side (localStorage) for secure authenticated requests.

### 🔗 2. Socket Connection

- After authentication, client connects to the WebSocket server using **Socket.io**.
- The token is verified before establishing a persistent socket connection.

### 💬 3. Real-Time Messaging

- When a user sends a message:
  - Client emits a `send_message` event with `{ senderId, receiverId, text }`.
  - Server receives and validates data.
  - Message is stored in MongoDB.
  - Server emits a `receive_message` event to the receiver’s socket.

### 🕓 4. Message Persistence & History

- All messages are stored in MongoDB for permanent storage.
- Upon login or conversation selection, users can fetch past messages via REST APIs (`/api/messages/:userId`).

### 🟢 5. Presence Management

- Server tracks online users via active socket connections.
- Emits `user_online` and `user_offline` events to other connected users.

### 🔄 6. Reliability & Scalability

- Supports reconnection and offline queue management.
- Scalable to include multiple chat rooms or group chats using Socket.io rooms.

---

## 🧰 Tech Stack

| Layer          | Technology Used                   |
| -------------- | --------------------------------- |
| Frontend       | React.js, Axios, Socket.io-client |
| Backend        | Node.js, Express.js, Socket.io    |
| Database       | MongoDB (via Mongoose)            |
| Authentication | JSON Web Tokens (JWT)             |
| Deployment     | Vercel, Netlify, or Railway       |
| Dev Tools      | Nodemon, Concurrently             |

---

## 🧑‍💻 Prerequisites

Ensure you have installed:

- **Node.js** (v16 or later)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas account)
- **Git** (for version control)

---

## ⚡ Installation & Running Locally

```bash
# 1️⃣ Clone repository
git clone https://github.com/sukriti-waani/Chat_App.git
cd Chat_App

# 2️⃣ Setup and run backend
cd server
npm install
# Create a .env file with variables below
npm run dev

# 3️⃣ Setup and run frontend
cd ../client
npm install
npm start

```
