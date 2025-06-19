# 🎬 VideoFlix Frontend (Angular 20)

Willkommen beim **VideoFlix**-Frontend – einer Angular 20 Single Page Application, die zusammen mit dem [VideoFlix Backend (Django/DRF)](https://github.com/cyborg-s/videoflix-backend) eine vollständige Netflix-ähnliche Plattform bildet.

---

## 📦 Projektübersicht

- ✅ Angular 20 mit Standalone-Komponenten
- 🔐 Authentifizierung mit Token & Guards
- 🎞️ Videowiedergabe mit Video.js
- 🧠 Resolvers, Lazy Loading, Routing
- ⚙️ Kommunikation via REST API mit Django Backend

---

## 🚀 Schnellstart

### 1. Repository klonen

```bash
git clone https://github.com/cyborg-s/VideoFlix_frontend.git
cd videoflix-frontend
```
---

### 2. Abhängigkeiten installieren
```bash
npm install
```
---

### 3. Backend starten
Falls du das Backend noch nicht gestartet hast, folge der Anleitung im Backend-Repository oder:

```bash
git clone https://github.com/cyborg-s/VideoFlix_backend.git
cd videoflix-backend
docker-compose up --build
```
Backend sollte unter http://localhost:8000 laufen.

---

### 4. Frontend starten
```bash
ng serve
```

---

### 🔐 Authentifizierung
Das Frontend nutzt Token-basierte Authentifizierung:

Bei erfolgreichem Login wird das Token im localStorage gespeichert.

AuthGuard schützt geschützte Routen (z. B. /dashboard, /player/:id)

GuestGuard verhindert Zugriff auf Login/Signup, wenn bereits eingeloggt.

---

### 📁 Projektstruktur (Frontend)
<code><pre>
videoflix-frontend/
├── src/
│   ├── app/
│   │   ├── startpage/
│   │   ├── login/
│   │   ├── sign-up/
│   │   ├── dashboard/
│   │   ├── video-detail/
│   │   ├── player/
│   │   ├── forgot-pw/
│   │   ├── password-reset/
│   │   ├── guards/
│   │   ├── services/
│   │   └── models/
│   └── environments/
│       ├── environment.ts
│       └── environment.prod.ts
├── angular.json
├── package.json
└── README.md
</code></pre>

---
### 🧰 Tools & Technologien
Angular 20

Angular Router

RxJS & Observables

Video.js

SCSS

Django REST Framework (Backend)

Docker (Backend)

---

### 10. 🙋‍♂️ Autor
Sascha Nyßen

Dieses Projekt ist ein Teil eines persönlichen Fullstack-Projekts zum Thema Videostreaming.
