# ResumeAI 🚀

![ResumeAI Logo](./public/icon.png)

## Overview

**ResumeAI** is an advanced AI-powered career development platform designed to help job seekers create optimized resumes and prepare for interviews effectively. By leveraging cutting-edge AI technologies (Vertex AI), ResumeAI provides personalized feedback, ATS (Applicant Tracking System) optimization, and mock interview simulations.

### Key Features ✨

*   **📄 Smart Resume Builder**: Create professional, ATS-friendly resumes tailored to specific job descriptions.
*   **🔍 ATS Analyzer**: Analyze your resume against job descriptions to identify missing keywords and formatting issues, improving your chances of passing automated screenings.
*   **🎯 Interview Prep**: Practice with AI-driven mock interviews that provide real-time feedback on your answers, tone, and delivery.
*   **💡 Personalized Feedback**: Get detailed insights and actionable advice to improve your resume content and interview performance.
*   **🔒 Secure Authentication**: Manage your profile and saved resumes securely with Firebase Authentication.
*   **📱 Responsive Dashboard**: A modern, user-friendly interface built with React and Tailwind CSS.

## Tech Stack 🛠️

*   **Frontend**: React 19, TypeScript, Vite
*   **Styling**: Tailwind CSS, Radix UI, Lucide Icons
*   **State Management**: React Query, Context API
*   **Form Handling**: React Hook Form, Zod
*   **AI Integration**: Vertex AI (Google Cloud)
*   **Auth & Backend**: Firebase
*   **File Parsing**: PDF.js, Mammoth (for parsing docx)

## Getting Started 🚀

Follow these steps to set up the project locally:

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm or yarn
*   A Firebase project with Authentication enabled
*   Google Cloud Project with Vertex AI API enabled

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/resumeai.git
    cd resumeai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add your Firebase and AI API keys:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    # ... other required env vars
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

## Scripts 📜

*   `npm run dev`: Start the development server.
*   `npm run build`: Build the app for production (TypeScript compiled).
*   `npm run lint`: Run ESLint to catch code quality issues.
*   `npm run preview`: Preview the production build locally.

---

Built with ❤️ by the ResumeAI Team.
