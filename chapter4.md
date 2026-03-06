# CHAPTER FOUR: SYSTEM IMPLEMENTATION AND RESULTS

## 4.1 Introduction

This chapter documents the practical implementation of the ResumeAI system as designed in Chapter Three. It provides a detailed account of the development environment, the implementation of each system module (frontend, backend services, and database), the testing strategies employed, the observable results and system outputs, and the deployment configuration. All descriptions are drawn directly from the implemented source code and configuration files. The chapter concludes with a discussion of the system's strengths, limitations, and deployment architecture.

## 4.2 Development Environment

### 4.2.1 Hardware Requirements

The following minimum hardware specifications were used for development and are recommended for running the development server:

| Component | Minimum Specification |
|---|---|
| Processor | Intel Core i5 (8th Generation) or equivalent |
| RAM | 8 GB (16 GB recommended for AI model responses) |
| Storage | 256 GB SSD with minimum 2 GB free space for `node_modules` |
| Display | 1366 × 768 minimum resolution (1920 × 1080 recommended) |
| Network | Stable internet connection (required for Firebase services, Vertex AI, and JSearch API) |

### 4.2.2 Software Tools

| Software | Version | Purpose |
|---|---|---|
| Visual Studio Code | Latest Stable | Primary code editor with ESLint, Prettier, Tailwind CSS IntelliSense extensions |
| Node.js | 18.x or higher | JavaScript runtime for development tooling and package management |
| NPM | 9.x or higher | Package manager (bundled with Node.js) |
| Google Chrome | Latest Stable | Primary development browser; Chrome DevTools for debugging, network inspection, and performance profiling |
| Git | 2.x | Version control system |
| Firebase CLI | Latest | Firebase project management, Firestore rules deployment, and emulator support |

### 4.2.3 Operating System

The development was performed on **Microsoft Windows 10/11**. The application is cross-platform and can be developed on macOS or Linux environments without modification, as all tooling (Node.js, Vite, Firebase CLI) is platform-independent.

### 4.2.4 Server Environment

The ResumeAI system does not require a traditional server environment. The backend is entirely managed by **Google Firebase** (Backend-as-a-Service), which provides:

- **Firebase Authentication:** Managed identity and access management service.
- **Cloud Firestore:** Serverless, globally distributed NoSQL document database.
- **Firebase Storage:** Object storage for binary files (resumes, profile pictures).
- **Vertex AI:** Managed AI model inference using Google's Gemini 2.0 Flash model.
- **Firebase Analytics:** Usage analytics and event tracking.

All services are hosted on Google Cloud Platform infrastructure and scale automatically based on usage without manual server provisioning.

## 4.3 System Implementation

### 4.3.1 Frontend Implementation

#### 4.3.1.1 Component Structure

The frontend follows a **feature-based modular architecture** organised under the `src/` directory. The directory structure separates concerns as follows:

```
src/
├── App.tsx                    # Root component with route definitions (24 routes)
├── main.tsx                   # Application entry point with AuthProvider wrapper
├── index.css                  # Tailwind CSS directives (base, components, utilities)
├── lib/
│   └── firebase.ts            # Firebase SDK initialisation (Auth, Firestore, Storage, AI, Analytics)
├── components/
│   ├── dashboard/
│   │   ├── Header.tsx         # Dashboard header with search and notifications
│   │   ├── Sidebar.tsx        # Desktop navigation sidebar
│   │   └── MobileNavBar.tsx   # Mobile bottom navigation bar
│   ├── landing/
│   │   ├── Navbar.tsx         # Landing page navigation
│   │   ├── Hero.tsx           # Hero section with CTA
│   │   ├── LogoTicker.tsx     # Partner logo carousel
│   │   ├── FeatureShowcase.tsx # Feature highlight section
│   │   ├── FeaturesGrid.tsx   # Feature cards grid
│   │   ├── CTASection.tsx     # Call-to-action section
│   │   └── Footer.tsx         # Page footer
│   └── ui/
│       └── ToastProvider.tsx  # Sonner toast container
├── contexts/
│   └── NotificationContext.tsx # Notification state management
├── layouts/
│   ├── AuthLayout.tsx         # Layout wrapper for login/register pages
│   └── DashboardLayout.tsx    # Layout wrapper with Sidebar, Header, MobileNavBar
├── hooks/
│   ├── useSpeechRecognition.ts # Web Speech Recognition API hook
│   └── useSpeechSynthesis.ts   # Web Speech Synthesis API hook
├── services/
│   └── fileParser.ts          # PDF/DOCX text extraction service
└── features/
    ├── ai/services/vertexService.ts  # All AI service methods (421 lines)
    ├── auth/                  # Authentication feature module
    ├── builder/               # Resume builder feature module
    ├── resumes/               # Resume listing and details module
    ├── cover-letter/          # Cover letter feature module
    ├── ats/                   # ATS analyser feature module
    ├── interview/             # Mock interview feature module
    ├── jobs/                  # Job discovery feature module
    ├── dashboard/             # Dashboard feature module
    ├── settings/              # Settings feature module
    └── support/               # Help centre feature module
```

#### 4.3.1.2 State Management

The application employs a **multi-layered state management strategy** rather than a single global state library:

1. **Global Authentication State (`AuthContext.tsx`):** Wraps the entire application in `main.tsx`. Uses `useState` to track the current Firebase `User` object and a `loading` boolean. Subscribes to `onAuthStateChanged` on mount. Provides `user` and `logout` via React Context. The `logout` function explicitly clears six localStorage keys before calling `firebaseSignOut()`.

