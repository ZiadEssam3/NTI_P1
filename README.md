# 📡 NTI_P1
# 🎧 Audio Library Sharing App – Backend API

A backend-only Express and MongoDB project for uploading, managing, and streaming audio content like audiobooks, lectures, and podcasts.

---

## 📌 Table of Contents

- [🌟 Overview](#-overview)
- [🎓 Learning Goals](#-learning-goals)
- [🏢 Main Features](#-main-features)
- [📁 Folder Structure](#-folder-structure)
- [🛠️ Technologies Used](#-technologies-used)
- [🚀 How to Run the Project](#-how-to-run-the-project)
- [🧪 API Endpoints](#-api-endpoints)
- [🛡️ Validation & Error Handling](#️-validation--error-handling)
- [🎯 Development Guide](#-development-guide)
- [📂 Sample Audio Pack](#-sample-audio-pack)

---

## 🌟 Overview

This RESTful API allows users to:

- Register/login with JWT-based authentication.
- Upload audio files and images using `multer`.
- View and update their profile.
- Manage (CRUD) audio uploads (with cover images and privacy settings).
- Stream audio using `fs.createReadStream` with range support.
- Provide role-based access to Admins for moderation.

---

## 🎓 Learning Goals

- Use Express.js, MongoDB, and Mongoose
- Implement file uploads with multer
- Set up JWT authentication and bcrypt password hashing
- Handle authorization and admin/user roles
- Stream audio using fs.createReadStream
- Use a centralized error handler
- Apply clean folder architecture

---

## 🏢 Main Features

### 👥 Authentication

| Method | Endpoint           | Description                    |
|--------|--------------------|--------------------------------|
| POST   | `/api/register`    | Register a new user            |
| POST   | `/api/login`       | Authenticate and return token  |

### 👤 Profile

| Method | Endpoint          | Description               |
|--------|-------------------|---------------------------|
| GET    | `/api/profile`    | View user profile         |
| PUT    | `/api/profile`    | Update name or picture    |

### 🎵 Audio Management

| Method | Endpoint                    | Description                                  |
|--------|-----------------------------|----------------------------------------------|
| POST   | `/api/audio`                | Upload audio + cover image                   |
| GET    | `/api/audio`                | View public audio files                      |
| GET    | `/api/audio/mine`           | View user’s own audio files                  |
| GET    | `/api/audio/stream/:id`     | Stream audio file                            |
| PUT    | `/api/audio/:id`            | Edit audio metadata or cover                 |
| DELETE | `/api/audio/:id`            | Delete own audio                             |

### 🛠️ Admin Tools

| Method | Endpoint                   | Description                   |
|--------|----------------------------|-------------------------------|
| GET    | `/api/admin/audios`        | View all audios               |
| DELETE | `/api/admin/audio/:id`     | Delete any user’s audio       |

---



## 🛠️ Technologies Used

- Node.js & Express.js
- MongoDB with Mongoose
- JWT (Authentication)
- bcryptjs (Password hashing)
- Multer (File uploads)
- express-validator (Input validation)
- fs module (File streaming)
- Postman (Testing)