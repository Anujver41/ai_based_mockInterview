# 🤖 AI Interview & Coding Platform

> A full-stack, AI-powered platform for technical interview preparation — featuring mock interviews, AI code review, resume analysis, GitHub profile insights, and a LeetCode-style problem bank. Built with **Spring Boot 3** + **React 19** + **Google Gemini AI**.
> ---
## live :- https://ai-based-mock-interview-beta.vercel.app/

---

## 📸 Overview

An all-in-one developer toolkit designed to help engineers ace technical interviews. The platform leverages Google's Gemini AI model to provide intelligent code reviews, simulate real-time mock interviews, analyze resumes for ATS compatibility, and evaluate GitHub profiles — all from a single, beautiful dashboard.

---

## ✨ Features

### 🧠 AI-Powered Mock Interviews
- Start conversational interview sessions powered by **Gemini 2.0 Flash**
- Choose topics like System Design, DSA, Behavioral, etc.
- Real-time chat interface with AI interviewer
- Session history — revisit past interviews anytime
- End session and receive performance feedback

### 📝 AI Code Review
- Submit code in any language via an integrated **Monaco Editor**
- AI analyzes your code for correctness, efficiency, style, and edge cases
- Receive a structured review with scores, suggestions, and explanations
- Powered by Google Gemini with intelligent JSON parsing

### 📄 Resume Analyzer (ATS Score)
- Upload your resume as a **PDF** file
- Optionally provide a target job description for tailored analysis
- AI extracts text via **Apache PDFBox** and evaluates ATS compatibility
- Get an ATS score, strengths, weaknesses, and actionable improvement tips

### 🐙 GitHub Profile Analyzer
- Enter any GitHub username to get an AI-powered profile analysis
- Evaluates repositories, commit activity, language diversity, and contributions
- Provides an overall portfolio grade and improvement suggestions

### 💻 Problem Bank (LeetCode-style)
- Browse a curated list of coding problems with **pagination and sorting**
- Filter by difficulty: Easy, Medium, Hard
- View full problem details with descriptions and constraints
- Admin-only problem creation, editing, and deletion (role-based access)
- Seeded with starter problems via `ProblemSeeder`

### 📊 Code Submissions
- Submit solutions to problems
- Asynchronous processing via **Apache Kafka** (producer/consumer pattern)
- Track submission status and view history per user
- Full submission history page with filtering

### 📈 Analytics Dashboard
- Premium, developer-focused dashboard UI
- Interactive charts powered by **Recharts** (Line, Bar, Pie)
- Stats: problems solved, interview sessions, success rate, coding streak
- Topic analysis: strong vs. weak topics with mastery percentages
- AI-driven recommendations and upcoming roadmap tasks
- Mini insight previews for GitHub score and Resume ATS
- Smooth **Framer Motion** animations throughout

### 🔐 Authentication & Security
- JWT-based authentication (register, login, `/me` endpoint)
- Role-based access control: `USER` and `ADMIN` roles
- Protected routes on frontend with `ProtectedRoute` wrapper
- Spring Security with custom `JwtAuthenticationFilter`
- **Bucket4j** rate limiting interceptor for API protection

### 🌙 Theme Support
- System-aware light/dark mode via `ThemeProvider`
- Persistent theme preference stored in `localStorage`

---

## 🏗️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Java 21** | Language runtime |
| **Spring Boot 3.2.5** | Application framework |
| **Spring Security** | Authentication & authorization |
| **Spring Data JPA** | ORM / database access |
| **PostgreSQL 15** | Primary relational database |
| **Redis 7** | Caching layer |
| **Apache Kafka** | Async event streaming (submissions) |
| **Google Gemini AI** | AI model (code review, interviews, resume, GitHub analysis) |
| **Apache PDFBox** | PDF text extraction (resume parsing) |
| **JWT (jjwt 0.12.5)** | Token-based authentication |
| **Bucket4j** | API rate limiting |
| **Micrometer + Prometheus** | Metrics & monitoring |
| **Spring Boot Actuator** | Health checks & management endpoints |
| **Lombok** | Boilerplate reduction |
| **Logback** | Structured logging |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Build tool & dev server |
| **Tailwind CSS 3** | Utility-first CSS framework |
| **React Router v7** | Client-side routing |
| **Redux Toolkit** | Global state management |
| **TanStack React Query** | Server state & data fetching |
| **Recharts** | Interactive charts & data visualization |
| **Framer Motion** | Animations & transitions |
| **Monaco Editor** | In-browser code editor (VS Code engine) |
| **React Hook Form + Zod** | Form handling & validation |
| **Axios** | HTTP client |
| **Lucide React** | Icon library |
| **React Hot Toast** | Toast notifications |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Docker** | Containerized backend |
| **Docker Compose** | Multi-service orchestration |
| **Confluent Kafka + Zookeeper** | Event streaming infrastructure |

---

## 📁 Project Structure

