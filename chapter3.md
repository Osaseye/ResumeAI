# CHAPTER THREE: SYSTEM ANALYSIS AND DESIGN

## 3.1 Introduction
This chapter provides a detailed analysis of the ResumeAI system, outlining the design methodologies, architectural patterns, and structural models used in its development. It covers the transition from manual resume creation to an AI-assisted automated process, defining the functional and non-functional requirements that guided the implementation. The chapter concludes with the database design and system algorithms that underpin the application’s core logic.

## 3.2 Analysis of Existing System
The traditional process of resume creation and job application is largely manual and fragmented. Job seekers typically use word processors (e.g., Microsoft Word, Google Docs) to draft resumes, often struggling with formatting, keyword optimization for Applicant Tracking Systems (ATS), and tailoring content for specific job descriptions.

### Limitations of the Existing Process
1.  **Lack of Standardization:** Formats vary widely, leading to parsing errors by ATS software.
2.  **Generic Content:** Users often send the same resume for multiple job applications, reducing their chances of selection.
3.  **Time-Consuming:** Manually tailoring a resume or writing a cover letter for every application is labor-intensive.
4.  **No Feedback Mechanism:** Users receive no immediate feedback on the quality or impact of their resume content.

## 3.3 Proposed System
The proposed system, **ResumeAI**, is an intelligent web-based platform designed to automate and enhance the job application process. It leverages Generative AI (Google Gemini via Vertex AI) to assist users in building professional, ATS-friendly resumes and cover letters.

### Core Objectives
*   **AI-Powered Content Generation:** To automatically generate compelling professional summaries and enhance experience descriptions.
*   **Job-Specific Tailoring:** To rewrite resume content dynamically based on a provided job description.
*   **Structured Data Management:** To store user career data in a structured JSON format, allowing for easy updates and template switching.
*   **Integrated Job Search:** To provide relevant job listings (focused on the Nigerian tech market) within the same platform.

## 3.4 System Requirements

### 3.4.1 Functional Requirements
These requirements define the specific behaviors and functions of the system, extracted from the implemented features.

1.  **Authentication & User Management:**
    *   Users must be able to register and log in using email and password.
    *   The system must maintain persistent sessions using Firebase Auth tokens.
2.  **Resume Management (CRUD):**
    *   Users can create, read, update, and delete multiple resumes.
    *   Users can input details for Contact, Experience, Education, Skills, and Projects.
3.  **AI Features:**
    *   **Resume Enhancement:** The system must accept a raw resume object and return an improved version with professional phrasing using Vertex AI.
    *   **Job Tailoring:** The system must accept a job description and rewrite the resume to match keywords.
    *   **Cover Letter Generation:** The system must generate a 3-paragraph cover letter based on the user's profile and a target job.
4.  **Job Board:**
    *   Users can view a list of recommended jobs (e.g., from Paystack, Flutterwave).
    *   Users can view detailed job requirements and salary ranges.

### 3.4.2 Non-Functional Requirements
1.  **Security:**
    *   Data access must be restricted via Row-Level Security (RLS) policies using Firestore Rules (`request.auth.uid == data.userId`).
    *   Environment variables must be used to protect API keys (`VITE_FIREBASE_API_KEY`).
2.  **Performance:**
    *   The application should load quickly using Client-Side Rendering (CSR) and Vite's bundle optimization.
    *   State management (React Query) should be used to cache server data and minimize network requests.
3.  **Scalability:**
    *   The database (Firestore) must handle dynamic scaling of documents without schema rigidity using a NoSQL structure.
    *   The architecture should support serverless execution to handle varying traffic loads without managing physical servers.
4.  **Usability:**
    *   The UI must be responsive, adapting to mobile and desktop screens.
    *   Forms must provide real-time validation (using Zod) to prevent erroneous data submission.

## 3.5 System Architecture
The system adopts a **Serverless Client-Server Architecture** utilizing a **Backend-as-a-Service (BaaS)** model.

