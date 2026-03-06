<div align="center">

<h1 align="center">Ucabs.</h1>

<p align="center">
<strong>Engineering the physical mobility infrastructure of tomorrow, today.</strong>
</p>

<p align="center">
<a href="https://reactjs.org/">
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
</a>

<a href="https://tailwindcss.com/">
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
</a>

<a href="https://nodejs.org/">
<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"/>
</a>

<a href="https://socket.io/">
<img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101"/>
</a>

<a href="https://www.mongodb.com/">
<img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"/>
</a>
</p>

</div>

---

# 🌐 Overview

**Ucabs** is a high-performance, full-stack mobility platform bridging the gap between digital intent and physical movement. Built with algorithmic precision and absolute transparency, it features a progressive-disclosure booking interface, real-time GPS telemetry, and a dedicated partner driver network.

This project serves as a complete clone of Tier-1 ride-hailing architectures (like Uber/Lyft), featuring separate workflows for **Riders, Drivers, and Administrators**.

---

# 📸 Application Screenshots

## 🚀 Landing Page

<div align="center">
<img src="./assets/screenshots/landing.png" width="900" alt="Ucabs Landing Page"/>
<p><em>Modern landing page with ride booking entry point and location search.</em></p>
</div>

---

## 👤 Rider Dashboard

<div align="center">
<img src="./assets/screenshots/rider-dashboard.png" width="900" alt="Rider Dashboard"/>
<p><em>User dashboard displaying booking interface, vehicle options and pricing.</em></p>
</div>

---

## 🚘 Driver Dashboard

<div align="center">
<img src="./assets/screenshots/driver-dashboard.png" width="900" alt="Driver Dashboard"/>
<p><em>Driver panel showing ride requests, navigation map and trip controls.</em></p>
</div>

---

## 🗺 Ride Booking & Live Tracking

<div align="center">
<img src="./assets/screenshots/booking-flow.png" width="900" alt="Ride Booking Flow"/>
<p><em>Real-time ride booking flow with GPS tracking and route visualization.</em></p>
</div>

---

# ✨ Core Architecture & Features

### 🚖 Frictionless Booking Engine

A progressive UI flow using **Framer Motion** for smooth step-by-step location selection, vehicle tier matching (**Mini, Sedan, SUV**), and upfront fare calculation.

### 📡 Real-Time Telemetry

Powered by **Socket.io**, enabling low-latency updates for live vehicle tracking and driver-rider synchronization.

### 🗺 Advanced Geolocation

Integrated with the **TomTom Maps API** for:

- Reverse geocoding  
- Address auto-completion  
- Dynamic route distance calculations  

### 🔐 Cryptographic Safety

Secure **4-digit OTP verification** required to start trips, along with **KYC verification** for partner drivers.

### 👨‍✈️ Partner Driver Dashboard

Dedicated driver interface including:

- Live ride requests  
- Interactive navigation maps  
- Earnings & wallet tracking  

### 🎨 Premium UI/UX

Built using **Tailwind CSS** featuring:

- Glassmorphism UI  
- Responsive mobile bottom sheets  
- Hardware accelerated animations  
- Clean **Inter typography**

---

# 🛠 Tech Stack

## Frontend (Client Application)

- **React 18 + Vite**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide React Icons**
- **TomTom Maps API**
- **Leaflet / React-Leaflet**
- **React Context API**
- **Axios**

---

## Backend (Dispatch Engine)

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **Socket.io**
- **JWT Authentication**
- **bcrypt**

---

# 🚀 Getting Started (Local Development)

Follow these steps to run **Ucabs locally**.

---

## 📦 Prerequisites

Install the following:

- Node.js (v16+)
- MongoDB (Local or Atlas)
- TomTom API Key

Links:

- https://nodejs.org  
- https://mongodb.com  
- https://developer.tomtom.com  

---

# 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/ucabs.git
cd ucabs
```

---

# 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create `.env` inside **backend**

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ucabs_db
JWT_SECRET=your_super_secret_jwt_key
```

Run backend server

```bash
npm run dev
```

Backend will run on:

```
http://localhost:5000
```

---

# 3️⃣ Setup Frontend

Open new terminal.

```bash
cd frontend
npm install
```

Create `.env` inside **frontend**

```
VITE_TOMTOM_API_KEY=your_tomtom_api_key_here
```

Start dev server

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

# 📱 User Workflows to Test

Open **two browser windows** to simulate the real-time system.

---

## 👤 Rider Experience

1. Register / Login as User  
2. Go to **Book Ride**  
3. Enter pickup & destination  
4. View fare estimate  
5. Request ride  

---

## 🚘 Driver Experience

1. Register / Login as Driver  
2. Complete KYC upload mock  
3. Toggle driver status **Online**  
4. Accept incoming ride  
5. Complete trip flow  

```
Arrived → OTP → Start Trip → Complete Payment
```

---

# 🤝 Contributing

Steps to contribute:

1. Fork the project  
2. Create branch

```bash
git checkout -b feature/AmazingFeature
```

3. Commit changes

```bash
git commit -m "Add AmazingFeature"
```

4. Push branch

```bash
git push origin feature/AmazingFeature
```

5. Open Pull Request

---

# 📄 License

Distributed under the **MIT License**.

See `LICENSE` for more details.

---