```
ai_platform/
├── src/main/java/com/platform/ai_platform/
│   ├── AiPlatformApplication.java          # Entry point
│   ├── common/
│   │   ├── config/                         # SecurityConfig, RedisConfig, WebConfig, RateLimitInterceptor
│   │   ├── exception/                      # Global exception handling
│   │   └── security/                       # JwtService, JwtAuthFilter, UserDetailsService
│   └── modules/
│       ├── ai/          (controller, dto, service)        # AI Code Review
│       ├── analytics/   (controller, entity, repo, svc)   # Analytics & Metrics
│       ├── github/      (controller, dto, service)        # GitHub Analyzer
│       ├── iam/         (controller, dto, entity, repo, svc)  # Auth & User Management
│       ├── interview/   (controller, dto, entity, repo, svc)  # Mock Interviews
│       ├── notification/(service)                          # Notification Service
│       ├── problem/     (controller, dto, entity, repo, svc, seeder)  # Problem Bank
│       ├── resume/      (controller, dto, service)        # Resume Analyzer
│       └── submission/  (controller, dto, domain, kafka, repo, svc)   # Submissions + Kafka
├── src/main/resources/
│   ├── application.yml                     # App configuration
│   └── logback-spring.xml                  # Logging config
├── frontend_v2/
│   └── src/
│       ├── api/              # API client functions
│       ├── contexts/         # ThemeContext
│       ├── features/auth/    # Auth API logic
│       ├── hooks/            # Custom React hooks
│       ├── layouts/          # MainLayout (sidebar + topbar)
│       ├── lib/              # Utility functions
│       ├── pages/
│       │   ├── ai/           # CodeReviewPage
│       │   ├── auth/         # LoginPage, SignupPage
│       │   ├── dashboard/    # DashboardPage (charts, stats, recommendations)
│       │   ├── github/       # GithubAnalyzerPage
│       │   ├── interview/    # InterviewPage, InterviewChatPage
│       │   ├── problems/     # ProblemsListPage, ProblemDetailsPage, ProblemCreatePage
│       │   ├── resume/       # ResumePage
│       │   └── submissions/  # SubmissionHistoryPage
│       ├── routes/           # AppRoutes, ProtectedRoute
│       └── store/            # Redux store & slices
├── docker-compose.yml        # PostgreSQL, Redis, Kafka, Zookeeper, App
├── Dockerfile                # Multi-stage build (JDK 21)
└── pom.xml                   # Maven dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- **Java 21** (JDK)
- **Node.js 18+** & **npm**
- **Docker & Docker Compose** (for infrastructure services)
- **Google Gemini API Key**

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ai_platform.git
cd ai_platform
```

### 2. Start Infrastructure Services
```bash
docker-compose up -d postgres redis zookeeper kafka
```

This starts:
- **PostgreSQL** on port `5432`
- **Redis** on port `6379`
- **Zookeeper** on port `2181`
- **Kafka** on port `9092`

### 3. Configure Environment Variables
Set the following environment variables (or use defaults in `application.yml`):

```bash
export GEMINI_API_KEY=your_gemini_api_key_here
export JWT_SECRET=your_jwt_secret_here
```

### 4. Run the Backend
```bash
./mvnw spring-boot:run
```
Backend starts on **http://localhost:8081**

### 5. Run the Frontend
```bash
cd frontend_v2
npm install
npm run dev
```
Frontend starts on **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/v1/auth/register` | Register a new user | ❌ |
| `POST` | `/api/v1/auth/login` | Login & get JWT token | ❌ |
| `GET` | `/api/v1/auth/me` | Get current user profile | ✅ |
| `GET` | `/api/v1/problems` | List problems (paginated) | ❌ |
| `GET` | `/api/v1/problems/:id` | Get problem details | ❌ |
| `POST` | `/api/v1/problems` | Create a problem | ✅ Admin |
| `PUT` | `/api/v1/problems/:id` | Update a problem | ✅ Admin |
| `DELETE` | `/api/v1/problems/:id` | Delete a problem | ✅ Admin |
| `POST` | `/api/v1/submissions` | Submit code solution | ✅ |
| `GET` | `/api/v1/submissions/:id` | Get submission status | ✅ |
| `GET` | `/api/v1/submissions/user/:userId` | Get user's submissions | ✅ |
| `POST` | `/api/v1/ai/review` | AI code review | ✅ |
| `POST` | `/api/v1/interviews/start` | Start mock interview | ✅ |
| `POST` | `/api/v1/interviews/:sessionId/chat` | Send interview message | ✅ |
| `GET` | `/api/v1/interviews` | List user's sessions | ✅ |
| `GET` | `/api/v1/interviews/:sessionId/messages` | Get session messages | ✅ |
| `PUT` | `/api/v1/interviews/:sessionId/end` | End interview session | ✅ |
| `POST` | `/api/v1/resume/analyze` | Analyze resume PDF | ✅ |
| `GET` | `/api/v1/github/analyze/:username` | Analyze GitHub profile | ✅ |

---

## 🐳 Docker Deployment

Run the entire stack with a single command:

```bash
# Set your Gemini API key
export GEMINI_API_KEY=your_key_here

# Start all services
docker-compose up -d
```

This spins up: **App** (port 8080) + **PostgreSQL** + **Redis** + **Kafka** + **Zookeeper**

---

## 📊 Monitoring

The platform exposes Prometheus-compatible metrics via Spring Boot Actuator:

- **Health Check**: `GET /actuator/health`
- **Prometheus Metrics**: `GET /actuator/prometheus`
- **Application Info**: `GET /actuator/info`
- **All Metrics**: `GET /actuator/metrics`

---

## 🛡️ Security Features

- **JWT Authentication** with configurable expiration (default: 24 hours)
- **Role-Based Access Control** (USER / ADMIN)
- **Rate Limiting** via Bucket4j interceptor
- **CORS Configuration** for frontend-backend communication
- **Non-root Docker user** for container security
- **HikariCP** connection pooling with sensible limits

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ using Spring Boot, React, and Google Gemini AI
</p>
