# CHAPTER FOUR: SYSTEM IMPLEMENTATION AND RESULTS

## 4.1 Introduction
This chapter documents the practical implementation of the ResumeAI system. It details the development environment, the coding structure of the frontend and backend services, the testing strategies employed, and the final results of the project.

## 4.2 Development Environment
The system was developed using the following configuration:
*   **Operating System:** Windows 10/11
*   **Code Editor:** Visual Studio Code (VS Code) with ESLint and Prettier extensions.
*   **Runtime:** Node.js (v18+) for package management.
*   **Browser:** Google Chrome (for development and debugging).
*   **Package Manager:** NPM (Node Package Manager).

## 4.3 System Implementation

### 4.3.1 Frontend Implementation
The frontend utilizes a modular directory structure defined in `src/`.
*   **Routing:** Implemented using `react-router-dom` in `App.tsx`. Routes are protected using a `RequireAuth` wrapper that checks for a valid Firebase session before rendering sensitive pages like `/dashboard` or `/builder`.
*   **State Management:**
    *   **Global Auth State:** Managed via `AuthContext.tsx`, which subscribes to Firebase's `onAuthStateChanged` listener.
    *   **Server State:** Managed via `@tanstack/react-query` to handle data fetching, caching, and synchronization with Firestore.
    *   **Form State:** Managed via `react-hook-form` paired with `zod` schema validation to ensure user inputs meet required formats before submission.
*   **UI Components:** The application uses a generic `components/ui` folder for reusable elements (buttons, inputs) and feature-specific folders (e.g., `features/builder/`) for complex page logic.

### 4.3.2 Backend Implementation (Serverless Services)
The backend logic is decentralized across service files in the `src/features/*/services` directories.

*   **Firebase Configuration:** The entry point is `src/lib/firebase.ts`, which initializes connections to Auth, Firestore, and Vertex AI using environment variables (`import.meta.env`).
*   **Authentication Logic:** Located in `features/auth`, this handles user registration and login. It leverages Firebase's SDK to handle secure token exchange.
*   **AI Service (`vertexService.ts`):** This is the core intelligence module. It contains asynchronous functions like `enhanceResume` which interface with the `gemini-2.0-flash-001` model. It handles the prompt engineering required to force the AI into an "Expert Resume Writer" persona.
*   **Job Service (`jobService.ts`):** Currently implements a mock adapter pattern. It defines a `Job` interface and returns an array of hardcoded job listings (e.g., Senior Frontend Engineer at Paystack) to simulate an external job board API provided by JSearch.

### 4.3.3 Database Implementation & Security
The Firestore database structure is enforced via `firestore.rules`.
*   **Security Rules Implementation:**
    ```groovy
    match /resumes/{resumeId} {
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    ```
    This implementation ensures strict data isolation—User A can never read or modify User B's resumes.

## 4.4 System Testing

### 4.4.1 Unit & Static Testing
Static code analysis was performed using **ESLint** and **TypeScript Compiler (tsc)**. This ensured type safety across the application, preventing common errors such as accessing undefined properties on resume objects. `Zod` schemas acted as runtime unit tests for data validation, ensuring email formats and required fields were present.

### 4.4.2 System Testing (Manual)
A structured manual testing approach was used to validate the end-to-end functionality.

| Test Case ID | Test Description | Input Data | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | User Registration | Valid email, strong password | User created in Auth, redirected to Dashboard | **Pass** |
| **TC-02** | Resume Creation | Title: "Dev Resume" | New document appears in Resume list | **Pass** |
| **TC-03** | AI Resume Enhancement | Raw text description | JSON object returned, UI updates with professional text | **Pass** |
| **TC-04** | Private Access | User A attempts to access User B's Resume ID | Access Denied / 403 Error | **Pass** |
| **TC-05** | Job Matching | View Job Details | Job details displayed with correct salary currency (NGN) | **Pass** |

## 4.5 Results and Discussion
The implemented system successfully achieves the core objectives outlined in the design phase.

*   **System Inputs:** The system accepts raw user input (text) and unstructured job descriptions.
*   **System Outputs:** The system produces highly structured, professional resumes in JSON format, rendered as visual templates, and concise cover letters.
*   **Performance:** The use of `vite` allows for near-instant Hot Module Replacement (HMR) during development and optimized static assets in production. Firestore queries are efficient due to simple index lookups by `userId`.
*   **Security:** The system successfully creates a secure environment where user data is isolated. No extensive backend vulnerabilities (like SQL Injection) exist due to the use of Firestore's parameterized querying and security rules.
*   **Strengths:**
    *   Cost-effective serverless architecture.
    *   Integration of state-of-the-art AI (Gemini 2.0).
    *   Modern UI/UX with responsive design.
*   **Limitations:**
    *   The "Job Board" currently relies on mock data and requires integration with a live API (e.g., LinkedIn or RapidAPI) for production use.
    *   PDF export functionality depends on browser print capabilities.

## 4.6 Deployment
The client-side application is configured for deployment on static hosting platforms.
*   **Build Configuration:** `vite.config.ts` handles the compilation of TypeScript and React code into optimized HTML, CSS, and JS bundles in the `dist/` folder.
*   **Environment Management:** The `.env` file strategy allows for seamless switching between development (test projects) and production (live projects) Firebase environments.
*   **Hosting:** The application is production-ready for platforms like Vercel or Netlify, which support single-page application routing rules (`/*` redirects to `index.html`).