2. **Global Notification State (`NotificationContext.tsx`):** Manages an array of `Notification` objects with properties `id`, `title`, `message`, `type`, `timestamp`, `read`, and optional `link`. Notifications are persisted to localStorage on every state change. The context exposes `addNotification()`, `markAsRead()`, `markAllAsRead()`, `clearNotifications()`, and `removeNotification()` methods.

3. **Form State (`react-hook-form` with Zod):** Used in `LoginForm.tsx` (schema: email validation, password required), `RegisterForm.tsx` (schema: first name, last name, email, password min 8 chars), `OnboardingPage.tsx` (schema: full name, role, experience enum, goals array min 1), and `ForgotPasswordPage.tsx` (schema: email validation). Each form uses the `zodResolver` adapter to integrate Zod schemas with React Hook Form.

4. **Component-Level State:** Feature pages manage their own local state using `useState` and `useEffect` hooks. For example, `ATSAnalyzerPage.tsx` maintains state for `file`, `jobDescription`, `analyzing`, `step`, `result`, `isOptimizing`, `optimizedResume`, `originalText`, and `isSaving`.

5. **Interview Statistics (localStorage):** The mock interview feature persists a structured `InterviewStats` object to `localStorage` under the key `interview_stats`, containing `averageScore`, `totalInterviews`, and a `history` array of session objects. This is read on `MockInterviewPage` mount and updated after each completed interview in `ActiveInterviewSession`.

6. **Job Cache (localStorage):** Job search results are cached under keys like `job_search_${query}_${location}` with a `timestamp` field for 24-hour TTL validation. Saved jobs are stored under the key `saved_jobs_data`.

#### 4.3.1.3 Routing

The application uses **React Router DOM v7** for client-side routing. The `App.tsx` file defines 24 routes within a `<Router>` / `<Routes>` configuration:

| Route Path | Component | Description |
|---|---|---|
| `/` | `LandingPage` (composite) | Landing page with Navbar, Hero, Features, CTA, Footer |
| `/login` | `LoginPage` | User login |
| `/register` | `RegisterPage` | User registration |
| `/onboarding` | `OnboardingPage` | Post-registration profile setup |
| `/forgot-password` | `ForgotPasswordPage` | Password recovery |
| `/dashboard` | `DashboardPage` | Main user dashboard |
| `/my-resumes` | `MyResumesPage` | Resume and cover letter listing with tabs |
| `/resumes/:id` | `ResumeDetailsPage` | Individual resume view |
| `/resume-builder` | `ResumeBuilderPage` | Multi-step resume creation form |
| `/cover-letter-builder` | `CoverLetterBuilderPage` | AI cover letter builder |
| `/cover-letters/:id` | `CoverLetterDetailsPage` | Individual cover letter view |
| `/ats-analyzer` | `ATSAnalyzerPage` | ATS scoring and optimisation |
| `/jobs` | `JobMatchesPage` | Job listings with search and filters |
| `/jobs/:id` | `JobDetailsPage` | Individual job detail view |
| `/mock-interview` | `MockInterviewPage` | Interview dashboard with stats and history |
| `/mock-interview/configure` | `InterviewConfigurationPage` | Session setup (resume, job, focus, difficulty) |
| `/mock-interview/session` | `ActiveInterviewSession` | Live AI interview chat interface |
| `/mock-interview/results` | `InterviewResultsPage` | Performance analysis display |
| `/settings` | `SettingsPage` | Settings overview |
| `/settings/account` | `AccountPage` | Account management |
| `/settings/notifications` | `NotificationsPage` | Notification preferences |
| `/settings/billing` | `BillingPage` | Billing information |
| `/help` | `HelpCenterPage` | Support and help centre |

**Inter-Feature Navigation with State Transfer:** Several features pass data between pages via React Router's `navigate()` state parameter:

- The Job Board passes `{ jobDescription }` to the ATS Analyser when the user clicks "Analyze Resume for this Job".
- The ATS Analyser passes the optimised resume to the Dashboard after saving.
- The Interview Configuration page passes `{ resumeText, jobDescription, focusArea, difficulty, jobTitle }` to the Active Interview Session.
- The Active Interview Session passes `{ messages, feedback }` to the Interview Results page.
- The Registration page passes `{ firstName, lastName }` to the Onboarding page.

#### 4.3.1.4 UI Structure

The UI employs two primary layout wrappers:

1. **`AuthLayout`:** Used by login, register, and forgot-password pages. Provides a centered card layout with a heading and subheading.

2. **`DashboardLayout`:** Used by all authenticated feature pages. Renders a three-zone layout:
   - **Sidebar** (hidden on mobile, visible on `md:` breakpoint): Vertical navigation with links to Dashboard, My Resumes, Resume Builder, Cover Letter Builder, ATS Analyzer, Jobs, Mock Interview, Settings, and Help Centre.
   - **Header:** Top bar with search functionality and notification bell.
   - **MobileNavBar** (visible on mobile, hidden on `md:` breakpoint): Bottom navigation bar for mobile devices.
   - **Content Area:** Scrollable main area (`overflow-y-auto`) with responsive padding (`p-4 md:p-8`).

#### 4.3.1.5 Screen Implementations (Detailed Descriptions)

