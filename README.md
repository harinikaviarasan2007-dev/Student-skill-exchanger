# SkillSwap – Student Skill Exchange Platform

> **"Learn. Teach. Exchange Skills."**  
> A full-stack collaborative learning web platform where students can exchange knowledge and skills without financial barriers.

---

## 📖 1. Project Overview

**SkillSwap** connects college students who want to learn new skills with peers who can teach them. For example:
- **Arun** can teach **Python** and wants to learn **UI/UX Design**.
- **Priya** can teach **UI/UX Design** and wants to learn **Python**.
- The SkillSwap **Intelligent Matching System** detects their complementary needs and recommends them as a **95% Match** with an explicit reason breakdown.

Students can browse profiles, filter by skills, schedule availability, propose swaps, manage active exchanges, mark them as completed, and leave verified ratings and reviews.

---

## 🚀 2. Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React icons, Canvas Confetti.
- **Backend**: Node.js, Express.js, TypeScript, RESTful API architecture.
- **Database**: SQLite with Prisma schema and relational data engine.
- **Authentication**: JWT (JSON Web Tokens), `bcryptjs` password hashing, protected routes, and role authorization.
- **Real-time UX**: In-app notifications system, match score breakdown, and 1-click Demo Account Switcher.

---

## 🧠 3. Intelligent Matching System

The platform features an intelligent scoring algorithm based on complementary skills rather than arbitrary random lists:

| Criteria | Points |
| :--- | :--- |
| **Mutual Skill Match** (You teach what they want AND they teach what you want) | **+50 pts** |
| **One-Way Skill Match** (One direction of teaching matches) | **+25 pts** |
| **Each Additional Complementary Skill** | **+10 pts** |
| **Availability Match** (Both available Weekends, Evenings, etc.) | **+10 pts** |
| **Compatible Learning Mode** (Online, In-Person, Hybrid) | **+5 pts** |
| **High Peer Rating** (Rating $\ge$ 4.0) | **+5 pts** |

The score is normalized into a percentage (**0% – 98%**) and displays an explainable **"Why this match?"** accordion:
- ✓ *They can teach UI/UX Design*
- ✓ *You can teach Python*
- ✓ *Both are available on Weekends*
- ✓ *Compatible learning mode: Hybrid*
- ✓ *Highly rated student (5.0★ with reviews)*

---

## 📂 4. Project Structure

```
skillswap/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Header with logo, navigation & demo switcher
│   │   │   ├── Footer.tsx             # Professional student platform footer
│   │   │   ├── SkillTag.tsx           # Interactive visual chip tags
│   │   │   ├── MatchCard.tsx          # Card with match score & "Why this match?"
│   │   │   ├── StudentCard.tsx        # Peer exploration card with filters
│   │   │   ├── ExchangeModal.tsx      # Modal to propose skill exchange pairing
│   │   │   └── ReviewModal.tsx        # 1-5 star rating and feedback modal
│   │   ├── context/
│   │   │   └── AuthContext.tsx        # State management for user, token & notifications
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx        # Hero, flow diagram, feature cards
│   │   │   ├── LoginPage.tsx          # Login with 1-click demo accounts
│   │   │   ├── RegisterPage.tsx       # Student registration with academic details
│   │   │   ├── DashboardPage.tsx      # Metrics, skills overview & recommended matches
│   │   │   ├── ExploreStudentsPage.tsx# Search & multi-facet filtering
│   │   │   ├── StudentProfilePage.tsx # Public profile with reviews & request CTA
│   │   │   ├── MySkillsPage.tsx       # Offered & required skills manager
│   │   │   ├── RequestsPage.tsx       # Received & Sent proposal tabs
│   │   │   ├── MyExchangesPage.tsx    # Active & Completed partnerships with rating
│   │   │   └── ProfilePage.tsx        # Edit profile, bio, academic year & schedule
│   │   ├── services/
│   │   │   └── api.ts                 # Typed fetch client for all REST endpoints
│   │   ├── types/
│   │   │   └── index.ts               # Core TypeScript models
│   │   ├── App.tsx                    # Routes & protected routes
│   │   ├── main.tsx
│   │   └── index.css                  # Tailored styling & design tokens
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── server/
│   ├── prisma/
│   │   └── schema.prisma              # Database schema definition
│   ├── src/
│   │   ├── controllers/               # Auth, User, Skill, Match, Request, Exchange, Review
│   │   ├── middleware/                # JWT auth verification
│   │   ├── routes/                    # Express REST routes
│   │   ├── services/
│   │   │   ├── db.ts                  # Persistent relational SQLite database engine
│   │   │   └── matchingService.ts     # Intelligent matching algorithm
│   │   ├── seed.ts                    # 10 realistic demo students & initial reviews
│   │   └── server.ts                  # Server entry point on port 5001
│   ├── .env.example
│   └── package.json
│
├── package.json                       # Root script orchestrator
└── README.md
```

---

## 🔑 5. Pre-seeded Demo Accounts

All demo accounts use the standard password: **`password123`**

