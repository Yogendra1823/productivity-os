# 🚀 Productivity OS: Multi-Agent AI Assistant

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-success)](#) 
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20Gemini-blue)](#)
[![Deployment](https://img.shields.io/badge/Deployed_on-Google_Cloud_%7C_Vercel-orange)](#)

**Productivity OS** is an autonomous, multi-agent AI system designed to unify task management, note-taking, and scheduling. Instead of forcing users to juggle a calendar app, a to-do list, and a notepad, this system uses natural language processing to autonomously route and execute tasks in the background.

---

## ✨ Features

- **🧠 Intelligent Orchestration:** Powered by Google's Gemini 2.5 Flash, the central Orchestrator dynamically categorizes multi-part natural language requests into distinct agent workflows.
- **🤖 Specialized Agents:** Dedicated sub-agents manage Tasks, Notes, and Schedules independently.
- **📅 Autonomous Scheduling:** Direct, server-to-server integration with the Google Calendar API via headless Service Accounts to book events without manual data entry.
- **📊 Real-Time State Dashboard:** A React-powered UI that visualizes the active memory registry of all agents in real-time.
- **📄 One-Click Briefings:** Client-side generation of structured, downloadable PDF Daily Plans.

---

## 🏗️ Architecture

The system utilizes a decoupled, serverless architecture for maximum scalability and extremely low latency.

1. **Frontend Client:** React + Vite, deployed on Vercel for lightning-fast edge delivery.
2. **Backend API:** FastAPI Python server, deployed on Google Cloud Run.
3. **AI Engine:** Google Gemini 2.5 Flash API for intent parsing and entity extraction.
4. **External Integrations:** Google Calendar API (OAuth 2.0 Service Account flow).

---

## 🛠️ Tech Stack

**Frontend**
- React.js & Vite
- Axios
- jsPDF (for Daily Briefing generation)
- Lucide Icons

**Backend & AI**
- Python 3.10+
- FastAPI & Uvicorn
- Google Generative AI (Gemini 2.5 Flash)
- Google Calendar API & Google Auth

**Deployment**
- Vercel (Frontend)
- Google Cloud Run & Docker (Backend)

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js & npm
- Python 3.10+
- A Google Cloud Project with the Gemini API and Google Calendar API enabled.

### 1. Backend (FastAPI) Setup
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Environment Variables
# Create a .env file or export the following in your terminal:
export GEMINI_API_KEY="your_gemini_api_key"

# Run the server
uvicorn main:app --reload --port 8080

# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
