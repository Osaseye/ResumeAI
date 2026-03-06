# CHAPTER THREE: SYSTEM ANALYSIS AND DESIGN

## 3.1 Introduction

This chapter presents a comprehensive analysis and design of the ResumeAI system — an intelligent, web-based career acceleration platform that leverages Generative Artificial Intelligence to assist job seekers in building professional resumes, generating tailored cover letters, analysing Applicant Tracking System (ATS) compatibility, practising for job interviews via AI-powered mock sessions, and discovering relevant employment opportunities. The chapter systematically examines the limitations of existing resume creation processes, defines the functional and non-functional requirements of the proposed system, describes the architectural and design decisions underpinning the implementation, models the system using standard software engineering diagrams, details the database schema, and documents the algorithms and development tools employed. Every assertion in this chapter is derived directly from the implemented codebase and configuration files of the ResumeAI project.

## 3.2 Analysis of the Existing System

### 3.2.1 Overview of the Existing Process

The traditional process of resume creation, cover letter writing, and job application preparation in Nigeria (and globally) is predominantly manual and fragmented. Job seekers typically rely on general-purpose word processors such as Microsoft Word or Google Docs to draft resumes. Interview preparation is conducted informally, often without structured feedback. Cover letters are written from scratch for each application or copied from generic online templates. There is no integrated workflow that connects resume creation to job matching, ATS analysis, or interview practice within a single environment.

### 3.2.2 Limitations of the Existing System

The following limitations were identified in the manual approach that the proposed system seeks to address:

1. **Lack of ATS Optimisation:** Most job seekers are unaware that their resumes are first screened by automated Applicant Tracking Systems. Manually created resumes frequently fail ATS keyword matching, resulting in qualified candidates being filtered out before a human reviewer sees their application. There is no mechanism for scoring a resume against a specific job description.

2. **Absence of AI-Powered Content Enhancement:** Traditional word processors provide spelling and grammar checks but do not offer intelligent, context-aware rewriting of professional summaries, experience descriptions, or skills sections. The quality of resume content depends entirely on the individual's writing ability and knowledge of industry conventions.

3. **Time-Intensive Tailoring:** Customising a resume and writing a unique cover letter for every job application is labor-intensive. Most job seekers resort to submitting a single generic resume to multiple employers, significantly reducing their chances of progressing through initial screening.

4. **No Structured Interview Practice:** Candidates preparing for job interviews have limited access to realistic practice environments. Traditional methods involve rehearsing with friends or reading sample questions online, neither of which provides real-time, personalised feedback on answer quality, tone, or keyword usage.

5. **Disconnected Workflow:** The existing process requires users to switch between multiple unrelated tools — a word processor for resume creation, a job board website for finding listings, a separate search for cover letter templates, and ad-hoc methods for interview preparation. This fragmentation results in inefficiency and lost context between activities.

6. **No Persistent Data Management:** Resumes and cover letters created in traditional tools are stored as static files. There is no structured data model that allows for rapid template switching, version control, or AI-driven analysis of career data across multiple documents.

## 3.3 Proposed System

### 3.3.1 System Purpose and Description

ResumeAI is a comprehensive, AI-driven career platform built as a Single Page Application (SPA) that unifies the end-to-end job application lifecycle into a single web-based dashboard. The system integrates Google's Gemini 2.0 Flash generative AI model (accessed via Firebase Vertex AI) to provide intelligent assistance across every stage of the job application process — from creating and optimising resumes, to generating cover letters, to practising for interviews with a conversational AI interviewer, to discovering and matching with relevant job opportunities.

### 3.3.2 Target Users

The primary target users of the system are:

1. **Fresh Graduates and Entry-Level Job Seekers** — Nigerian university graduates entering the job market who may lack experience in writing professional resumes and cover letters.
2. **Mid-Career Professionals** — Experienced professionals seeking to transition to new roles or companies who need to tailor their existing career data to specific job descriptions.
3. **Senior and Executive-Level Candidates** — Professionals at the senior and executive level (as supported by the onboarding flow's experience level selection) who require polished, ATS-optimised documentation.
4. **Career Changers** — Individuals switching industries who need AI assistance in translating their existing skills into the language of a new target domain.

### 3.3.3 Core Objectives

The system was designed to achieve the following objectives, each of which is directly implemented in the codebase:

1. **AI-Powered Resume Builder:** To provide a structured, multi-step resume creation interface with five professionally designed templates (Professional, Modern, Creative, Simple, and Tech), supporting full CRUD operations with persistent cloud storage in Firebase Firestore.

2. **Intelligent Content Enhancement:** To offer one-click AI enhancement of resume content using the Vertex AI `enhanceResume()` service method, which rewrites descriptions, summaries, and bullet points to be more impactful and professional.

3. **AI Cover Letter Generator:** To automatically generate structured, three-paragraph cover letters (introduction, body, conclusion) tailored to a specific job title, company, and job description using the `generateCoverLetter()` AI method.

4. **ATS Resume Analyser:** To provide a quantitative ATS compatibility score (0–100) by comparing an uploaded resume (PDF or DOCX) against a target job description, identifying matched and missing keywords, and offering an AI-powered resume optimisation feature that rewrites the resume to improve the match score.

5. **AI Mock Interview System:** To conduct realistic, conversational mock interviews using generative AI, supporting voice input (Web Speech Recognition API) and text-to-speech output (Web Speech Synthesis API), with configurable parameters including focus area (Behavioral, Technical, Mixed, System Design) and difficulty level (Easy, Medium, Hard), culminating in a detailed performance analysis report.

6. **Job Discovery and Matching:** To integrate with the JSearch API (via RapidAPI) for retrieving real-time job listings focused on the Nigerian tech market, with local caching and graceful fallback to curated mock data featuring companies such as Paystack, Flutterwave, Andela, Kuda Bank, and Interswitch.

7. **Document Import and Parsing:** To support the import of existing resumes and cover letters from PDF and DOCX files by extracting text using the `pdfjs-dist` and `mammoth` libraries, followed by AI-powered structured parsing via the `parseResume()` and `parseCoverLetter()` service methods.

### 3.3.4 Key Improvements Over Existing Methods

The following table summarises the improvements the ResumeAI system delivers over the manual approach:

| Aspect | Manual Approach | ResumeAI System |
|---|---|---|
| Resume Creation | Unstructured, error-prone formatting | Guided multi-step builder with five templates |
| Content Quality | Depends on writer's skill | AI-enhanced professional phrasing |
| ATS Compatibility | Unknown; no scoring mechanism | Quantitative score (0–100) with keyword analysis |
| Cover Letters | Written from scratch per application | AI-generated, job-specific in seconds |
| Interview Preparation | Unstructured, no real-time feedback | AI interviewer with voice support and scoring |
| Job Discovery | Separate job board websites | Integrated job feed with save and analyse actions |
| Data Persistence | Static files on local disk | Cloud-stored structured data in Firestore |

## 3.4 System Requirements

### 3.4.1 Functional Requirements

The functional requirements were extracted from the implemented page components, service modules, context providers, and routing configuration in the codebase. They are organised by feature module below.

#### 3.4.1.1 Authentication and User Management

1. **FR-01: User Registration.** The system shall allow new users to create an account using an email address and password (minimum 8 characters), validated using Zod schema validation. Implementation: `RegisterForm.tsx` using `createUserWithEmailAndPassword()` from Firebase Auth.

2. **FR-02: User Login.** The system shall allow registered users to sign in using email and password credentials. Implementation: `LoginForm.tsx` using `signInWithEmailAndPassword()`.

3. **FR-03: Password Recovery.** The system shall provide a password reset mechanism via email. Implementation: `ForgotPasswordPage.tsx`.

4. **FR-04: User Onboarding.** After registration, the system shall guide users through a three-step onboarding flow to collect their full name, target/current role, experience level (Entry, Mid, Senior, Executive), and career goals. This data is stored in the Firestore `users` collection. Implementation: `OnboardingPage.tsx`.

5. **FR-05: Session Management.** The system shall maintain authentication state using `browserSessionPersistence` (per browser tab), allowing multiple user sessions. On logout, the system shall clear all local cached data including dashboard stats, interview stats, and saved jobs. Implementation: `AuthContext.tsx`.

6. **FR-06: Auth State Observation.** The system shall reactively observe authentication state changes using Firebase's `onAuthStateChanged` listener and provide the current user object to all child components via React Context. Implementation: `AuthContext.tsx`.

#### 3.4.1.2 Resume Management

7. **FR-07: Multi-Step Resume Creation.** The system shall provide a guided, multi-step form for creating resumes with sections for Contact Information, Professional Summary, Work Experience, Education, Skills, and Projects. Implementation: `ResumeBuilderPage.tsx` (826 lines).

8. **FR-08: Resume CRUD Operations.** The system shall support creating, reading, updating, and deleting resume documents in Firestore. Implementation: `resumeService.ts` with methods `createResume()`, `getUserResumes()`, `getResumeById()`, `updateResume()`, and `deleteResume()`.

9. **FR-09: Template Selection.** The system shall offer five resume templates — Professional, Modern, Creative, Simple, and Tech — that users can select and switch between. Each template renders the same structured data with a different visual layout. Implementation: `ResumePreview.tsx` (296 lines with five template renderers).

10. **FR-10: AI Resume Enhancement.** The system shall allow users to enhance their resume content with a single click. The AI rewrites descriptions and summaries to be more compelling and professional while maintaining the same JSON structure. Implementation: `vertexService.enhanceResume()`.

11. **FR-11: Resume Import from File.** The system shall support importing existing resumes by uploading PDF or DOCX files. The system extracts text using `pdfjs-dist` (for PDFs) and `mammoth` (for DOCX), then uses AI to parse the unstructured text into a structured `ResumeFormData` object. Implementation: `fileParser.ts` and `vertexService.parseResume()`.

12. **FR-12: Resume Detail View.** The system shall display individual resumes with a full preview, template selector, and a recommended jobs section. Implementation: `ResumeDetailsPage.tsx`.

#### 3.4.1.3 Cover Letter Management

13. **FR-13: AI Cover Letter Generation.** The system shall generate a structured, three-paragraph cover letter (introduction, body, conclusion) based on user-provided job title, company name, and job description. Implementation: `vertexService.generateCoverLetter()`.

14. **FR-14: Manual Cover Letter Editing.** The system shall allow users to manually edit the generated introduction, body, and conclusion sections of the cover letter before saving. Implementation: `CoverLetterBuilderPage.tsx` Step 3 editing interface.

15. **FR-15: Cover Letter CRUD Operations.** The system shall support creating, reading, updating, and deleting cover letter documents in Firestore. Implementation: `coverLetterService.ts` with methods `createCoverLetter()`, `getUserCoverLetters()`, `getCoverLetterById()`, `updateCoverLetter()`, and `deleteCoverLetter()`.

16. **FR-16: Cover Letter Templates.** The system shall provide five cover letter templates (Professional, Modern, Creative, Simple, Tech) matching the resume templates. Implementation: `CoverLetterPreview.tsx` (175 lines).

17. **FR-17: Cover Letter Import.** The system shall support importing cover letters from PDF/DOCX files using AI parsing. Implementation: `vertexService.parseCoverLetter()`.

18. **FR-18: Cover Letter Print Support.** The system shall allow users to print or export cover letters using the browser's native print functionality. Implementation: `CoverLetterDetailsPage.tsx` with `window.print()`.

#### 3.4.1.4 ATS Resume Analyser

19. **FR-19: Resume Upload for Analysis.** The system shall accept PDF and DOCX file uploads via drag-and-drop or file browser for ATS analysis. Implementation: `ATSAnalyzerPage.tsx` using `react-dropzone`.

20. **FR-20: Job Description Input.** The system shall accept job descriptions either by manual text input or by pre-loading from the Job Board via React Router navigation state. Implementation: `ATSAnalyzerPage.tsx` with `location.state?.jobDescription`.

21. **FR-21: ATS Score Calculation.** The system shall produce a quantitative match score (0–100) comparing the uploaded resume against the target job description, identifying matched keywords, missing keywords, a textual summary, and the inferred role and company name. Implementation: `vertexService.analyzeMatch()`.

22. **FR-22: AI Resume Optimisation.** From the ATS results page, the system shall allow users to trigger an AI-powered resume rewrite that tailors the content specifically to the analysed job description. The system displays a side-by-side comparison of the original text and the optimised resume preview. Implementation: `ATSAnalyzerPage.tsx` `handleOptimize()` calling `vertexService.improveResumeFromJob()`.

23. **FR-23: Save Optimised Resume.** The system shall allow users to save the AI-optimised resume as a new document in Firestore. Implementation: `ATSAnalyzerPage.tsx` `handleSaveOptimized()`.

#### 3.4.1.5 AI Mock Interview

24. **FR-24: Interview Configuration.** The system shall allow users to configure a mock interview session by selecting a saved resume, a saved job, a focus area (Behavioral, Technical, Mixed, System Design), and a difficulty level (Easy, Medium, Hard). Implementation: `InterviewConfigurationPage.tsx`.

25. **FR-25: AI-Driven Conversational Interview.** The system shall conduct a multi-turn conversational interview where the AI acts as the interviewer, asking questions based on the user's resume and target job description. The interview proceeds through approximately five question-answer exchanges before automatically concluding. Implementation: `ActiveInterviewSession.tsx` with `vertexService.startInterviewSession()` and `vertexService.chatInterview()`.

26. **FR-26: Voice Input Support.** The system shall support voice-based answers using the Web Speech Recognition API, allowing users to speak their responses which are transcribed in real-time. Implementation: `useSpeechRecognition.ts` hook integrated in `ActiveInterviewSession.tsx`.

27. **FR-27: Text-to-Speech Output.** The system shall read AI interviewer messages aloud using the Web Speech Synthesis API, creating a realistic conversational experience. Implementation: `useSpeechSynthesis.ts` hook integrated in `ActiveInterviewSession.tsx`.

28. **FR-28: Interview Performance Analysis.** Upon interview completion, the system shall generate a detailed performance report including an overall score (0–100), a textual summary, an array of strengths, an array of areas for improvement, and key topics covered. Implementation: `vertexService.generateInterviewFeedback()`.

29. **FR-29: Interview Results Display.** The system shall display the performance analysis with a visual score gauge, communication metrics, key feedback points, and a full transcript of all question–answer pairs. Implementation: `InterviewResultsPage.tsx`.

30. **FR-30: Interview History and Statistics.** The system shall persist interview session history and aggregate statistics (average score, total interviews completed) using localStorage, displaying past sessions on the Mock Interview dashboard with the ability to review detailed results. Implementation: `MockInterviewPage.tsx` reading from `localStorage.getItem('interview_stats')`.

#### 3.4.1.6 Job Discovery

31. **FR-31: Job Search.** The system shall search for job listings using the JSearch API (RapidAPI) with query and location parameters, falling back to curated mock data when the API key is unavailable or rate limits are exceeded. Implementation: `jobService.ts` `searchJobs()`.

32. **FR-32: Job Caching.** The system shall cache job search results in localStorage with a 24-hour expiry to minimise API calls. Implementation: `jobService.ts` cache validation logic.

33. **FR-33: Job Detail View.** The system shall display detailed job information including employer name, logo, job title, location, remote status, salary range, full description, and an apply link. Implementation: `JobDetailsPage.tsx`.

34. **FR-34: Job Save for Interview.** The system shall allow users to save job listings to localStorage for subsequent use in configuring mock interview sessions. Implementation: `JobMatchesPage.tsx` saving to `localStorage.setItem('saved_jobs_data')`.

35. **FR-35: Job-to-ATS Bridge.** From any job listing, users shall be able to navigate directly to the ATS Analyser with the job description pre-loaded. Implementation: `JobMatchesPage.tsx` navigating with `{ state: { jobDescription } }`.

#### 3.4.1.7 Dashboard and Notifications

36. **FR-36: Dashboard Overview.** The system shall display an aggregated dashboard showing resume count, cover letter count, interview statistics, recommended jobs, and profile completion status. Implementation: `DashboardPage.tsx` (502 lines).

37. **FR-37: Notification System.** The system shall maintain an in-app notification system with support for success, error, info, and warning notifications, persisted in localStorage, with mark-as-read and clear functionality. Implementation: `NotificationContext.tsx`.

38. **FR-38: Toast Notifications.** The system shall display transient toast notifications for user actions (save success, AI completion, errors) using the Sonner library. Implementation: `ToastProvider.tsx` integrated across all feature pages.

#### 3.4.1.8 Settings and Support

39. **FR-39: Account Settings.** The system shall provide account management pages for profile editing, notification preferences, and billing information. Implementation: `AccountPage.tsx`, `NotificationsPage.tsx`, `BillingPage.tsx`.

40. **FR-40: Help Centre.** The system shall provide a support and help centre page. Implementation: `HelpCenterPage.tsx`.

### 3.4.2 Non-Functional Requirements

#### 3.4.2.1 Security

1. **NFR-01: Authentication Security.** The system implements Firebase Authentication with email/password credentials. Passwords are never stored or transmitted in plaintext; Firebase handles cryptographic hashing internally using industry-standard algorithms.

2. **NFR-02: Database Access Control.** Firestore Security Rules enforce row-level data isolation using three helper functions: `isAuthenticated()` (checks `request.auth != null`), `isOwner(userId)` (checks `request.auth.uid == userId`), and `isOwnerCreate()` (checks that the document being created has the correct `userId`). Additionally, `hasRequiredFields()` validates that new resume documents contain the mandatory fields `title`, `userId`, and `createdAt`.

3. **NFR-03: Storage Security.** Firebase Storage Rules enforce ownership-based access control for uploaded files (profile pictures, resume documents, cover letters). File uploads are constrained by size limits (`isFileSizeUnder(5)` for 5MB) and MIME type validation (`isImage()` and `isDocument()`). A default deny-all rule (`allow read, write: if false`) catches any unmatched paths.

4. **NFR-04: Environment Variable Protection.** All sensitive configuration values (Firebase API keys, project IDs, RapidAPI keys) are stored in environment variables prefixed with `VITE_` and accessed via `import.meta.env`, ensuring they are not hardcoded in source code.

5. **NFR-05: Session Isolation.** The authentication system uses `browserSessionPersistence`, which scopes authentication tokens to individual browser tabs. This prevents cross-tab session leakage and allows testing with multiple user accounts simultaneously.

6. **NFR-06: Secure Logout.** The logout function explicitly clears all cached data from localStorage (dashboard stats, interview stats, saved jobs, onboarding data) before calling `firebaseSignOut()`, preventing residual data exposure.

#### 3.4.2.2 Performance

7. **NFR-07: Client-Side Rendering with Vite.** The application uses Vite 7.3 as the build tool, which provides near-instant Hot Module Replacement (HMR) during development and optimised production bundles with code splitting, tree-shaking, and minification.

8. **NFR-08: API Response Caching.** Job search results are cached in localStorage with a 24-hour time-to-live (TTL), reducing redundant network requests to the RapidAPI endpoint.

9. **NFR-09: Graceful API Degradation.** The job service implements a comprehensive fallback strategy: if the RapidAPI key is missing, or if the API returns a 429 (rate limit) or 403 (forbidden) status, or if no results are returned, the system silently falls back to curated mock data, ensuring the user experience is never interrupted.

10. **NFR-10: Optimised AI Response Parsing.** All interactions with the Gemini AI model employ a consistent response parsing algorithm using regex extraction (`text.match(/\{[\s\S]*\}/)`), ensuring that even if the model wraps JSON in conversational text or markdown code blocks, the structured data is reliably extracted.

#### 3.4.2.3 Scalability

11. **NFR-11: Serverless Architecture.** The system uses a Backend-as-a-Service (BaaS) model with Firebase, eliminating the need to provision, manage, or scale servers. Firestore, Firebase Auth, and Firebase Storage scale automatically based on demand.

12. **NFR-12: Stateless Client.** The frontend application is fully stateless — all persistent data resides in Firestore or localStorage. The application can be deployed as static files to any CDN-backed hosting platform (Vercel, Netlify, Firebase Hosting) for global distribution.

#### 3.4.2.4 Maintainability

13. **NFR-13: Modular Feature Architecture.** The codebase is organised using a feature-based directory structure (`src/features/{feature-name}/`) where each feature module contains its own pages, components, services, hooks, and types. This promotes separation of concerns and allows independent development of features.

14. **NFR-14: Type Safety.** TypeScript is used throughout the entire codebase, with strict interface definitions for all data models (`Resume`, `CoverLetter`, `Job`, `Experience`, `Education`, `Skill`), component props, and service method signatures. This prevents runtime type errors and improves developer productivity through IDE autocompletion.

15. **NFR-15: Schema Validation.** Form inputs are validated at the component level using Zod schemas integrated with React Hook Form via the `zodResolver`, ensuring data integrity before Firestore writes.

#### 3.4.2.5 Usability

16. **NFR-16: Responsive Design.** The UI is built with Tailwind CSS using responsive utility classes (`md:`, `lg:` prefixes) and a dedicated mobile navigation bar (`MobileNavBar.tsx`), ensuring full functionality on mobile, tablet, and desktop screens.

17. **NFR-17: Accessible Voice Interface.** The mock interview feature supports both text-based and voice-based interaction, accommodating users with different input preferences and accessibility needs.

18. **NFR-18: Progressive Disclosure.** Complex workflows (resume creation, ATS analysis, interview configuration) are broken into discrete, numbered steps, reducing cognitive load and guiding users through multi-stage processes.

## 3.5 System Architecture

### 3.5.1 Architecture Pattern

The ResumeAI system adopts a **Serverless Client-Server Architecture** employing a **Backend-as-a-Service (BaaS)** model. Unlike traditional three-tier web applications that require a dedicated application server (Node.js/Express, Django, etc.), ResumeAI's frontend communicates directly with Firebase services via client-side SDKs. Security logic that would traditionally reside in server-side middleware is instead enforced declaratively via Firestore Security Rules and Firebase Storage Rules.

### 3.5.2 Frontend Architecture

The frontend is a React 19 Single Page Application (SPA) written entirely in TypeScript. It employs the following architectural patterns:

1. **Component-Based Architecture:** The UI is decomposed into reusable components organised under `src/components/` (shared UI elements) and `src/features/` (feature-specific components and pages).

2. **Feature-Based Module Organisation:** Each major feature (auth, resumes, cover-letter, ats, interview, jobs, dashboard, settings, support) is encapsulated in its own directory under `src/features/`, containing its page components, service layer, type definitions, custom hooks, and child components.

3. **Client-Side Routing:** React Router DOM v7 manages all navigation. The `App.tsx` file defines 24 distinct routes covering the landing page, authentication pages, the dashboard, feature pages, and settings pages. Navigation between features is achieved via `useNavigate()` with optional state transfer (e.g., passing job descriptions from the Job Board to the ATS Analyser).

4. **State Management Strategy:**
   - **Authentication State:** Managed globally via React Context (`AuthContext.tsx`) which wraps the entire application and provides the `user` object and `logout` function.
   - **Notification State:** Managed via a separate Context (`NotificationContext.tsx`) with localStorage persistence.
   - **Server Data:** No global state management library (Redux, Zustand) is used. Server data is fetched directly in page components using service functions, with the `@tanstack/react-query` library available for caching and synchronisation.
   - **Form State:** Managed locally in page components using `react-hook-form` with Zod schema validation.
   - **Interview Statistics:** Persisted in localStorage as a JSON object containing average score, total interview count, and session history.

5. **Layout System:** Two layout wrappers are implemented — `AuthLayout.tsx` for authentication pages (login, register, forgot password) and `DashboardLayout.tsx` for all authenticated pages. The dashboard layout includes a `Sidebar` (desktop), `Header`, and `MobileNavBar` (mobile).

### 3.5.3 Backend Structure (Firebase BaaS)

The backend consists entirely of managed Firebase services, initialised in `src/lib/firebase.ts`:

1. **Firebase Authentication:** Manages user identity, registration, login, password reset, and session persistence.
2. **Cloud Firestore:** A NoSQL document database storing users, resumes, cover letters, job matches, and support tickets.
3. **Firebase Storage:** Stores uploaded files (profile pictures, resume PDFs, cover letter documents) with ownership-based access rules and file type/size validation.
4. **Firebase AI (Vertex AI):** Provides access to the `gemini-2.0-flash-001` generative AI model for all AI features. The model is initialised using `getGenerativeModel(ai, { model: "gemini-2.0-flash-001" })` with the `VertexAIBackend`.
5. **Firebase Analytics:** Initialised for usage tracking via `getAnalytics(app)`.

### 3.5.4 Request Flow

A typical request flow through the system proceeds as follows:

1. **User Action:** The user interacts with a React component (e.g., clicking "Enhance with AI" on the Resume Builder page).
2. **Service Layer Call:** The component calls a function from the appropriate service module (e.g., `vertexService.enhanceResume(formData)`).
3. **Firebase SDK Communication:** The service function communicates directly with the Firebase service (Firestore for data operations, Vertex AI for AI operations) using the initialised SDK instances exported from `firebase.ts`.
4. **Security Enforcement:** For Firestore and Storage operations, Firebase evaluates the declarative security rules against the request's `auth` token. If the rules evaluate to `false`, the request is denied with a permission error.
5. **Response Processing:** The service function processes the response (e.g., parsing AI-generated JSON from a text response) and returns typed data to the calling component.
6. **UI Update:** The React component updates its local state, triggering a re-render to reflect the new data.

### 3.5.5 Technology Stack and Justifications

| Technology | Role | Justification |
|---|---|---|
| React 19 | Frontend Framework | Component-based architecture, large ecosystem, strong TypeScript support |
| TypeScript | Programming Language | Compile-time type checking prevents runtime errors, improves maintainability |
| Vite 7.3 | Build Tool | Fastest available HMR, optimised production builds via Rollup |
| Tailwind CSS 3.4 | Styling Framework | Utility-first approach enables rapid UI development without CSS file management |
| Firebase Auth | Authentication | Managed authentication service eliminates need for custom auth server |
| Cloud Firestore | Database | Serverless NoSQL with real-time capabilities, automatic scaling, and declarative security |
| Firebase Storage | File Storage | Secure, scalable binary storage with ownership-based access rules |
| Vertex AI (Gemini 2.0 Flash) | Generative AI | Fast inference speed suitable for interactive features, integrated with Firebase SDK |
| React Router DOM v7 | Routing | Industry-standard client-side routing for SPAs |
| React Hook Form + Zod | Form Management | Performant form handling with compile-time and runtime validation |
| pdfjs-dist | PDF Parsing | Client-side PDF text extraction without server dependency |
| mammoth | DOCX Parsing | Client-side Word document text extraction |
| Web Speech API | Voice I/O | Browser-native speech recognition and synthesis without third-party services |
| Sonner | Toast Notifications | Lightweight, elegant notification library |
| Lucide React | Icons | Consistent, open-source icon set |
| JSearch (RapidAPI) | Job Search API | Comprehensive job listing aggregation with Nigerian market coverage |

## 3.6 System Design Models

### 3.6.1 Use Case Diagram Description

The system identifies one primary actor and one external system actor:

**Primary Actor: Job Seeker (Authenticated User)**

The Job Seeker interacts with the following use cases:

1. **Register Account** — Creates a new account with email and password.
2. **Complete Onboarding** — Provides personal details, experience level, and career goals.
3. **Log In / Log Out** — Authenticates or terminates a session.
4. **Reset Password** — Initiates a password recovery via email.
5. **Create Resume** — Fills a multi-step form to build a structured resume.
6. **Import Resume** — Uploads a PDF/DOCX file that is parsed into structured data by AI.
7. **Enhance Resume with AI** — Triggers AI rewriting of resume content.
8. **Select Resume Template** — Chooses from five visual templates.
9. **View / Edit / Delete Resume** — Performs CRUD operations on saved resumes.
10. **Create Cover Letter** — Enters job details and triggers AI generation.
11. **Import Cover Letter** — Uploads a PDF/DOCX file parsed by AI.
12. **View / Edit / Delete Cover Letter** — Performs CRUD operations on saved cover letters.
13. **Analyse Resume (ATS)** — Uploads resume and pastes job description for ATS scoring.
14. **Optimise Resume for Job** — Triggers AI rewrite from ATS results to improve match score.
15. **Save Optimised Resume** — Persists the AI-optimised resume to Firestore.
16. **Search Jobs** — Queries the job API for available positions.
17. **View Job Details** — Reads full job description and requirements.
18. **Save Job** — Bookmarks a job for later use in interview configuration.
19. **Analyse Job from Board** — Navigates to ATS Analyser with job description pre-loaded.
20. **Configure Mock Interview** — Selects resume, job, focus area, and difficulty.
21. **Conduct Mock Interview** — Engages in conversational Q&A with the AI interviewer.
22. **Receive Interview Feedback** — Views performance score, strengths, and improvements.
23. **Review Interview History** — Views past session results from the interview dashboard.
24. **View Dashboard** — Accesses aggregated statistics and quick actions.
25. **Manage Notifications** — Views, reads, and clears in-app notifications.
26. **Access Settings** — Manages account details, notification preferences, and billing.

**External System Actor: Google Gemini AI (via Vertex AI)**

The AI model participates in the following use cases as a secondary actor:

- Enhances resume content (invoked by Use Case 7).
- Generates cover letter content (invoked by Use Case 10).
- Parses uploaded documents into structured data (invoked by Use Cases 6 and 11).
- Analyses ATS match score (invoked by Use Case 13).
- Optimises resume for job (invoked by Use Case 14).
- Conducts interview conversation (invoked by Use Case 21).
- Generates interview feedback (invoked by Use Case 22).

**External System Actor: JSearch API (via RapidAPI)**

- Returns job listings for search queries (invoked by Use Case 16).
- Returns job details by ID (invoked by Use Case 17).

### 3.6.2 Class Diagram Description

The key data classes (TypeScript interfaces) and their attributes are as follows:

**Resume**
- `id: string` (Document ID, primary key)
- `userId: string` (Foreign key referencing the User)
- `title: string`
- `template: 'professional' | 'modern' | 'creative' | 'simple' | 'tech'`
- `headline: string`
- `createdAt: string` (ISO timestamp)
- `updatedAt: string` (ISO timestamp)
- `contact: ContactInfo` (Embedded object)
- `summary: string`
- `experience: Experience[]` (Embedded array)
- `education: Education[]` (Embedded array)
- `skills: Skill[]` (Embedded array)
- `projects: Project[]` (Embedded array, optional)

**ContactInfo** (Embedded in Resume)
- `fullName: string`
- `email: string`
- `phone: string`
- `location: string`
- `linkedin: string` (optional)
- `website: string` (optional)

**Experience** (Embedded in Resume)
- `id: string`
- `company: string`
- `role: string`
- `location: string`
- `startDate: string`
- `endDate: string`
- `current: boolean`
- `description: string`

**Education** (Embedded in Resume)
- `id: string`
- `school: string`
- `degree: string`
- `field: string`
- `location: string`
- `startDate: string`
- `endDate: string`
- `current: boolean`

**Skill** (Embedded in Resume)
- `id: string`
- `name: string`
- `level: 'Beginner' | 'Intermediate' | 'Expert'`

**CoverLetter**
- `id: string` (Document ID, primary key)
- `userId: string` (Foreign key referencing the User)
- `title: string`
- `jobTitle: string`
- `company: string`
- `jobDescription: string` (optional)
- `recipientName: string` (optional)
- `recipientRole: string` (optional)
- `content: CoverLetterContent` (Embedded object)
- `createdAt: string`
- `updatedAt: string`

**CoverLetterContent** (Embedded in CoverLetter)
- `intro: string`
- `body: string`
- `conclusion: string`

**Job** (from JSearch API / Mock data)
- `job_id: string`
- `employer_name: string`
- `employer_logo: string` (optional)
- `job_title: string`
- `job_city: string`
- `job_country: string`
- `job_is_remote: boolean`
- `job_posted_at_timestamp: number`
- `job_description: string`
- `job_apply_link: string`
- `job_min_salary: number` (optional)
- `job_max_salary: number` (optional)
- `job_salary_currency: string` (optional)
- `match_score: number` (Application-calculated, optional)

**Relationships:**
- A User **has many** Resumes (1:N via `userId` field).
- A User **has many** CoverLetters (1:N via `userId` field).
- A Resume **contains** multiple Experience, Education, Skill, and Project entries (composition/embedding).
- A CoverLetter **contains** one CoverLetterContent (composition/embedding).

### 3.6.3 Sequence Diagram Descriptions

#### Sequence 1: User Login Flow

1. User enters email and password on the Login page.
2. `LoginForm` component calls `signInWithEmailAndPassword(auth, email, password)`.
3. Firebase Auth validates credentials against its user store.
4. Firebase Auth returns a `User` object with authentication token.
5. `AuthContext`'s `onAuthStateChanged` listener fires, updating the context's `user` state.
6. The React component tree re-renders; `LoginForm` calls `navigate('/dashboard')`.
7. `DashboardPage` loads and displays the user's aggregated data.

#### Sequence 2: ATS Analysis and Resume Optimisation Flow

1. User uploads a PDF/DOCX resume file on `ATSAnalyzerPage` (Step 1).
2. User enters/pre-loads a job description (Step 2) and clicks "Analyze Resume".
3. `handleAnalyze()` calls `fileParser.extractText(file)` to extract text from the uploaded document.
4. `fileParser` uses `pdfjs-dist` (for PDF) or `mammoth` (for DOCX) to return raw text.
5. `handleAnalyze()` calls `vertexService.analyzeMatch(resumeText, jobDescription)`.
6. `vertexService` constructs a prompt instructing the AI to return a JSON object with `score`, `matchedKeywords`, `missingKeywords`, `summary`, `role`, and `company`.
7. The Gemini model processes the prompt and returns a text response.
8. `vertexService` extracts JSON using regex and returns the parsed `ATSAnalysisResult`.
9. The UI renders the score gauge, keyword tags, and detailed analysis (Step 3).
10. User clicks "Optimize for this Job".
11. `handleOptimize()` calls `vertexService.improveResumeFromJob(originalText, jobDescription)`.
12. The AI returns a rewritten `ResumeFormData` object tailored to the job.
13. The UI displays a side-by-side comparison: original text vs. optimised resume preview.
14. User clicks "Save Optimized Resume".
15. `resumeService.createResume(userId, optimizedResume)` saves the document to Firestore.
16. User is navigated to the Dashboard.

#### Sequence 3: AI Mock Interview Flow

1. User navigates to Interview Configuration page and selects a resume and a saved job.
2. `handleStart()` formats the resume data into a text string and constructs a job description string.
3. User is navigated to `ActiveInterviewSession` with `resumeText`, `jobDescription`, `focusArea`, `difficulty`, and `jobTitle` in router state.
4. `initSession()` calls `vertexService.startInterviewSession(resumeText, jobDescription)`.
5. The AI returns an opening message with the first interview question.
6. The message is added to the chat UI, and `useSpeechSynthesis.speak()` reads it aloud.
7. User responds via voice (`useSpeechRecognition`) or text input.
8. `handleSendMessage()` calls `vertexService.chatInterview(history, userMessage, isLastQuestion)`.
9. The AI returns a response with feedback on the answer and the next question (or a closing remark if `isLastQuestion` is true).
10. After approximately five exchanges, the interview concludes.
11. `finishInterview()` calls `vertexService.generateInterviewFeedback(fullHistory)`.
12. The AI returns a feedback object with `score`, `summary`, `strengths`, `improvements`, and `keyTopics`.
13. Statistics are updated and persisted to localStorage.
14. User is navigated to `InterviewResultsPage` with the messages and feedback in router state.

### 3.6.4 Activity Diagram Description: Resume Builder Workflow

1. **Start** → User navigates to `/resume-builder`.
2. **Decision: Import or Create?** → If the user uploads a file, the system extracts text and calls `vertexService.parseResume()` to auto-populate the form. Otherwise, the user fills the form manually.
3. **Step 1: Contact Information** → User enters full name, email, phone, location, LinkedIn, and website.
4. **Step 2: Professional Summary** → User writes or edits a summary paragraph.
5. **Step 3: Work Experience** → User adds one or more experience entries with company, role, dates, and description. User can add or remove entries dynamically.
6. **Step 4: Education** → User adds education entries with school, degree, field, dates.
7. **Step 5: Skills** → User adds skills with name and proficiency level (Beginner, Intermediate, Expert).
8. **Step 6: Projects** (optional) → User adds project entries with name, description, and URL.
9. **Decision: Enhance with AI?** → If the user clicks "Enhance with AI", the system calls `vertexService.enhanceResume(formData)` and updates the form with the improved content.
10. **Step 7: Template Selection** → User selects one of five templates. The preview updates in real-time.
11. **Save** → `resumeService.createResume(userId, formData)` writes the document to Firestore.
12. **End** → User is navigated to the Dashboard or Resume Details page.

### 3.6.5 Entity-Relationship Diagram Description

Since the system uses Firestore (a NoSQL document database), the ER model describes document collections and their logical relationships:

**Entities:**

1. **User** (Collection: `users`, Document Key: `userId`)
   - Attributes: `uid`, `email`, `displayName`, `role`, `experienceLevel`, `goals[]`, `createdAt`, `onboardingComplete`

2. **Resume** (Collection: `resumes`, Document Key: auto-generated)
   - Attributes: `userId` (FK), `title`, `template`, `headline`, `contact{}`, `summary`, `experience[]`, `education[]`, `skills[]`, `projects[]`, `createdAt`, `updatedAt`

3. **CoverLetter** (Collection: `coverLetters`, Document Key: auto-generated)
   - Attributes: `userId` (FK), `title`, `jobTitle`, `company`, `jobDescription`, `recipientName`, `recipientRole`, `content{intro, body, conclusion}`, `createdAt`, `updatedAt`

4. **SupportTicket** (Collection: `support_tickets`, Document Key: auto-generated)
   - Attributes: `userId` (FK), plus ticket-specific fields

**Relationships:**
- User **1 ── ∞** Resume (One user has many resumes; linked by `userId`)
- User **1 ── ∞** CoverLetter (One user has many cover letters; linked by `userId`)
- User **1 ── ∞** SupportTicket (One user has many support tickets; linked by `userId`)

## 3.7 Database Design

### 3.7.1 Database Technology

The system uses **Google Cloud Firestore**, a fully managed, serverless, NoSQL document-oriented database. Unlike relational databases, Firestore does not use tables, rows, or columns. Data is organised into **collections** (analogous to tables) containing **documents** (analogous to rows), where each document stores data as a set of key-value **fields** (analogous to columns). Documents can contain nested objects (maps) and arrays, enabling a denormalised data model.

### 3.7.2 Collection Definitions

#### Collection 1: `users`

| Field | Type | Required | Description |
|---|---|---|---|
| `uid` | String | Yes | Firebase Auth UID (matches document ID) |
| `email` | String | Yes | User's email address |
| `displayName` | String | Yes | User's full name (from onboarding) |
| `role` | String | Yes | Current or target job role |
| `experienceLevel` | String (Enum) | Yes | One of: entry, mid, senior, executive |
| `goals` | Array of Strings | Yes | Selected career goals |
| `createdAt` | String (ISO) | Yes | Account creation timestamp |
| `onboardingComplete` | Boolean | Yes | Whether onboarding was completed |

- **Document ID:** Set to the user's Firebase Auth `uid`.
- **Security Rule:** Only the document owner (`isOwner(userId)`) can read or write.

#### Collection 2: `resumes`

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | String | Yes | Reference to owning user's `uid` |
| `title` | String | Yes | Resume title (e.g., "Software Engineer Resume") |
| `template` | String (Enum) | No | One of: professional, modern, creative, simple, tech |
| `headline` | String | No | Professional headline |
| `contact` | Map | Yes | Nested: `fullName`, `email`, `phone`, `location`, `linkedin`, `website` |
| `summary` | String | Yes | Professional summary paragraph |
| `experience` | Array of Maps | Yes | Each entry: `id`, `company`, `role`, `location`, `startDate`, `endDate`, `current`, `description` |
| `education` | Array of Maps | Yes | Each entry: `id`, `school`, `degree`, `field`, `location`, `startDate`, `endDate`, `current` |
| `skills` | Array of Maps | Yes | Each entry: `id`, `name`, `level` |
| `projects` | Array of Maps | No | Each entry: `id`, `name`, `description`, `url` |
| `createdAt` | String (ISO) | Yes | Document creation timestamp |
| `updatedAt` | String (ISO) | Yes | Last modification timestamp |

- **Document ID:** Auto-generated by Firestore.
- **Security Rule:** Create requires `isOwnerCreate()` and `hasRequiredFields(['title', 'userId', 'createdAt'])`. Read/Update/Delete requires `isOwner(resource.data.userId)`.

#### Collection 3: `coverLetters`

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | String | Yes | Reference to owning user's `uid` |
| `title` | String | Yes | Cover letter title |
| `jobTitle` | String | Yes | Target job title |
| `company` | String | Yes | Target company name |
| `jobDescription` | String | No | Full job description text |
| `recipientName` | String | No | Hiring manager name |
| `recipientRole` | String | No | Hiring manager role |
| `content` | Map | Yes | Nested: `intro`, `body`, `conclusion` |
| `createdAt` | String (ISO) | Yes | Document creation timestamp |
| `updatedAt` | String (ISO) | Yes | Last modification timestamp |

- **Security Rule:** Create requires `isOwnerCreate()`. Read/Update/Delete requires `isOwner(resource.data.userId)`.

#### Collection 4: `support_tickets`

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | String | Yes | Reference to owning user's `uid` |
| (Additional fields) | — | — | Ticket-specific data |

- **Security Rule:** Create requires `isOwnerCreate()`. Read requires `isOwner(resource.data.userId)`. Write (update/delete) is not permitted by users.

### 3.7.3 Normalisation Level

The database employs a **First Normal Form (1NF) denormalised** design, which is the conventional approach for NoSQL document databases. Resume-related data (experience, education, skills, projects) is embedded directly within the Resume document as arrays of maps, rather than being stored in separate sub-collections. Similarly, cover letter content (intro, body, conclusion) is embedded as a nested map within the CoverLetter document. This design optimises read performance by ensuring that a single Firestore read retrieves all data associated with a resume or cover letter, eliminating the need for joins or multiple queries. The trade-off is increased write cost when updating individual sub-items, which is acceptable for the system's write-light, read-heavy usage pattern.

## 3.8 System Flow / Algorithms

### 3.8.1 AI Response Parsing Algorithm

All nine methods in `vertexService.ts` follow the same AI interaction pattern:

```
Algorithm: AI_RESPONSE_PARSING(prompt)
Input: A natural language prompt string with embedded JSON schema instructions
Output: A parsed JavaScript object

1. Send prompt to Gemini model via model.generateContent(prompt)
2. Receive raw text response from result.response.text()
3. Execute regex extraction: jsonMatch = text.match(/\{[\s\S]*\}/)
4. IF jsonMatch is null THEN
     THROW "Failed to parse AI response as JSON"
5. ELSE
     parsed = JSON.parse(jsonMatch[0])
     RETURN parsed
6. END IF
```

This algorithm is critical because generative AI models may return JSON wrapped in markdown code blocks, conversational preamble, or trailing explanations. The regex `\{[\s\S]*\}` greedily matches the first opening brace to the last closing brace, extracting the complete JSON object regardless of surrounding text.

### 3.8.2 ATS Keyword Matching Algorithm

The `analyzeMatch()` method implements the following logical flow:

1. The resume text and job description are passed to the Gemini model.
2. The prompt instructs the model to act as an "ATS simulation engine."
3. The model compares the vocabulary, skills, and experience descriptions in the resume against the requirements in the job description.
4. The model returns: (a) a numeric `score` (0–100), (b) an array of `matchedKeywords` found in the resume, (c) an array of `missingKeywords` absent from the resume but present in the JD, (d) a textual `summary`, and (e) inferred `role` and `company`.
5. The frontend renders the score as a circular progress indicator with colour coding: green (≥80), yellow (≥60), red (<60).

### 3.8.3 Mock Interview Conversation Algorithm

```
Algorithm: MOCK_INTERVIEW_SESSION
Input: resumeText, jobDescription, focusArea, difficulty
Output: Performance feedback report

1. CALL vertexService.startInterviewSession(resumeText, jobDescription)
2. Speak AI's opening message and first question via TTS
3. SET aiMessageCount = 1
4. WHILE aiMessageCount < 5 DO
     a. CAPTURE user response via voice (Speech Recognition) or text input
     b. ADD user message to message history
     c. SET isLastQuestion = (aiMessageCount >= 5)
     d. CALL vertexService.chatInterview(history, userMessage, isLastQuestion)
     e. ADD AI response to message history
     f. Speak AI response via TTS
     g. INCREMENT aiMessageCount
5. END WHILE
6. CALL vertexService.generateInterviewFeedback(fullHistory)
7. SAVE {score, summary, jobTitle} to localStorage interview_stats
8. NAVIGATE to InterviewResultsPage with messages and feedback
```

### 3.8.4 Job Search with Caching and Fallback Algorithm

```
Algorithm: JOB_SEARCH(query, location)
Input: Search query string, location string (default "Nigeria")
Output: Array of Job objects

1. COMPUTE cacheKey = "job_search_" + query + "_" + location
2. READ cached data from localStorage using cacheKey
3. IF cached data exists AND (current time - cached timestamp) < 24 hours THEN
     RETURN cached jobs
4. END IF
5. READ apiKey from environment variable VITE_RAPIDAPI_KEY
6. IF apiKey is missing THEN
     RETURN MOCK_JOBS (curated fallback data)
7. END IF
8. SEND GET request to JSearch API with query and location
9. IF response status is 429 (rate limit) OR 403 (forbidden) THEN
     RETURN MOCK_JOBS
10. IF response data is empty THEN
      RETURN MOCK_JOBS
11. MAP API response to Job interface
12. CACHE result in localStorage with current timestamp
13. RETURN mapped jobs
14. ON error: RETURN MOCK_JOBS
```

### 3.8.5 File Parsing Algorithm

```
Algorithm: EXTRACT_TEXT(file)
Input: A File object (PDF or DOCX)
Output: Extracted plain text string

1. DETERMINE fileType from file extension
2. IF fileType is "pdf" THEN
     a. Convert file to ArrayBuffer
     b. Load document using pdfjsLib.getDocument({data: arrayBuffer})
     c. FOR each page (1 to numPages)
          i. Get page text content
          ii. Join text items with space separator
          iii. Append to fullText with line breaks
     d. RETURN fullText
3. ELSE IF fileType is "docx" THEN
     a. Convert file to ArrayBuffer
     b. Call mammoth.extractRawText({arrayBuffer})
     c. RETURN result.value
4. ELSE
     THROW "Unsupported file format"
5. END IF
```

### 3.8.6 Authentication and Session Management Algorithm

```
Algorithm: AUTH_SESSION_MANAGEMENT
1. On application mount (main.tsx), AuthProvider initialises
2. SET auth persistence to browserSessionPersistence (per-tab)
3. SUBSCRIBE to onAuthStateChanged(auth, callback)
4. IF user is authenticated THEN
     SET context.user = user object
     RENDER child components
5. ELSE
     SET context.user = null
     RENDER child components (unauthenticated routes visible)
6. END IF
7. On LOGOUT:
     a. CLEAR localStorage keys: dashboard_stats_cache, dashboard_profile_cache, dashboard_jobs_cache, interview_stats, saved_jobs_data, onboarding_data
     b. CALL firebaseSignOut(auth)
     c. onAuthStateChanged fires, setting user to null
```

## 3.9 Development Tools

### 3.9.1 Programming Languages

| Language | Usage |
|---|---|
| TypeScript 5.9 | Primary language for all frontend application code, type definitions, and service modules |
| CSS (via Tailwind) | Styling via utility classes; minimal custom CSS (13 lines in `index.css`) |
| Firestore Rules Language | Declarative security rules for Firestore database access control |
| Storage Rules Language | Declarative security rules for Firebase Storage access control |

### 3.9.2 Frameworks and Libraries

| Library | Version | Purpose |
|---|---|---|
| React | 19.2.0 | Frontend UI framework |
| React DOM | 19.2.0 | DOM rendering for React |
| React Router DOM | 7.13.0 | Client-side routing |
| React Hook Form | 7.71.1 | Performant form state management |
| @hookform/resolvers | 5.2.2 | Adapters for validation libraries (Zod) |
| Zod | 4.3.6 | Runtime schema validation |
| @tanstack/react-query | 5.90.21 | Server state management and caching |
| Firebase | 12.9.0 | BaaS SDK (Auth, Firestore, Storage, AI, Analytics) |
| Tailwind CSS | 3.4.19 | Utility-first CSS framework |
| tailwind-merge | 3.5.0 | Utility for merging Tailwind class names |
| clsx | 2.1.1 | Conditional class name construction |
| Lucide React | 0.574.0 | Icon library |
| Sonner | 2.0.7 | Toast notification component |
| pdfjs-dist | 5.4.624 | Client-side PDF text extraction |
| mammoth | 1.11.0 | Client-side DOCX text extraction |
| react-dropzone | 15.0.0 | File drag-and-drop component |
| react-markdown | 10.1.0 | Markdown rendering |
| date-fns | 4.1.0 | Date utility functions |

### 3.9.3 Development Tools

| Tool | Version | Purpose |
|---|---|---|
| Vite | 7.3.1 | Build tool and development server |
| ESLint | 9.39.1 | Static code analysis and linting |
| PostCSS | 8.5.6 | CSS processing pipeline (for Tailwind) |
| Autoprefixer | 10.4.24 | Automatic vendor prefix addition |
| @vitejs/plugin-react | 5.1.1 | Vite plugin for React Fast Refresh |

### 3.9.4 Hosting and Deployment Configuration

The application is configured for static deployment. The `vite.config.ts` file defines the build configuration with React plugin support and a path alias (`@` mapped to `./src`). The production build generates optimised static assets in the `dist/` directory, suitable for deployment on platforms such as Vercel, Netlify, or Firebase Hosting. Environment variables are managed via `.env` files with the `VITE_` prefix convention required by Vite's environment variable system.

### 3.9.5 Version Control

The project uses **Git** for version control, as evidenced by the `.gitignore`-compliant project structure and the presence of standard configuration files (`package.json`, `tsconfig.json`, etc.) typical of version-controlled Node.js projects.