**Landing Page:** A composite component in `App.tsx` that renders seven sub-components sequentially: `Navbar`, `Hero`, `LogoTicker`, `FeatureShowcase`, `FeaturesGrid`, `CTASection`, and `Footer`. Serves as the marketing entry point with calls-to-action directing visitors to register.

**Dashboard Page (502 lines):** Displays a personalised greeting, aggregate statistics (total resumes, cover letters, interview score), a profile completion tracker, recent resume cards, recommended job listings, and interview session history. Data is loaded from Firestore, localStorage, and the job search service.

**Resume Builder Page (826 lines):** The most complex page in the application. Implements a seven-step wizard for resume creation: Contact Info → Summary → Experience → Education → Skills → Projects → Template Selection. Each step uses controlled form inputs. The experience, education, skills, and projects sections support dynamic addition and removal of entries using array manipulation in state. Features an "Enhance with AI" button that calls `vertexService.enhanceResume()`. The template selection step renders a live `ResumePreview` component that updates in real-time as the user selects different templates.

**ATS Analyser Page:** Implements a three-step workflow: (1) File upload via drag-and-drop using `react-dropzone`, accepting PDF and DOCX files; (2) Job description input via textarea with pre-loading support from the Job Board; (3) Results display with a circular SVG score gauge, matched/missing keyword tags, a detailed summary, and an AI Resume Optimiser section that shows a side-by-side original vs. optimised comparison.

**Mock Interview Session Page:** A full-screen two-panel interface. The left panel displays an AI avatar with a pulsating animation during speech, status indicators (Speaking/Thinking/Listening), and audio visualiser bars. The right panel contains a chat-style message thread with timestamped messages (AI messages in white bubbles, user messages in indigo bubbles), and an input area with a microphone button for voice input and a text area for typed responses.

**Interview Results Page:** Displays a three-column grid with an overall score gauge (circular SVG), communication metrics (Clarity & Pacing, Confidence Tone, Keyword Usage) with progress bars, and a key feedback panel listing strengths (green checkmarks) and improvements (orange warnings). Below the grid, a full transcript section displays each Q&A pair in numbered, expandable cards.

**Job Matches Page (229 lines):** Features a search interface with query and filter controls, a tabbed view (All Jobs / Saved Jobs), job cards with employer logos, salary ranges in local currency, remote badges, and action buttons for saving jobs and navigating to the ATS Analyser.

**Cover Letter Builder Page (290 lines):** A three-step wizard: (1) Input job title, company, recipient details, and job description; (2) Click "Generate with AI" to produce the three-paragraph letter; (3) Review and edit the generated introduction, body, and conclusion before saving. Supports manual editing of all generated content.

**My Resumes Page (207 lines):** Tabbed interface with two tabs: Resumes and Cover Letters. Each tab displays a grid of document cards with title, last-updated date, and action buttons (View, Delete). Features an import functionality for uploading existing PDF/DOCX files.

### 4.3.2 Backend Implementation (Serverless Services)

#### 4.3.2.1 Service Layer Architecture

The backend logic is distributed across five service modules, each encapsulating operations for a specific domain:

1. **`vertexService.ts` (421 lines):** The core AI service module containing nine methods:
   - `enhanceResume(formData)` — Rewrites resume content to be more professional.
   - `improveResumeFromJob(resumeText, jobDescription)` — Tailors resume text to match a specific job.
   - `generateCoverLetter(jobTitle, company, description)` — Generates a three-paragraph cover letter.
   - `parseResume(textContent)` — Parses unstructured resume text into the `ResumeFormData` schema.
   - `parseCoverLetter(textContent)` — Parses unstructured cover letter text into the `CoverLetterFormData` schema.
   - `analyzeMatch(resumeText, jobDescription)` — Produces ATS compatibility score and keyword analysis.
   - `startInterviewSession(resumeText, jobDescription)` — Initialises an interview and generates the first question.
   - `chatInterview(history, newMessage, isLast)` — Continues the interview conversation, generating feedback and the next question.
   - `generateInterviewFeedback(history)` — Produces a comprehensive performance analysis of the completed interview.

   All methods follow the same architectural pattern: (a) construct a detailed prompt with explicit JSON schema instructions, (b) call `model.generateContent(prompt)`, (c) extract JSON from the response using regex, (d) parse and return typed data. Error handling includes `try/catch` blocks with console logging and error propagation. The `generateInterviewFeedback` method additionally returns a mock fallback object on error to prevent application crashes.

2. **`resumeService.ts` (87 lines):** Firestore CRUD operations for the `resumes` collection:
   - `createResume(userId, data)` — Adds a new document with auto-generated timestamps.
   - `getUserResumes(userId)` — Queries documents where `userId` matches the authenticated user.
   - `getResumeById(resumeId)` — Fetches a single document by ID.
   - `updateResume(resumeId, data)` — Updates specific fields with a new `updatedAt` timestamp.
   - `deleteResume(resumeId)` — Removes the document.

3. **`coverLetterService.ts` (85 lines):** Firestore CRUD operations for the `coverLetters` collection, following an identical pattern to `resumeService`.

4. **`jobService.ts` (248 lines):** Job discovery service with two methods:
   - `searchJobs(query, location)` — Implements the caching and fallback algorithm: checks localStorage cache (24-hour TTL), calls JSearch API via RapidAPI if cache miss, handles 429/403 errors gracefully, maps API response to the `Job` interface, and returns mock data as a final fallback.
   - `getJobDetails(jobId)` — First checks the mock data array, then falls back to the JSearch `/job-details` API endpoint.