*   **Frontend (Client):** A Single Page Application (SPA) built with React and TypeScript. It handles the presentation layer, routing, and state management. The UI is component-based, located in `src/components`, promoting reusability.
*   **Backend (BaaS):** Firebase acts as the backend infrastructure, providing:
    *   **Authentication Service:** Manages user identity.
    *   **Firestore Database:** A NoSQL document store for application data.
    *   **Vertex AI:** Provides the large language model capabilities (`gemini-2.0-flash-001`).
*   **Request Flow:** The client sends direct requests to Firebase services using the Firebase SDK (`src/lib/firebase.ts`). There is no traditional middleware server; instead, security is enforced directly at the database level via security rules.

## 3.6 System Design Models

### 3.6.1 Use Case Diagram Description
*   **Actor:** Job Seeker
*   **Use Cases:**
    *   **Sign Up/Login:** Authenticate to access the dashboard.
    *   **Build Resume:** Enter career details into forms.
    *   **Enhance with AI:** Trigger the "Enhance" function to rewrite descriptions.
    *   **Generate Cover Letter:** Input job details to receive a generated letter.
    *   **View Jobs:** Browse available job listings.

### 3.6.2 Implementation Class Model (Data Types)
Based on `src/features/resumes/types/index.ts`:

*   **Resume:**
    *   Attributes: `id`, `userId`, `title`, `template`, `contact`, `summary`.
    *   Relationships: Contains list of `Experience`, `Education`, and `Skill` objects.
*   **Experience:**
    *   Attributes: `company`, `role`, `startDate`, `endDate`, `description`.
*   **Job:**
    *   Attributes: `job_id`, `employer_name`, `job_title`, `match_score`, `salary_range`.

### 3.6.3 Sequence Diagram Description (AI Enhancement Workflow)
1.  **User** clicks "Enhance with AI" on the Resume Builder page.
2.  **Frontend** calls `vertexService.enhanceResume(currentData)`.
3.  **VertexService** constructs a prompt: *"You are an expert resume writer... return ONLY the JSON object."*
4.  **Firebase SDK** sends the prompt to the Google Gemini model.
5.  **AI Model** processes the text and returns a structured JSON string.
6.  **VertexService** parses the JSON and returns the `ResumeFormData`.
7.  **Frontend** updates the React State, refreshing the UI with new content.

## 3.7 Database Design
The system uses **Cloud Firestore**, a NoSQL document database. Data is stored in collections and documents rather than tables.

### Data Collections
1.  **Collection: `users`**
    *   **Document ID:** `userId` (from Auth)
    *   **Fields:** `email`, `displayName`, `createdAt`.
2.  **Collection: `resumes`**
    *   **Document ID:** `resumeId` (UUID)
    *   **Fields:**
        *   `userId` (Foreign Key / Reference to User)
        *   `title` (String)
        *   `contact` (Map: email, phone, location)
        *   `experience` (Array of Maps)
        *   `education` (Array of Maps)
        *   `skills` (Array of Maps)
        *   `createdAt` (Timestamp)
    *   **Normalization:** The database uses a **denormalized** design. Resume-specific data (experience, education) is embedded within the Resume document rather than in separate sub-collections, optimizing read performance for the resume builder.

## 3.8 System Flow / Algorithms
A key algorithmic component is the **AI Response Parsing Logic** found in `src/features/ai/services/vertexService.ts`.

### Text-to-JSON Parsing Algorithm
1.  The system sends a natural language prompt to the AI.
2.  The prompt explicitly instructs the AI to return data in a specific JSON schema.
3.  Upon receiving the raw text response, the system executes a Regex match: `text.match(/\{[\s\S]*\}/)`.
4.  This extracts the JSON block from any surrounding conversational text.
5.  `JSON.parse()` is executed on the extracted string.
6.  If parsing fails, an error is thrown; otherwise, the structured object is returned to the application state.

## 3.9 Development Tools
*   **Frontend Framework:** React 19
*   **Language:** TypeScript (for type safety)
*   **Build Tool:** Vite 7.3
*   **Styling:** Tailwind CSS (Utility-first framework)
*   **Icons:** Lucide React
*   **Backend/DB:** Firebase (Firestore, Auth)
*   **AI Model:** Google Gemini 2.0 Flash
*   **Version Control:** Git