| Student Name | Email | Department / Year | Can Teach (Offered) | Wants to Learn |
| :--- | :--- | :--- | :--- | :--- |
| **Arun Kumar** | `arun@skillswap.edu` | CS & Eng (3rd Yr) | Python, SQL, C++ | UI/UX Design, Figma |
| **Priya Sharma** | `priya@skillswap.edu` | Interaction Design (3rd Yr) | UI/UX Design, Figma, Photoshop | Python, Data Science |
| **Rahul Verma** | `rahul@skillswap.edu` | IT (4th Yr) | Java, Spring Boot, PostgreSQL | React, TypeScript |
| **Sneha Patel** | `sneha@skillswap.edu` | Computer Science (2nd Yr) | React, JavaScript, HTML/CSS | Java, Spring Boot |
| **Karthik Raja** | `karthik@skillswap.edu` | Visual Comm (3rd Yr) | Video Editing, Photography | Graphic Design, Blender |
| **Ananya Roy** | `ananya@skillswap.edu` | Digital Multimedia (4th Yr) | Graphic Design, Illustrator, Blender | Video Editing, Premiere Pro |
| **Vikram Menon** | `vikram@skillswap.edu` | Electrical Eng (2nd Yr) | Mathematics, MATLAB, C | Python, Machine Learning |
| **Divya Sundaram** | `divya@skillswap.edu` | Data Science (3rd Yr) | Machine Learning, Python | Public Speaking, Pitching |

*(Tip: You can switch between any of these accounts in 1-click via the "Demo Switcher" button on the navigation bar!)*

---

## 💻 6. Quick Setup & Execution

### Prerequisites
- Node.js (v18+) & npm

### 1. Install Dependencies
```bash
# In the root project directory:
npm run install:all
```
*(Or navigate to `server` and `client` individually and run `npm install`)*

### 2. Database & Sample Data
The database is auto-seeded upon starting the server. You can also manually re-seed at any time:
```bash
npm run seed
```

### 3. Run the Development Server
```bash
# Starts both frontend (port 5173) and backend (port 5001) concurrently:
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 🎬 7. Live Demonstration Walkthrough

Follow these exact steps to demonstrate the end-to-end workflow:

1. **Visit Landing Page** (`http://localhost:5173`):
   - Notice the visual explanation: *Arun (teaches Python) ↔ Priya (teaches UI/UX)*.
2. **Log In as Arun**:
   - Click "Log In" or use the 1-Click Demo Switcher to select **Arun Kumar**.
   - Notice Arun's dashboard displays:
     - Skills I Can Teach: `Python`, `SQL`, `C++`
     - Skills I Want to Learn: `UI/UX Design`, `Figma`
3. **Verify Matching Algorithm**:
   - In the "Recommended Partners" section, **Priya Sharma** appears with a **95% Match** badge.
   - Click **"Why this match?"** to see the explainable breakdown.
4. **Send Skill Exchange Request**:
   - Click **"Swap Skills"** on Priya's card.
   - Select: You Teach `Python` ↔ You Learn `UI/UX Design`.
   - Write a note and click **"Send Request"**.
5. **Switch to Priya**:
   - Use the **Demo Switcher** in the top navigation and select **Priya Sharma**.
   - Open **Requests** (`/requests`).
   - The received request from Arun Kumar is displayed with status **Pending**.
   - Click **"Accept Exchange"** (confetti triggers 🎉).
6. **Switch back to Arun**:
   - Select **Arun Kumar** from the Demo Switcher.
   - Open **My Exchanges** (`/exchanges`).
   - The exchange with Priya is listed under **Active Partnerships**.
   - Click **"Mark as Completed"**.
7. **Submit 5-Star Rating & Review**:
   - The exchange moves to **Completed Swaps**.
   - Click **"Rate & Review Partner"**.
   - Select 5 stars and write a testimonial (e.g., *"Priya was wonderful at teaching Figma design systems!"*).
   - Click **"Submit Feedback"**.
8. **Verify Updated Reputation**:
   - Open Priya's profile page (`/students/[priya-id]`).
   - Notice Priya's completed exchanges count increased and Arun's testimonial and 5-star rating are displayed!

---

## 📡 8. REST API Summary

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new student profile | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `GET` | `/api/auth/me` | Current authenticated student info | Yes |
| `GET` | `/api/users` | Search & filter all student profiles | No |
| `GET` | `/api/users/:id` | Get student profile with reviews | No |
| `PUT` | `/api/users/:id` | Update personal profile details | Yes |
| `GET` | `/api/skills` | List all predefined skill tags | No |
| `POST` | `/api/skills/offered` | Add a skill you can teach | Yes |
| `DELETE` | `/api/skills/offered/:id`| Remove an offered skill | Yes |
| `POST` | `/api/skills/required` | Add a skill you want to learn | Yes |
| `DELETE` | `/api/skills/required/:id`| Remove a required skill | Yes |
| `GET` | `/api/matches` | Intelligent matching algorithm results | Yes |
| `POST` | `/api/requests` | Propose an exchange to a peer | Yes |
| `GET` | `/api/requests/received` | List received proposals | Yes |
| `GET` | `/api/requests/sent` | List sent proposals | Yes |
| `PUT` | `/api/requests/:id/accept` | Accept a proposal and create exchange | Yes |
| `PUT` | `/api/requests/:id/reject` | Decline a proposal | Yes |
| `GET` | `/api/exchanges` | List active and completed exchanges | Yes |
| `PUT` | `/api/exchanges/:id/complete`| Mark exchange as completed | Yes |
| `POST` | `/api/reviews` | Submit 1–5 star rating and review | Yes |
| `GET` | `/api/reviews/user/:id` | Fetch public reviews for a student | No |
| `GET` | `/api/notifications` | Get in-app alerts and unread count | Yes |
| `PUT` | `/api/notifications/:id/read`| Mark an alert as read | Yes |

---

## 🔮 9. Future Enhancements

- In-app direct peer messaging / chat with real-time WebSockets.
- Calendar integration with Google Calendar / Outlook for exchange scheduling.
- Video room links (Jitsi / WebRTC) directly inside active exchanges.
- College domain email verification (`.edu` / `.ac.in` domain checking).
- Skill badges and verifiable completion certificates.
