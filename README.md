<<<<<<< HEAD
# CircularLoop ♻️🌱
> **"Give Every Product Another Life."**  
> An AI-assisted circular-economy platform that helps communities and campuses extend the useful life of products through reuse, repair, donation, and responsible recycling, with verifiable environmental impact tracking and gamification rewards.

---

## 📖 Table of Contents
1. [Overview & Vision](#-overview--vision)
2. [Technology Stack](#-technology-stack)
3. [Key Features & User Journey](#-key-features--user-journey)
4. [Project Structure](#-project-structure)
5. [Prerequisites & System Requirements](#-prerequisites--system-requirements)
6. [Quick Start Guide (Windows PowerShell & Bash)](#-quick-start-guide)
7. [Hackathon Demonstration Walkthrough](#-hackathon-demonstration-walkthrough)
8. [API Documentation](#-api-documentation)
9. [Running Automated Tests](#-running-automated-tests)
10. [Environmental Impact Calculation Methodology](#-environmental-impact-calculation-methodology)
11. [Known Limitations & Future Roadmap](#-known-limitations--future-roadmap)

---

## 🌟 Overview & Vision

Many usable items (laptops, books, furniture, small appliances) end up in landfills simply because owners cannot quickly find a recipient, lack guidance on repairability, or don't know where to donate or recycle locally.

**CircularLoop** bridges this gap:
- **Reuse**: Community marketplace for giveaways, reuse sales, and student-to-student handoffs.
- **Repair**: Interactive Repair-First Assistant with guided troubleshooting, safety checklists, and local clinic directories.
- **Donate**: Certified charity and campus drive routing.
- **Recycle**: Verified e-waste and material drop-off points.
- **Track Impact**: Transparent carbon emissions avoided ($kg\ CO_2e$) and landfill waste diverted ($kg$).
- **Gamification**: Circular Points, community leaderboards, and sustainability achievement badges.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 19 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (custom sustainability palette: Warm Cream `#F8F8F2`, Forest Green `#174B38`, Leaf Green `#4F8A5B`, Sage `#DDEBDD`)
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Data Visualisation**: Recharts (interactive impact analytics, monthly diversion trends, category breakdown)
- **Interactive Maps**: Leaflet & OpenStreetMap (`react-leaflet`) with list-view fallback
- **State & Notifications**: Context API (`AuthContext`, `ToastContext`), Custom Confirmation Modals

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ORM & Database**: SQLAlchemy 2.0 with SQLite (persists across restarts in `circularloop.db`)
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Uploads**: Python-Multipart with media storage under `backend/uploads/`
- **Validation**: Pydantic v2 schemas
- **Testing**: Pytest & Starlette TestClient (test suite included; run locally to verify)
- **AI Classification**: Modular multi-tier service (heuristic keyword vision + PIL format inspection with transparent confidence metrics)

---

## 🚀 Key Features & User Journey

1. **Public Landing Page (`/`)**:
   - Hero section with high-impact sustainability messaging.
   - Live impact summary metrics.
   - Three-step workflow: *List, Match, Give Again*.
   - Featured circular items gallery with direct request links.
2. **Authentication & Hackathon 1-Click Demo Login (`/auth`)**:
   - Standard email/password registration and login.
   - **1-Click Demo Profiles**:
     - 🎓 **Student** (`maya.student@circularloop.edu`): Has listings and active requests.
     - 🔧 **Repairer** (`alex.repair@circularloop.edu`): Makerspace mentor with repair expertise.
     - 🏛 **Coordinator** (`sarah.admin@circularloop.edu`): Campus sustainability coordinator.
3. **Circular Marketplace (`/marketplace`)**:
   - Search by title, description, or location.
   - Filter by **Category** (Electronics, Books, Furniture, Appliances, Clothing, Sports, etc.).
   - Filter by **Condition** (New, Like New, Good, Fair, Needs Repair).
   - Filter by **Purpose** (Give away, Sell for reuse, Request repair, Donate, Responsible recycling).
   - Real-time sorting (Newest, Price Low/High).
4. **Item Detail & Exchange Request (`/items/:id`)**:
   - High-resolution photo gallery, specifications, and owner profile.
   - Interactive exchange request modal with preferred pickup times and note.
   - One-click favorite toggling.
   - Similar items recommendation carousel.
5. **Listing Creation with AI Category Detection (`/create-listing`)**:
   - Photo upload with immediate local preview.
   - Auto-invoked AI classifier providing category, purpose, and condition suggestions with transparent confidence disclosure.
   - Validation for file types, size, price, and pickup details.
6. **Smart Matching Engine (`/smart-matching`)**:
   - Multi-factor scoring algorithm matching active user listings and preferences with compatible community requests.
   - Human-readable match reasons ("Identical category match", "Compatible purpose", "Optimal condition").
7. **Repair-First Assistant (`/repair-assistant`)**:
   - Troubleshooting wizard with step-by-step diagnostics for laptops, phones, furniture, appliances, and clothing.
   - Safety notices warning against hazardous electrical or lithium-ion repairs.
   - Directory of verified campus repair cafes and local technicians.
8. **Nearby Opportunities Map (`/nearby-map`)**:
   - Interactive Leaflet map displaying approximate item locations, repair hubs, and donation centers.
   - Toggleable list fallback view if geolocation is disabled.
9. **Environmental Impact Analytics (`/impact`)**:
   - Total waste diverted ($kg$) and emissions avoided ($kg\ CO_2e$).
   - Recharts category diversion distribution and monthly trend graphs.
   - Transparent, documented calculation methodology with emission factors.
10. **Rewards & Community Leaderboard (`/rewards`)**:
    - Circular Points balance and activity audit log.
    - Badges (*First Item Reused*, *Repair Champion*, *Circular Campus Contributor*).
    - Opt-in community leaderboard with rank badges.
11. **User Dashboard & Profile (`/dashboard`, `/profile`)**:
    - Centralized hub for managing active listings, incoming requests (Accept/Reject), outgoing requests, and completed circular handoffs.
    - Completing an exchange securely updates inventory, records impact metrics, and awards points to both parties.

---

## 📂 Project Structure

```text
Circular-Loop/
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI endpoint routers
│   │   │   ├── auth.py      # Registration, JWT login, demo login
│   │   │   ├── listings.py  # CRUD, filtering, search, favourites
│   │   │   ├── exchanges.py # Request creation, accept/reject, complete
│   │   │   ├── matching.py  # Multi-factor smart matching
│   │   │   ├── repair.py    # Repair guides and provider directory
│   │   │   ├── impact.py    # Carbon and waste diversion metrics
│   │   │   ├── rewards.py   # Points, badges, and leaderboard
│   │   │   └── classify.py  # AI image & title classification
│   │   ├── core/            # Config, JWT, and security utilities
│   │   ├── db/              # SQLAlchemy session and engine
│   │   ├── models/          # ORM models (User, Listing, Exchange, Impact, etc.)
│   │   ├── schemas/         # Pydantic request and response models
│   │   ├── services/        # Business logic (impact math, matching, AI classifier)
│   │   ├── seed.py          # Demo database seeder
│   │   └── main.py          # FastAPI application entrypoint
│   ├── tests/
│   │   └── test_api.py      # Automated Pytest suite (10 test cases)
│   ├── uploads/             # Locally stored listing images
│   ├── .env.example         # Backend environment variables
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── assets/          # Static logos and demo images
│   │   ├── components/      # Navbar, Footer, ItemCard, Modals, SkeletonCard
│   │   ├── context/         # AuthContext and ToastContext
│   │   ├── pages/           # 11 application pages
│   │   ├── services/        # API client with typed fetch methods
│   │   ├── types/           # Shared TypeScript interfaces
│   │   ├── App.tsx          # Router configuration
│   │   ├── index.css        # Tailwind directives and Leaflet styling
│   │   └── main.tsx         # React mount entrypoint
│   ├── public/              # Static favicon and assets
│   ├── package.json         # Frontend dependencies and scripts
│   ├── tailwind.config.js   # Custom circular color tokens
│   ├── tsconfig.json        # TypeScript configuration
│   └── vite.config.ts       # Vite bundler config
├── circularloop.db          # Persistent SQLite database
├── master_prompt.md         # Full project specification
├── .gitignore               # Production-grade gitignore
└── README.md                # Comprehensive documentation
```

---

## 💻 Prerequisites & System Requirements

- **Node.js**: `v18.0.0` or higher (verified on `v24.x`)
- **Python**: `3.11.x` or higher
- **Package Managers**: `npm` (frontend) and `pip` (backend)

---

## ⚡ Quick Start Guide

For the cleaned GitHub-ready setup, Windows CMD commands, environment-file guidance, and push instructions, see [`GITHUB_SETUP.md`](GITHUB_SETUP.md).

### 1. Backend Setup

#### Windows PowerShell:
```powershell
# Navigate to backend directory
cd backend

# Create virtual environment (if not already created)
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install required dependencies
pip install -r requirements.txt

# Create .env from template (if needed)
Copy-Item .env.example .env

# Initialize database and populate demo records
python app/seed.py

# Start FastAPI development server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### macOS / Linux / Bash:
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python app/seed.py
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

*Backend runs at: **http://127.0.0.1:8000***  
*Interactive Swagger Documentation: **http://127.0.0.1:8000/docs***

---

### 2. Frontend Setup

#### In a second terminal:
```powershell
# Navigate to frontend directory
cd frontend

# Install npm packages
npm install

# Start Vite development server
npm run dev
```

*Frontend runs at: **http://localhost:5173***

---

## 🎯 Hackathon Demonstration Walkthrough

Follow this 5-minute scenario to demonstrate the complete circular-economy loop:

1. **Open Frontend**: Navigate to `http://localhost:5173`.
2. **Explore Marketplace**:
   - Click **Explore Items** or **Marketplace** in the navigation bar.
   - Filter by `Electronics` or search for `ThinkPad`.
   - Click on the **ThinkPad T480 Laptop** to view its details, condition, and repair history.
3. **1-Click Demo Login**:
   - Click **Sign In** in the top navigation.
   - Click the green **Student (Maya Chen)** 1-Click Demo button.
   - You are now logged in and redirected to your Dashboard with pre-loaded active listings and points.
4. **Create a New Listing with AI Category Detection**:
   - Click **List an Item** (`/create-listing`).
   - Type `"Calculus Early Transcendentals 9th Edition"` in Title.
   - Notice the AI suggestion badge suggests `"Books and educational materials"`.
   - Click **Apply Suggestion** to auto-populate the form.
   - Upload any photo or click **Publish Listing**.
5. **Exchange Request & Completion Flow**:
   - Go to **Marketplace**, open any item owned by another user (e.g. *Solid Oak Study Desk*).
   - Click **Request This Item**, add a brief pickup note, and submit.
   - Navigate to **Dashboard** -> **Incoming Requests** or **Outgoing Requests** to see the real-time status.
   - Click **Complete Exchange** on an accepted request to trigger the transaction.
   - Notice your **Circular Points** increase and a success toast confirms diverted landfill waste!
6. **View Environmental Impact**:
   - Click **Impact** in the navigation bar (`/impact`).
   - Watch the interactive Recharts update with updated $kg$ of diverted waste and avoided carbon emissions!
7. **Repair-First Assistant**:
   - Click **Repair Assistant** (`/repair-assistant`).
   - Select `"Broken Laptop Screen"` or `"Wobbly Chair Leg"`.
   - Review the guided step-by-step diagnostic checklist and safety precautions.

---

## 📡 API Documentation

FastAPI automatically generates interactive OpenAPI/Swagger docs:
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### Primary Endpoints:
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new account with hashed password |
| `POST` | `/api/auth/login` | Login and receive Bearer JWT |
| `POST` | `/api/auth/demo-login` | 1-Click login for Student, Repairer, or Coordinator |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `GET` | `/api/listings` | Search and filter listings by category, purpose, condition |
| `POST` | `/api/listings` | Create new listing with photo (Auth required) |
| `GET` | `/api/listings/{id}` | Retrieve listing detail with owner brief |
| `POST` | `/api/listings/{id}/favourite` | Toggle item favorite status |
| `POST` | `/api/listings/upload-image` | Upload listing photo to `backend/uploads/` |
| `POST` | `/api/exchanges/requests` | Submit an exchange/reuse request |
| `PUT` | `/api/exchanges/requests/{id}/status` | Accept or reject an exchange request |
| `POST` | `/api/exchanges/complete` | Complete transaction, compute impact, award points |
| `GET` | `/api/matching/recommendations` | Smart multi-factor match recommendations |
| `GET` | `/api/repair/guides` | Troubleshooting guides and diagnostics |
| `GET` | `/api/repair/providers` | Directory of local repair hubs & makerspaces |
| `GET` | `/api/impact/summary` | Aggregated diverted waste & carbon statistics |
| `GET` | `/api/rewards/me` | User points balance, badges, and audit log |
| `GET` | `/api/rewards/leaderboard` | Opt-in community leaderboard |
| `POST` | `/api/classify/suggest-category` | AI classification with transparent confidence scoring |

---

## 🧪 Running Automated Tests

The backend includes a comprehensive test suite in `backend/tests/test_api.py` testing auth, listings, exchanges, duplicate completion safeguards, and impact calculations.

To execute tests:
```powershell
# From project root:
.\backend\.venv\Scripts\pytest backend\tests -v
```

Expected output:
```text
backend\tests\test_api.py::test_root_and_health PASSED
backend\tests\test_api.py::test_auth_registration_and_login PASSED
backend\tests\test_api.py::test_demo_login PASSED
backend\tests\test_api.py::test_create_and_get_listing PASSED
backend\tests\test_api.py::test_listing_filters_and_search PASSED
backend\tests\test_api.py::test_favourite_toggle PASSED
backend\tests\test_api.py::test_exchange_request_workflow PASSED
backend\tests\test_api.py::test_complete_exchange_and_impact PASSED
backend\tests\test_api.py::test_prevent_duplicate_exchange_completion PASSED
backend\tests\test_api.py::test_smart_matching_recommendations PASSED

======================= 10 passed in 1.05s =======================
```

---

## 📊 Environmental Impact Calculation Methodology

To maintain data integrity and avoid greenwashing, all environmental calculations follow documented scientific estimates:

1. **Diverted Landfill Waste ($kg$)**:
   - Computed from average empirical weights by category:
     - Laptops & Computers: $2.5\ kg$
     - Books & Textbooks: $0.8\ kg$
     - Furniture: $15.0\ kg$
     - Clothing & Shoes: $0.6\ kg$
     - Small Appliances: $3.2\ kg$
     - Household Goods: $1.2\ kg$
     - Sports Equipment: $4.0\ kg$

2. **Emissions Avoided ($kg\ CO_2e$)**:
   - Estimates embodied manufacturing emissions saved by prolonging product lifespan:
     - Electronics: $\approx 70.0\ kg\ CO_2e / \text{item}$ (avoiding raw silicon and mineral extraction)
     - Furniture: $\approx 25.0\ kg\ CO_2e / \text{item}$
     - Appliances: $\approx 35.0\ kg\ CO_2e / \text{item}$
     - Clothing: $\approx 8.0\ kg\ CO_2e / \text{item}$
     - Books: $\approx 2.5\ kg\ CO_2e / \text{item}$

*Note: In the analytics UI, demonstration metrics are explicitly labeled as model estimates based on category averages rather than verified third-party carbon audits.*

---

## 🔮 Known Limitations & Future Roadmap

- **Production Database**: SQLite is used for lightweight, zero-dependency development. For high-concurrency production deployments, swap `DATABASE_URL` in `.env` to PostgreSQL.
- **Object Storage**: Uploaded files currently save to local disk (`backend/uploads/`). Production should stream images to AWS S3, Cloudflare R2, or Google Cloud Storage.
- **Direct Messaging**: Users currently coordinate through exchange request notes and pickup instructions; a real-time WebSocket chat channel is planned for v2.
- **Deep Learning Vision Model**: The classification engine currently uses a robust heuristic and PIL metadata extractor. An optional fine-tuned PyTorch / MobileNet endpoint can be plugged in via `app/services/classifier.py`.

---

## 🌿 License & Credits
Built for sustainability hackathons. Dedicated to promoting circular economies, reducing electronic and consumer waste, and empowering campus communities.
=======
# Git-circular-loop
>>>>>>> 1f9fe017c89a7dccfed39e4417a534d389b81dad