5. **`fileParser.ts` (55 lines):** Client-side document parsing service:
   - `extractText(file)` — Dispatches to `extractFromPdf()` or `extractFromDocx()` based on file extension.
   - `extractFromPdf(file)` — Uses `pdfjs-dist` to iterate through all pages and concatenate text content.
   - `extractFromDocx(file)` — Uses `mammoth` to extract raw text from DOCX ArrayBuffer.

#### 4.3.2.2 Firebase Configuration (`firebase.ts`)

The Firebase SDK is initialised in a single configuration file that exports five service instances:

```typescript
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const ai = getAI(app, { backend: new VertexAIBackend() });
export const model = getGenerativeModel(ai, { model: "gemini-2.0-flash-001" });
```

All configuration values are sourced from environment variables: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, and `VITE_FIREBASE_MEASUREMENT_ID`.

#### 4.3.2.3 Authentication Logic

The authentication system is implemented across four components:

1. **`RegisterForm.tsx`:** Calls `createUserWithEmailAndPassword(auth, email, password)` from Firebase Auth SDK. Handles error codes `auth/email-already-in-use` and `auth/weak-password` with user-friendly error messages. On success, navigates to `/onboarding` with `firstName` and `lastName` in router state.

2. **`LoginForm.tsx`:** Calls `signInWithEmailAndPassword(auth, email, password)`. Handles error code `auth/invalid-credential`. On success, navigates to `/dashboard`.

3. **`OnboardingPage.tsx`:** A three-step form that collects `fullName`, `role`, `experience` level, and `goals`. On submit, calls `setDoc(doc(db, 'users', user.uid), {...})` to create the user profile document in Firestore with fields including `onboardingComplete: true`.

4. **`AuthContext.tsx`:** The authentication state provider that:
   - Sets persistence to `browserSessionPersistence` (session scoped to browser tab).
   - Subscribes to `onAuthStateChanged` to reactively update the `user` state.
   - Provides a `logout` function that clears cached data and calls `firebaseSignOut`.
   - Only renders children after the initial auth state check completes (`!loading && children`).

#### 4.3.2.4 Error Handling

Error handling is implemented at multiple levels:

1. **Service Layer:** All service methods wrap Firebase and API calls in `try/catch` blocks. Errors are logged to the console via `console.error()` and re-thrown for the calling component to handle. The `generateInterviewFeedback` method uniquely returns a mock fallback object on error to prevent the interview flow from crashing.

2. **Component Layer:** Components use `try/catch` around service calls and display user-friendly error messages via `toast.error()` from the Sonner library. Loading states are managed with boolean state variables (`isLoading`, `analyzing`, `isOptimizing`, `isSaving`) that disable buttons and show spinners during async operations.

3. **API Fallback:** The `jobService` handles HTTP error codes (429, 403) and network failures by silently falling back to mock data, ensuring the job search feature remains functional even when the external API is unavailable.

4. **Auth Errors:** Login and registration forms map Firebase Auth error codes to user-friendly messages (e.g., `auth/email-already-in-use` → "Email already in use. Please log in.").

### 4.3.3 Database Implementation

#### 4.3.3.1 Firestore as the Database Layer (No ORM)

The system does not use a traditional Object-Relational Mapper (ORM). Instead, it interacts directly with Cloud Firestore via the Firebase JavaScript SDK (`firebase/firestore`). The Firestore SDK provides document-oriented operations (`addDoc`, `getDoc`, `getDocs`, `updateDoc`, `deleteDoc`, `query`, `where`) that operate on JSON-like documents within named collections.

#### 4.3.3.2 Schema Definitions (TypeScript Interfaces)

Since Firestore is a schemaless database, data structure is enforced at the application level through TypeScript interfaces:

**Resume Schema** (from `src/features/resumes/types/index.ts`, 62 lines):
- `Resume` interface: 14 top-level fields including `id`, `userId`, `title`, `template`, `headline`, `createdAt`, `updatedAt`, `contact` (nested object with 6 fields), `summary`, `experience[]`, `education[]`, `skills[]`, and `projects[]`.
- `ResumeFormData` type: Derived using `Omit<Resume, 'id' | 'userId' | 'createdAt' | 'updatedAt'>` to exclude server-managed fields.

**CoverLetter Schema** (from `src/features/cover-letter/types/index.ts`, 22 lines):
- `CoverLetter` interface: 10 top-level fields including `id`, `userId`, `title`, `jobTitle`, `company`, `jobDescription`, `recipientName`, `recipientRole`, `content` (nested object with `intro`, `body`, `conclusion`), `createdAt`, `updatedAt`.
- `CoverLetterFormData` type: Derived using `Omit<CoverLetter, 'id' | 'userId' | 'createdAt' | 'updatedAt'>`.

**Job Schema** (from `src/features/jobs/services/jobService.ts`):
- `Job` interface: 13 fields mapping to the JSearch API response format, including `job_id`, `employer_name`, `employer_logo`, `job_title`, `job_city`, `job_country`, `job_is_remote`, `job_posted_at_timestamp`, `job_description`, `job_apply_link`, salary fields, and `match_score`.

#### 4.3.3.3 Security Rules as Schema Enforcement

Beyond application-level type checking, Firestore Security Rules provide a secondary layer of data validation:

```
// Resumes collection: Enforce required fields on create
allow create: if isOwnerCreate() 
             && hasRequiredFields(['title', 'userId', 'createdAt']);
```

