# 🎬 VideoFlix Frontend (Angular 20)

Welcome to the **VideoFlix** frontend – a modern Angular 20 Single Page Application that, together with the [VideoFlix Backend (Django/DRF)](https://github.com/cyborg-s/videoflix-backend), forms a complete Netflix-like streaming platform.

---

## 📦 Project Overview

- ✅ Angular 20 with standalone components  
- 🔐 Token-based authentication with route guards  
- 🎞️ Video playback powered by Video.js  
- 🧠 Resolvers, Lazy Loading, and Routing  
- ⚙️ Communication via REST API with Django backend  

---

## 🚀 Quick Start

### Requirements

- Angular

### 1. Clone the repository

```bash
git clone https://github.com/cyborg-s/VideoFlix_frontend.git
cd VideoFlix-frontend
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Start the backend

If the backend isn’t running yet, follow the instructions in the backend repo or:

```bash
git clone https://github.com/cyborg-s/VideoFlix_backend.git
cd videoflix-backend
docker-compose up --build
```

The backend should run at http://localhost:8000

---

### 4. Start the frontend

```bash
ng serve
```

---

### 🔐 Authentication

The frontend uses token-based authentication:

- Upon successful login, a token is stored in `localStorage`
- `AuthGuard` protects secure routes (e.g., `/dashboard`, `/player/:id`)
- `GuestGuard` blocks access to `/login` and `/signup` when already authenticated

---

### 📁 Project Structure (Frontend)

<pre><code>
videoflix-frontend/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── footer/
│   │   ├── forgot-pw/
│   │   ├── guards/
│   │   ├── header/
│   │   ├── imprint/
│   │   ├── legalnotice/
│   │   ├── login/
│   │   ├── password-reset/
│   │   ├── player/
│   │   ├── services/
│   │   ├── sign-up/
│   │   ├── startpage/
│   │   ├── video-detail/
│   │   ├── app.html
│   │   └── app.ts
│   ├── assets/
│   ├── main.html
│   ├── main.ts
│   └── styles.scss
├── angular.json
├── package.json
└── README.md
</code></pre>

---

### 🧰 Tools & Technologies

- Angular 20  
- Angular Router  
- RxJS & Observables  
- Video.js  
- SCSS  
- Django REST Framework (Backend)  
- Docker (Backend)  

---

### 🙋‍♂️ Author

Sascha Nyßen

This project is part of a personal fullstack project focused on video streaming.
