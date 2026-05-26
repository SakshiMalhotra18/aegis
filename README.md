# Aegis — AI‑Powered Security & Automation Platform

**Aegis** is a modern, high‑performance web application that provides AI‑driven security monitoring, automated incident response, and a sleek, extensible UI for DevOps teams.  
Built with **Vite**, **TypeScript**, **React**, and **Tailwind CSS**, and powered by the **Groq Llama 3.3** inference engine.

---  

## ✨ Key Features

- 🛡️ **Real‑time Threat Detection** – Continuous monitoring of logs, network traffic, and system events with AI‑enhanced anomaly detection.  
- 🤖 **Automated Incident Response** – Playbooks that auto‑remediate common threats (e.g., isolate containers, rotate credentials).  
- 📊 **Analytics Dashboard** – Interactive charts and tables (Chart.js + Recharts) visualizing attack vectors, exposure scores, and response times.  
- 🔐 **Policy‑as‑Code** – Define security policies in YAML/JSON, enforce them automatically across environments.  
- 🚀 **Extensible Plugin System** – Write custom plugins (Node/TS) to integrate with any CI/CD pipeline, SIEM, or cloud provider.  
- 🎯 **Confidence‑Weighted Alerts** – Each alert includes a confidence score and a concise reasoning summary.  
- 📁 **Audit Trail & Reporting** – Immutable logs stored in PostgreSQL via Prisma, exportable PDFs for compliance.  

---  

## 📦 Tech Stack

| Layer | Technology |
|-------|--------------|
| **Framework** | Vite + React + TypeScript |
| **Styling** | Tailwind CSS (dark‑mode, glass‑morphism) |
| **State** | Redux Toolkit + RTK Query |
| **Data Layer** | Prisma + PostgreSQL |
| **AI Engine** | Groq Llama 3.3 (inference via REST) |
| **Charts** | Chart.js & Recharts |
| **Testing** | Vitest + React Testing Library |
| **CI/CD** | GitHub Actions (lint, test, build, deploy) |
| **Deployment** | Docker + Kubernetes (Helm chart) |

---  

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/aegis.git
cd aegis

# Install dependencies
npm ci

# Set up environment variables
cp .env.example .env
# Edit .env with your own values (DB connection, Groq API key, etc.)

# Run the development server
npm run dev