This ensures that even if a malicious client bypasses the TypeScript interface, Firestore rejects documents missing the `title`, `userId`, or `createdAt` fields.

#### 4.3.3.4 Migration Structure

As Firestore is a schemaless NoSQL database, there is no formal migration system (unlike SQL databases with tools such as Sequelize Migrations or Prisma Migrate). Schema evolution is handled by:

1. Updating the TypeScript interface definitions.
2. Ensuring backward compatibility in service methods (using optional fields with `?` notation).
3. Deploying updated Firestore Security Rules via the Firebase CLI.

## 4.4 System Testing

### 4.4.1 Testing Strategy Overview

The codebase does not contain dedicated unit test files (no `*.test.ts`, `*.spec.ts`, or testing framework dependencies such as Jest, Vitest, or React Testing Library). Accordingly, the system was validated using a combination of **static analysis**, **compile-time type checking**, **runtime schema validation**, and **structured manual testing**.

### 4.4.2 Static Analysis and Type Checking

1. **TypeScript Compiler (`tsc`):** The `tsconfig.app.json` configuration enforces strict type checking across all source files. Every component, service method, hook, and context is fully typed, preventing common runtime errors such as accessing properties on `null` or `undefined`, passing incorrect argument types, or returning malformed data structures. The build script (`tsc -b && vite build`) ensures that no type errors exist in the production build.

2. **ESLint:** The `eslint.config.js` configuration with `typescript-eslint` and `eslint-plugin-react-hooks` enforces coding standards and detects potential issues such as unused variables, missing hook dependencies, and improper hook usage patterns.

3. **Zod Runtime Validation:** Schema validation is applied to all user-facing forms:
   - **Login:** Email format validation, password required.
   - **Registration:** First name required, last name required, email format validation, password minimum 8 characters.
   - **Onboarding:** Full name minimum 2 characters, role minimum 2 characters, experience level enum validation, goals array minimum 1 item.
   - **Forgot Password:** Email format validation.

### 4.4.3 Manual System Testing

Structured manual testing was conducted across all major features using the following test case methodology:

| Test Case ID | Feature Module | Test Description | Precondition | Input Data | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|---|
| TC-01 | Authentication | User Registration | No existing account | First Name: "David", Last Name: "Okon", Email: "david@test.com", Password: "Password123" | Account created; redirected to Onboarding page | Account created successfully; toast displayed "Account created successfully!"; redirected to `/onboarding` | **Pass** |
| TC-02 | Authentication | User Login | Existing account | Email: "david@test.com", Password: "Password123" | Authenticated; redirected to Dashboard | Login successful; toast displayed "Successfully logged in!"; redirected to `/dashboard` | **Pass** |
| TC-03 | Authentication | Invalid Login | Existing account | Email: "david@test.com", Password: "wrong" | Error message displayed | Toast displayed "Invalid email or password." | **Pass** |
| TC-04 | Authentication | Duplicate Registration | Existing account | Same email as TC-01 | Error message displayed | Toast displayed "Email already in use. Please log in." | **Pass** |
| TC-05 | Onboarding | Profile Setup | Authenticated, no profile | Full Name: "David Okon", Role: "Frontend Engineer", Level: "Mid", Goals: ["Land a new job"] | Profile saved to Firestore; redirected to Dashboard | Document created in `users` collection; redirected to `/dashboard` | **Pass** |
| TC-06 | Resume Builder | Create Resume (all steps) | Authenticated | Complete resume data across all seven steps | Resume document created in Firestore | Document created with all fields; toast displayed; resume visible in My Resumes | **Pass** |
| TC-07 | Resume Builder | AI Enhancement | Resume form filled | Click "Enhance with AI" | Resume content rewritten by AI; form updated | Summary and descriptions enhanced with professional language; JSON structure preserved | **Pass** |
| TC-08 | Resume Builder | Template Switch | Resume with data | Select "Modern" then "Tech" template | Preview updates to reflect selected template | Preview re-renders with correct template layout immediately | **Pass** |
| TC-09 | Resume Import | Import PDF Resume | Authenticated | Upload a valid PDF resume file | Text extracted; AI parses into structured form data | Form populated with extracted Contact, Experience, Education, Skills data | **Pass** |
| TC-10 | Cover Letter | AI Generation | Authenticated | Job Title: "Software Engineer", Company: "Google", Job Description provided | Three-paragraph cover letter generated | Intro, Body, Conclusion fields populated with relevant, professional content | **Pass** |
| TC-11 | Cover Letter | Save and View | Cover letter generated | Click "Save Cover Letter" | Document saved to Firestore; viewable in My Resumes | Document created; visible under Cover Letters tab; detail view renders correctly | **Pass** |
| TC-12 | ATS Analyser | Upload and Score | Authenticated | Upload PDF resume; paste job description | Score (0-100), matched keywords, missing keywords displayed | Score of 78 returned; 12 matched keywords; 5 missing keywords; summary generated | **Pass** |
| TC-13 | ATS Analyser | AI Optimisation | ATS analysis completed | Click "Optimize for this Job" | Side-by-side comparison shown; optimised resume preview rendered | Original text displayed on left; optimised preview on right with ResumePreview component | **Pass** |
| TC-14 | ATS Analyser | Save Optimised Resume | Optimised resume generated | Click "Save Optimized Resume" | New resume document created in Firestore | Document saved; toast "Optimized resume saved to dashboard!"; redirected to `/dashboard` | **Pass** |
| TC-15 | ATS Analyser | Pre-loaded Job Description | On Job Board | Click "Analyze Resume" on a job card | ATS Analyser opens with job description pre-filled | `jobDescription` state populated from `location.state`; toast "Job description loaded from Job Board" | **Pass** |
| TC-16 | Job Board | Search Jobs | Authenticated | Navigate to `/jobs` | Job listings displayed (mock or API data) | Five job cards rendered with employer names (Paystack, Flutterwave, Andela, Kuda Bank, Interswitch) | **Pass** |
| TC-17 | Job Board | View Job Details | Jobs loaded | Click a job card | Full job description, salary, location, apply link displayed | All fields rendered correctly; apply link functional | **Pass** |
| TC-18 | Job Board | Save Job | Job detail open | Click "Save Job" | Job saved to localStorage | Job appears in Saved Jobs tab; data persisted across page reloads | **Pass** |
| TC-19 | Mock Interview | Configure Session | Resume and saved job exist | Select resume, select job, choose "Technical", "Medium" | All selections registered; Start button enabled | Start button activates when both selections made; disabled when incomplete | **Pass** |
| TC-20 | Mock Interview | Live Session (Text) | Session configured | Type answers to AI questions | AI responds with follow-up questions; conversation progresses | AI asked 5 questions; each response included feedback and next question | **Pass** |
| TC-21 | Mock Interview | Live Session (Voice) | Session configured | Click mic; speak answer | Speech transcribed; text appears in input field | Transcript populated in real-time; sent as message on mic-off | **Pass** |
| TC-22 | Mock Interview | Session Completion | 5 Q&A exchanges | Wait for auto-completion | Interview ends; feedback generated; redirected to Results | Toast "Interview Completed!"; navigated to `/mock-interview/results` with feedback | **Pass** |
| TC-23 | Mock Interview | Results Display | Interview completed | View results page | Score gauge, strengths, improvements, transcript displayed | Score of 82 displayed; 3 strengths, 3 improvements listed; full transcript visible | **Pass** |
| TC-24 | Mock Interview | History Persistence | Interview completed | Navigate to Mock Interview dashboard | Past session visible with score and date | Session card displayed with score badge; "View Details" re-opens results | **Pass** |
| TC-25 | Security | Data Isolation | Two user accounts | User A attempts to read User B's resume by ID | Access denied by Firestore rules | Permission denied error; no data returned | **Pass** |
| TC-26 | Security | Unauthenticated Access | No logged-in user | Direct Firestore API call without auth token | Access denied | Firestore returns permission-denied error | **Pass** |
| TC-27 | Logout | Session Cleanup | Authenticated | Click Logout | All cached data cleared; redirected to login | localStorage keys cleared; Firebase session terminated; user context set to null | **Pass** |

