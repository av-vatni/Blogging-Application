# Blogify — Blogging Application (DevOps-Ready)

A lightweight, production-ready blogging platform built with **Node.js, Express, MongoDB**, designed with **Docker, Jenkins, and Kubernetes** in mind.

---

## 🎯 Purpose

This repository focuses on **DevOps usability** while keeping the application simple:
- Easy local setup
- CI/CD friendly
- Containerized and Kubernetes-deployable
- Clear separation of app, config, and secrets

---

## 🧰 Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Frontend:** EJS, Bootstrap 5
- **Auth:** JWT (cookies)
- **DevOps:** Docker, Docker Compose, Jenkins, Kubernetes

---

## ✨ Core Features

- Blog CRUD (Create / Read / Update / Delete)
- User authentication & authorization (JWT)
- Profile management with avatar upload
- Search & pagination
- Secure access (users can edit/delete only their own posts)

---

## 📦 DevOps Surface

### Containerization
- `Dockerfile` — build application image
- `docker-compose.yml` — local dev stack (app + MongoDB)

### CI/CD
- `Jenkinsfile` — declarative pipeline:
  - Checkout
  - Install dependencies
  - Run tests
  - Build & tag Docker image
  - Push to registry
  - Deploy to Kubernetes

### Kubernetes
Located under `k8s/`:
- `app-deployment.yml`
- `app-service.yml`
- `mongo-deployment.yml`
- `secrets.yml`

### Configuration & Secrets
- `config.example.js` — environment-based config template  
- Secrets injected via **env vars / Kubernetes Secrets**

---

## 🚀 Quick Start (DevOps)

### Build Docker Image
```bash
docker build -t blogify:dev .


### Run Locally with Docker Compose

```bash
docker compose up --build
```

### Run Tests

```bash
npm ci
npm test
```

### Deploy to Kubernetes

```bash
kubectl apply -f k8s/secrets.yml
kubectl apply -f k8s/mongo-deployment.yml
kubectl apply -f k8s/app-deployment.yml
kubectl apply -f k8s/app-service.yml
```

---

## 🔐 Required Environment Variables

```bash
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://mongo:27017/blogify
JWT_SECRET=change_me
COOKIE_SECRET=change_me
```

---

## 📁 Project Structure

```
.
├── Dockerfile
├── Jenkinsfile
├── docker-compose.yml
├── k8s/
├── config.example.js
├── index.js
├── models/
├── routes/
├── middlewares/
├── services/
├── views/
├── public/
└── tests/
```

---

## ☸ Kubernetes Notes

* Replace **HostPath** with **PVCs** in production
* Add **resource requests/limits**
* Add **liveness & readiness probes**
* Use `imagePullSecrets` for private registries
* Prefer external secret managers (Vault, AWS SM, etc.)

---

## 🔍 Production Readiness Checklist

* Secrets removed from repo
* Non-root containers (recommended)
* HTTPS enabled
* Secure cookie flags
* Centralized logging & metrics (Prometheus / ELK)

---

## 📜 License

ISC License

---

**Blogify is designed to be simple to run, easy to deploy, and clean to extend.**