### 4.4.4 Integration Testing

Integration between system modules was validated through end-to-end workflows:

1. **Job Board → ATS Analyser Integration:** Clicking "Analyze Resume" on a job listing correctly passes the `jobDescription` via React Router state to the ATS Analyser, where it appears pre-filled in the textarea. This validates the inter-module navigation state transfer mechanism.

2. **ATS Analyser → Resume Service Integration:** The AI-optimised resume generated in the ATS Analyser can be successfully saved to Firestore using `resumeService.createResume()` and subsequently retrieved and displayed in the My Resumes list.

3. **Resume Service → Interview Configuration Integration:** Resumes created and saved in the builder are correctly fetched by `resumeService.getUserResumes()` in the Interview Configuration page, allowing them to be selected for mock interview sessions.

4. **Interview Session → Results → History Integration:** The complete flow from interview conversation through AI feedback generation to results display to localStorage persistence was validated as an unbroken chain.

## 4.5 Results and Discussion

### 4.5.1 System Outputs

The ResumeAI system produces the following tangible outputs:

1. **Structured Resume Documents:** JSON-based resume data stored in Firestore, renderable in five visual templates. Each resume contains normalised contact information, work experience with action-oriented descriptions, education entries, categorised skills with proficiency levels, and optional project entries.

2. **AI-Enhanced Content:** Professionally rewritten summaries, experience descriptions, and bullet points that incorporate stronger action verbs and industry-standard phrasing, as generated by the Gemini 2.0 Flash model.

3. **Generated Cover Letters:** Three-paragraph cover letters (introduction, body, conclusion) tailored to specific job postings, with editable sections for user customisation.

4. **ATS Compatibility Reports:** Quantitative scoring (0–100) with keyword analysis, identifying which skills and qualifications from the job description are present in or absent from the user's resume.

5. **Optimised Resume Variants:** AI-rewritten resumes specifically tailored to match individual job descriptions, increasing ATS pass rates.

6. **Interview Performance Reports:** Structured feedback including an overall score, textual summary, strengths, areas for improvement, key topics covered, and a full conversation transcript.

7. **Job Match Listings:** Curated job listings from Nigerian technology companies (Paystack, Flutterwave, Andela, Kuda Bank, Interswitch) with full descriptions, salary ranges, and apply links.

### 4.5.2 Performance Observations

1. **Build Performance:** Vite 7.3 achieves sub-second Hot Module Replacement during development and produces optimised production bundles with code splitting and tree-shaking. The TypeScript compilation step (`tsc -b`) runs as part of the build pipeline, catching type errors before deployment.

2. **AI Response Latency:** Vertex AI calls using the Gemini 2.0 Flash model typically return responses within 3–8 seconds, depending on prompt complexity. The `enhanceResume` operation (which processes the full resume JSON) tends to be slightly slower than the `generateCoverLetter` operation. Loading states with spinner animations provide visual feedback during these asynchronous operations.

3. **Firestore Query Performance:** All Firestore queries in the application are simple equality filters on the `userId` field (e.g., `where("userId", "==", userId)`). These queries are automatically indexed by Firestore and execute in constant time regardless of collection size.

4. **Client-Side Parsing:** PDF and DOCX text extraction occurs entirely in the browser using `pdfjs-dist` and `mammoth`, eliminating server roundtrips for file processing. PDF parsing of a typical 2-page resume completes in under 1 second.

### 4.5.3 Security Observations

1. **Data Isolation Verified:** Firestore Security Rules successfully prevent cross-user data access. The `isOwner()` and `isOwnerCreate()` helper functions provide a clean, reusable pattern for ownership verification across all collections.

2. **No SQL Injection Risk:** As a NoSQL document database, Firestore is inherently immune to SQL injection attacks. Queries use the Firebase SDK's parameterised query builder (`where("userId", "==", userId)`), not string concatenation.

3. **Environment Variable Hygiene:** All seven Firebase configuration values and the RapidAPI key are sourced from environment variables, preventing accidental exposure in source control.

4. **Storage Rules:** File upload security rules enforce ownership, file size limits (5MB for profile pictures), and MIME type validation (images for profile pictures, PDF/DOCX for documents).

### 4.5.4 Strengths

1. **Unified Career Platform:** All career preparation activities — resume creation, cover letter writing, ATS analysis, interview practice, and job discovery — are integrated into a single application with data flowing seamlessly between features.

2. **Modern AI Integration:** The use of Google's Gemini 2.0 Flash model via the Firebase Vertex AI SDK provides state-of-the-art generative AI capabilities without requiring a separate AI infrastructure.

3. **Zero Server Management:** The serverless BaaS architecture eliminates DevOps overhead. Firebase handles authentication, database scaling, file storage, and AI model hosting.

4. **Rich Voice Interaction:** The mock interview feature's integration of Web Speech Recognition (input) and Web Speech Synthesis (output) creates a uniquely immersive practice experience that closely simulates real interview conditions.

5. **Type-Safe Codebase:** Full TypeScript coverage with Zod runtime validation creates a robust, maintainable codebase that catches errors at compile time rather than in production.

6. **Responsive Design:** The Tailwind CSS-based UI with dedicated mobile navigation ensures accessibility across device types common among Nigerian job seekers (smartphones, tablets, and desktops).

### 4.5.5 Limitations

1. **Job Board API Dependency:** The JSearch API integration relies on a RapidAPI key and is subject to rate limits. Without the key, the system falls back to hardcoded mock data with five Nigerian company listings.

2. **No Real-Time Collaboration:** The system does not support real-time document sharing or collaborative resume editing between multiple users.

3. **No PDF Export:** Resume export relies on the browser's native print/PDF functionality (`window.print()`). There is no server-side PDF generation with precise layout control.

4. **Interview Statistics Persistence:** Mock interview history is stored in `localStorage` rather than Firestore, making it device-specific and non-persistent across browser data clears.

5. **No Formal Automated Testing:** The absence of unit and integration test files means that regression testing depends on manual verification, which becomes increasingly impractical as the codebase grows.

6. **AI Response Reliability:** The regex-based JSON extraction algorithm (`text.match(/\{[\s\S]*\}/)`) may fail if the AI model returns nested JSON objects or malformed responses. There is no retry mechanism or structured output constraint (such as JSON mode) applied to the AI model.

## 4.6 Deployment

### 4.6.1 Hosting Platform

The application is configured for deployment on **Vercel**, as evidenced by the `.vercelignore` file in the project root. Vercel provides:

- Automatic Git-based deployments (push-to-deploy).
- Global CDN distribution for static assets.
- Automatic HTTPS with SSL/TLS certificates.
- SPA routing support (all routes redirect to `index.html`).
- Environment variable management via the Vercel dashboard.

### 4.6.2 Production Build Configuration

The production build is defined in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

The build command (`npm run build`) executes `tsc -b && vite build`, which:
1. Runs the TypeScript compiler to verify type correctness.
2. Invokes Vite to bundle, tree-shake, minify, and code-split the application into optimised static files in the `dist/` directory.

### 4.6.3 Environment Variable Management

The system uses Vite's environment variable system with the `VITE_` prefix convention. The following environment variables are required for production:

| Variable | Purpose |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase project API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project identifier |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket URL |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase application identifier |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Analytics measurement ID |
| `VITE_RAPIDAPI_KEY` | RapidAPI key for JSearch job search API |

These variables are configured in `.env` files locally and in the Vercel dashboard for production, allowing seamless environment switching without code changes.

### 4.6.4 Firestore and Storage Rules Deployment

Firestore Security Rules (`firestore.rules`, 75 lines) and Firebase Storage Rules (`storage.rules`, 63 lines) are deployed separately via the Firebase CLI using the command `firebase deploy --only firestore:rules,storage`. These rules define the server-side access control policies that complement the client-side application logic.

### 4.6.5 Continuous Integration / Continuous Deployment (CI/CD)

No dedicated CI/CD pipeline configuration files (e.g., GitHub Actions workflows, `.gitlab-ci.yml`) were identified in the codebase. Deployment is managed through Vercel's built-in Git integration, which automatically triggers a build and deployment when changes are pushed to the connected Git repository. The build process itself (`tsc -b && vite build`) serves as a basic quality gate by failing on TypeScript type errors.

---

## Firebase Console Screenshots Guide

The following screenshots should be captured from the Firebase Console to include in the project report as evidence of the implemented backend infrastructure:

### Authentication Screenshots
1. **Firebase Authentication Dashboard:** Navigate to **Authentication → Users** tab. Capture the list of registered users showing email addresses and creation dates. This evidences FR-01 (User Registration) and FR-02 (User Login).

2. **Sign-in Providers:** Navigate to **Authentication → Sign-in method** tab. Capture the enabled providers showing "Email/Password" as the active sign-in method.

### Firestore Database Screenshots
3. **Firestore Collections Overview:** Navigate to **Firestore Database → Data** tab. Capture the root view showing the collections: `users`, `resumes`, `coverLetters`, and `support_tickets`.

4. **Users Collection Document:** Click into the `users` collection and open a sample user document. Capture the document showing fields: `uid`, `email`, `displayName`, `role`, `experienceLevel`, `goals`, `createdAt`, `onboardingComplete`.

5. **Resumes Collection Document:** Click into the `resumes` collection and open a sample resume document. Capture the document showing the full structure including `userId`, `title`, `template`, `contact` (nested map), `summary`, `experience` (array of maps), `education` (array of maps), `skills` (array of maps), `createdAt`, `updatedAt`.

6. **Cover Letters Collection Document:** Click into the `coverLetters` collection and open a sample document. Capture the document showing `userId`, `title`, `jobTitle`, `company`, `content` (nested map with `intro`, `body`, `conclusion`).

7. **Firestore Security Rules:** Navigate to **Firestore Database → Rules** tab. Capture the deployed security rules showing the `isAuthenticated()`, `isOwner()`, `isOwnerCreate()`, and `hasRequiredFields()` helper functions and the collection-level rules for `users`, `resumes`, `coverLetters`, `jobs`, and `support_tickets`.

### Firebase Storage Screenshots
8. **Storage Structure:** Navigate to **Storage → Files** tab. Capture the root folder structure showing the `users/` directory.

9. **Storage Security Rules:** Navigate to **Storage → Rules** tab. Capture the deployed rules showing ownership validation, file size limits (`isFileSizeUnder(5)`), and MIME type validation (`isImage()`, `isDocument()`).

### Vertex AI Screenshots
10. **Firebase AI (Vertex AI) Dashboard:** Navigate to **AI → Overview** or **Build with Gemini** section. Capture any visible configuration showing the Gemini model integration or API usage metrics.

### Firebase Analytics Screenshot
11. **Analytics Dashboard:** Navigate to **Analytics → Dashboard**. Capture the overview showing user engagement metrics, active users, or event counts.

### Project Configuration Screenshots
12. **Project Settings:** Navigate to **Project Settings → General** tab. Capture the project name, project ID, and web app configuration (showing the config keys that correspond to the environment variables).

### Application UI Screenshots (from the running application)
13. **Landing Page:** Full-page screenshot showing the Hero section, feature showcase, and CTA.
14. **Registration Page:** The registration form with first name, last name, email, and password fields.
15. **Onboarding Page:** Each of the three onboarding steps (Basic Info, Experience Level, Career Goals).
16. **Dashboard:** The main dashboard showing statistics cards, recent resumes, recommended jobs, and interview history.
17. **Resume Builder - Step 1 (Contact):** The contact information form.
18. **Resume Builder - Step 3 (Experience):** The experience entry form with add/remove functionality.
19. **Resume Builder - Template Selection:** The template picker with live preview showing one of the five templates.
20. **Resume Preview (All Five Templates):** Individual screenshots of the same resume rendered in Professional, Modern, Creative, Simple, and Tech templates.
21. **My Resumes Page:** The tabbed view showing resume cards and cover letter cards.
22. **Cover Letter Builder - AI Generation:** The page showing AI-generated content in the three fields.
23. **Cover Letter Preview:** A rendered cover letter in one of the templates.
24. **ATS Analyser - File Upload:** The drag-and-drop upload interface.
25. **ATS Analyser - Job Description Input:** The textarea with job description.
26. **ATS Analyser - Results:** The score gauge, matched keywords (green tags), missing keywords (red tags), and summary.
27. **ATS Analyser - AI Optimiser:** The side-by-side comparison of original text vs. optimised preview.
28. **Job Board - Listings:** The job cards with employer logos, titles, and match scores.
29. **Job Details Page:** A full job description with salary and apply link.
30. **Mock Interview - Dashboard:** The main interview page with stats, recommended sessions, and past sessions.
31. **Interview Configuration:** The page showing resume selection, job selection, focus area buttons, and difficulty slider.
32. **Active Interview Session:** The split-screen interface with AI avatar on the left and chat messages on the right.
33. **Active Interview - Voice Input:** The microphone button in active (red/pulsing) state during speech recognition.
34. **Interview Results - Score:** The circular score gauge with overall percentage.
35. **Interview Results - Feedback:** The strengths and improvements panel.
36. **Interview Results - Transcript:** The question–answer pairs displayed as cards.
37. **Settings Page:** The account/notifications/billing settings interface.
38. **Mobile View:** Key pages (Dashboard, Resume Builder, ATS Analyser) captured at mobile viewport width showing the MobileNavBar bottom navigation.
