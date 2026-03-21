# ResumeAI — Copilot Context & Engineering Notes

> **Purpose of this file:** Full context document for AI-assisted development.
> Keep this updated whenever a major change is made. Last updated: March 2026.

---

## 1. Project Overview

**ResumeAI** is a web-based career acceleration platform targeting Nigerian secondary school leavers, university students, and working professionals (ages 15–28+). It provides AI-powered resume building, ATS analysis, cover letter generation, mock interviews, and job discovery — all in a single dashboard.

**Live stack:**
- Frontend: React 19 + TypeScript + Vite 7.3
- Styling: Tailwind CSS 3.4
- Backend: Firebase (Auth, Firestore, Storage, Vertex AI)
- AI Model: Gemini 2.0 Flash (`gemini-2.0-flash-001`) via Firebase AI Logic (Vertex AI backend)
- Hosting: Vercel (static SPA + serverless API routes under `/api/`)
- Job Data: Adzuna API (Nigeria endpoint) with curated Nigerian company fallback

---

## 2. Repository Structure

```
/
├── api/
│   └── jobs.ts                        # Vercel serverless proxy → Adzuna API
├── src/
│   ├── main.tsx                       # Entry point; wraps app in AuthProvider
│   ├── App.tsx                        # 24 client-side routes
│   ├── index.css                      # Tailwind directives only (13 lines)
│   ├── lib/
│   │   └── firebase.ts                # Firebase SDK init; exports auth, db, storage, model
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── Header.tsx             # Search bar + notification dropdown + user avatar
│   │   │   ├── Sidebar.tsx            # Desktop nav (hardcoded job badge count — known issue)
│   │   │   └── MobileNavBar.tsx       # Bottom nav for mobile (5 items)
│   │   ├── landing/                   # Marketing page components (Navbar, Hero, etc.)
│   │   └── ui/
│   │       └── ToastProvider.tsx      # Sonner toast container
│   ├── contexts/
│   │   └── NotificationContext.tsx    # In-app notifications; persisted to localStorage
│   ├── layouts/
│   │   ├── AuthLayout.tsx             # Login/register split-panel layout
│   │   └── DashboardLayout.tsx        # Sidebar + Header + MobileNavBar wrapper
│   ├── hooks/
│   │   ├── useSpeechRecognition.ts    # Web Speech Recognition API
│   │   └── useSpeechSynthesis.ts      # Web Speech Synthesis API
│   ├── services/
│   │   └── fileParser.ts              # pdfjs-dist + mammoth text extraction
│   └── features/
│       ├── ai/services/
│       │   └── vertexService.ts       # All 9 Gemini AI methods
│       ├── auth/                      # Login, Register, Onboarding, ForgotPassword, AuthContext
│       ├── builder/                   # ResumeBuilderPage (826 lines, 7-step wizard)
│       ├── resumes/                   # MyResumesPage, ResumeDetailsPage, resumeService, ResumePreview
│       ├── cover-letter/              # CoverLetterBuilderPage, CoverLetterDetailsPage, coverLetterService
│       ├── ats/                       # ATSAnalyzerPage
│       ├── interview/                 # MockInterviewPage, InterviewConfigurationPage,
│       │                              # ActiveInterviewSession, InterviewResultsPage
│       ├── jobs/services/
│       │   └── jobService.ts          # ← RECENTLY REPLACED (see Section 4)
│       ├── dashboard/
│       │   └── DashboardPage.tsx      # 502 lines; aggregates all user stats
│       ├── settings/                  # AccountPage, NotificationsPage, BillingPage, SettingsPage
│       └── support/                   # HelpCenterPage + supportService (Firestore tickets)
├── firestore.rules                    # Firestore security rules
├── storage.rules                      # Firebase Storage security rules
├── vercel.json                        # SPA rewrite rules
└── .env                               # Local only — never committed
```

---

## 3. Environment Variables

### Local (`.env` — never commit this file)
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

### Vercel Dashboard (server-side only — not VITE_ prefixed)
```
ADZUNA_APP_ID=<your_app_id>
ADZUNA_APP_KEY=<your_app_key>
```

> ⚠️ **IMPORTANT:** Never prefix Adzuna keys with `VITE_`. Any `VITE_` variable is
> bundled into the client-side JavaScript and visible to anyone who inspects the
> network tab. Adzuna credentials must live only in Vercel's server environment.
> The `/api/jobs.ts` serverless function reads `process.env.ADZUNA_APP_ID` — it is
> never sent to the browser.

---

## 4. Job Service — Recent Changes (Remotive → Adzuna)

### Why we switched
The previous implementation used **Remotive** (`https://remotive.com/api/remote-jobs`).
Problems: no Nigerian/African company coverage, too few results (10 after filtering),
unreliable CORS, and the job count was too small to feel like a real product.

### What changed

#### `/api/jobs.ts` (Vercel serverless proxy)
- Now forwards to `https://api.adzuna.com/v1/api/jobs/ng/search/1`
- `ng` = Adzuna's Nigeria country code
- API keys stay server-side in `process.env`
- Returns `{ use_fallback: true }` on 429 / missing credentials so client degrades gracefully
- Sets `Cache-Control: s-maxage=86400` for Vercel CDN edge caching

#### `src/features/jobs/services/jobService.ts`
Complete rewrite. Key differences from old version:

| Aspect | Old (Remotive) | New (Adzuna) |
|--------|---------------|--------------|
| API | Remotive (called directly from browser) | Adzuna (via Vercel proxy) |
| API key location | `VITE_RAPIDAPI_KEY` in browser bundle | `process.env` on server only |
| Nigeria coverage | Near zero | Dedicated `/ng/` endpoint |
| Rate limiter | Per-device daily block | Removed (Adzuna free = ~1000 req/month) |
| Fallback data | 5 generic companies | 21 real Nigerian tech companies |
| City data | Always empty string | Real city from `location.area` array |
| Remote detection | Filter on `candidate_required_location` | Text match on title + description |
| Salary currency | Mixed (USD from global) | NGN (Nigeria endpoint default) |
| `employer_logo` | Always `undefined` (CORS) | Still `undefined` (Adzuna doesn't provide) |
| `match_score` | `Math.random() * 20 + 80` (fake) | Same for now — placeholder |

#### Fallback priority chain (new)
```
1. localStorage cache (24h TTL per query key)
        ↓ miss
2. /api/jobs proxy → Adzuna Nigeria endpoint
        ↓ error / use_fallback / 0 results
3. getAnyCachedJobs() — any fresh query cache
        ↓ nothing
4. NIGERIAN_CURATED_JOBS (21 entries, always available)
```

#### New `NIGERIAN_CURATED_JOBS` companies included
Paystack, Flutterwave, Kuda Bank, Andela, Interswitch, PiggyVest, Moniepoint,
OPay, Cowrywise, Rise (Risevest), Stanbic IBTC, Jumia, Sendbox, MTN Nigeria,
Helium Health, uLesson, Bitnob, Termii — all with real descriptions, salary
ranges in NGN, and direct career page links.

#### `_getFallback(role)` — smart curated sorting
When falling back, jobs are scored against the user's role string before returning,
so a "Frontend Engineer" sees Paystack and Kuda at the top, not random order.

### Files to deploy
```
api/jobs.ts                                       ← replace root-level file
src/features/jobs/services/jobService.ts          ← replace entirely
```

No other files need changes. The `Job` interface shape is identical — all
consumers (DashboardPage, JobMatchesPage, ResumeDetailsPage,
InterviewConfigurationPage) work without modification.

---

## 5. Firestore Collections

| Collection | Document Key | Notes |
|---|---|---|
| `users` | Firebase Auth `uid` | Created in `OnboardingPage` via `setDoc` |
| `resumes` | Auto-generated | Required fields: `title`, `userId`, `createdAt` |
| `coverLetters` | Auto-generated | Required fields enforced by Firestore rules |
| `support_tickets` | Auto-generated | Users can create; cannot update/delete |
| `jobs` | Auto-generated | Defined in rules but not currently written to by the app |

### Firestore Security Rule helpers
```javascript
isAuthenticated()   // request.auth != null
isOwner(userId)     // request.auth.uid == userId
isOwnerCreate()     // request.resource.data.userId == request.auth.uid
hasRequiredFields() // data.keys().hasAll(requiredFields)
```

---

## 6. AI Service (`vertexService.ts`)

All 9 methods follow the same pattern:
1. Build a natural-language prompt with an explicit JSON schema
2. Call `model.generateContent(prompt)`
3. Extract JSON with `text.match(/\{[\s\S]*\}/)` regex
4. Parse and return typed result

| Method | Input | Output |
|---|---|---|
| `enhanceResume` | `ResumeFormData` | `ResumeFormData` (rewritten) |
| `improveResumeFromJob` | `resumeText`, `jobDescription` | `ResumeFormData` |
| `generateCoverLetter` | `jobTitle`, `company`, `description` | `{ intro, body, conclusion }` |
| `parseResume` | raw text string | `ResumeFormData` |
| `parseCoverLetter` | raw text string | `CoverLetterFormData` |
| `analyzeMatch` | `resumeText`, `jobDescription` | `ATSAnalysisResult` |
| `startInterviewSession` | `resumeText`, `jobDescription` | `{ message, question }` |
| `chatInterview` | history array, `newMessage`, `isLast` | `{ message, feedback, nextQuestion, isComplete }` |
| `generateInterviewFeedback` | history array | `{ score, summary, strengths, improvements, keyTopics }` |

---

## 7. localStorage Keys Reference

| Key | Written by | Read by | TTL |
|---|---|---|---|
| `primary_jobs_cache` | `jobsService.fetchAndStoreJobs` | `DashboardPage`, `JobMatchesPage`, `ResumeDetailsPage` | 24h |
| `job_search_{query}` | `jobsService.searchJobs` | `jobsService.searchJobs` | 24h |
| `interview_stats` | `ActiveInterviewSession` | `MockInterviewPage`, `DashboardPage` | None |
| `saved_jobs_data` | `JobMatchesPage` | `InterviewConfigurationPage` | None |
| `dashboard_stats_cache` | `DashboardPage` | `DashboardPage` (initial state) | None |
| `dashboard_profile_cache` | `DashboardPage` | `Header`, `DashboardPage` | None |
| `dashboard_jobs_cache` | `DashboardPage` | `DashboardPage` (initial state) | None |
| `user_profile_cache` | `Header` | `Header` (initial state) | None |
| `user_notifications` | `NotificationContext` | `NotificationContext` | None |
| `onboarding_data` | (cleared on logout) | — | None |
| `device_job_api_date` | Old Remotive service | Old Remotive service | **OBSOLETE — can delete** |

---

## 8. Known Issues & Technical Debt

This section documents every known problem in the codebase, prioritised by severity.

---

### 🔴 Critical — Security

**[SEC-1] localStorage not namespaced per user**
All localStorage keys are global (e.g. `interview_stats`, `saved_jobs_data`). If two
different users log in on the same browser (different tabs use different sessions due to
`browserSessionPersistence`, but the same localStorage), User B can read User A's cached
jobs, interview history, and notifications. Fix: prefix every key with the user's UID.
```typescript
// Current
localStorage.setItem('interview_stats', ...)
// Fix
localStorage.setItem(`interview_stats_${user.uid}`, ...)
```

**[SEC-2] No route protection (auth guard)**
All 24 routes in `App.tsx` are publicly accessible. An unauthenticated user who navigates
directly to `/dashboard` or `/resumes/some-id` will see the page render (it will just
show empty data or error). There is no `ProtectedRoute` component wrapping authenticated
pages. Fix: create a `ProtectedRoute` wrapper that reads from `AuthContext` and redirects
to `/login` if `user` is null.
```typescript
// App.tsx currently
<Route path="/dashboard" element={<DashboardPage />} />
// Fix
<Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
```

**[SEC-3] Firebase Storage profile pictures are world-readable**
In `storage.rules`, the profile picture path has `allow read: if true` — anyone on the
internet can read any user's profile picture if they know the path. This is likely
unintentional. Fix: change to `allow read: if isAuthenticated()` unless public profiles
are a planned feature.

---

### 🟠 High — Broken Features (UI exists, functionality missing)

**[BUG-1] Delete buttons on resume and cover letter cards do nothing**
`MyResumesPage.tsx` renders a delete-looking button (`more_vert` menu icon) on each card
but there is no `onClick` handler wired to `resumeService.deleteResume()` or
`coverLetterService.deleteCoverLetter()`. Users cannot delete their documents.

**[BUG-2] "Download PDF" button does nothing**
`ResumeDetailsPage.tsx` renders a "Download PDF" button. There is no handler attached.
The `window.print()` approach used in `CoverLetterDetailsPage` would work as a temporary
fix. A proper solution would use a library like `html2pdf.js` or server-side rendering.

**[BUG-3] ForgotPasswordPage does not call Firebase**
`ForgotPasswordPage.tsx` uses `await new Promise(resolve => setTimeout(resolve, 1500))`
to simulate an API call. It never calls Firebase's `sendPasswordResetEmail`. Users who
request a password reset receive a fake success toast but no email.
Fix:
```typescript
import { sendPasswordResetEmail } from 'firebase/auth';
await sendPasswordResetEmail(auth, data.email);
```

**[BUG-4] AccountPage password update does not call Firebase**
The "Update Password" handler in `AccountPage.tsx` shows a success toast immediately but
never calls `updatePassword` from the Firebase Auth SDK. Passwords are never actually
changed.
Fix:
```typescript
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
const credential = EmailAuthProvider.credential(user.email!, formData.currentPassword);
await reauthenticateWithCredential(user, credential);
await updatePassword(user, formData.newPassword);
```

**[BUG-5] "Auto-Generate with AI" button in Resume Builder Step 4 (Summary) does nothing**
`ResumeBuilderPage.tsx` Step 4 renders a button with the label "Auto-Generate with AI"
but has no `onClick` handler. The `vertexService.enhanceResume()` call only happens
at the final save step, not interactively per-section.

**[BUG-6] FAQ search bar in HelpCenterPage has no filter logic**
The search input in `HelpCenterPage.tsx` is a controlled but non-functional input — it
renders but does not filter the `FAQS` array. The `openIndex` state is unrelated to
search.

**[BUG-7] Header search bar does nothing**
The search bar in `Header.tsx` captures key strokes but has no `onKeyDown` or `onSubmit`
handler connected to any search logic. It is purely decorative.

**[BUG-8] Sidebar job count is hardcoded to 14**
`Sidebar.tsx` sets `setJobCount(14)` unconditionally with a comment saying the real
fetch is commented out. This displays a misleading badge to all users regardless of
actual job count.

**[BUG-9] "Change Avatar" button in AccountPage has no handler**
The button calls nothing. Profile picture upload via Firebase Storage is not implemented
despite Storage rules and paths being defined for it.

**[BUG-10] ATS score on resume cards is hardcoded to 85**
`MyResumesPage.tsx` and `ResumeDetailsPage.tsx` both display `ATS: 85` regardless of
the actual resume content. There is no stored ATS score on the Firestore resume document.

**[BUG-11] Interview results communication metrics are hardcoded**
`InterviewResultsPage.tsx` displays Clarity & Pacing: 88, Confidence Tone: 95, Keyword
Usage: 76 — these are static numbers in JSX, not derived from the AI feedback object.

**[BUG-12] `match_score` on job cards is Math.random()**
`mapAdzunaItem()` and `mapRemotiveItem()` both set:
```typescript
match_score: Math.floor(Math.random() * 20 + 80)
```
This means the displayed "87% Match" badge changes on every page reload and has no
relationship to the user's resume.

**[BUG-13] `job_city` always empty from Adzuna for some results**
Some Adzuna results have sparse `location.area` arrays. When `area.length < 2` the city
defaults to `''`, causing `{job.job_city}, {job.job_country}` to render as `, Nigeria`
in the UI. Fix: guard the city display with a conditional.
```typescript
{[job.job_city, job.job_country].filter(Boolean).join(', ')}
```

---

### 🟡 Medium — Architectural Issues

**[ARCH-1] Interview statistics stored in localStorage, not Firestore**
`ActiveInterviewSession.tsx` saves interview history, scores, and full message transcripts
to `localStorage['interview_stats']`. This means:
- Data is lost when the user clears browser storage
- Data is device-specific (a user on mobile cannot see sessions done on desktop)
- There is no way to query or aggregate this data server-side

Correct approach: write each session to a `interview_sessions` Firestore subcollection
under the user's document.

**[ARCH-2] No React error boundaries**
There are no `<ErrorBoundary>` components in the tree. An unhandled error in any
feature page will crash the entire app to a blank screen with no recovery path for
the user.

**[ARCH-3] `@tanstack/react-query` is installed but not used**
`package.json` includes `@tanstack/react-query` but every data fetch uses manual
`useState` + `useEffect` + `try/catch`. This leads to duplicated loading/error state
patterns across 15+ components with no caching, deduplication, or background refetch.
The library should either be adopted consistently or removed to reduce bundle size.

**[ARCH-4] AI JSON parsing will silently fail on nested JSON**
All `vertexService` methods use:
```typescript
const jsonMatch = text.match(/\{[\s\S]*\}/);
```
This greedy regex matches from the first `{` to the last `}`. If the AI returns a
response where the JSON contains nested objects with closing braces followed by more
text, the regex still works. However, if the model wraps the response in a markdown
code block with backtick characters outside the braces, `JSON.parse` will throw and
the entire feature fails. There is no retry logic. Fix: use structured output (JSON
mode) or add a fallback strip for markdown fences:
```typescript
const clean = text.replace(/```json|```/g, '').trim();
const jsonMatch = clean.match(/\{[\s\S]*\}/);
```

**[ARCH-5] No pagination anywhere**
`resumeService.getUserResumes()` and `coverLetterService.getUserCoverLetters()` use
`getDocs(query(...))` which fetches all documents in one shot. A user with 50 resumes
loads all 50 at once. Firestore charges per document read.

**[ARCH-6] TypeScript strict mode is disabled**
`tsconfig.app.json` has `"strict": false`. This disables `strictNullChecks`,
`strictFunctionTypes`, and implicit `any` checks. Many potential runtime errors are
not caught at compile time. This should be set to `true` and the resulting type errors
fixed progressively.

**[ARCH-7] No 404 route**
`App.tsx` has no `<Route path="*">` catch-all. Navigating to an invalid path renders
nothing (or the last matching partial route if any).

**[ARCH-8] AI calls have no client-side rate limiting or debounce**
A user can spam the "Enhance with AI" button or the "Generate Cover Letter" button
triggering multiple simultaneous Vertex AI requests. There is no in-flight request
tracking or button lockout beyond a single `isLoading` boolean that can desync.

**[ARCH-9] `DashboardPage.tsx` does too much in one `useEffect`**
The single `useEffect` in `DashboardPage.tsx` sequentially: fetches user profile,
reads job cache, conditionally fetches live jobs, fetches resumes, fetches cover letters,
reads interview stats from localStorage, calculates monthly activity, derives resume
health scores, and caches everything. It is 100+ lines long and any error in any step
exits the entire block. Should be split into focused custom hooks:
`useUserProfile`, `useDashboardJobs`, `useResumeStats`.

**[ARCH-10] `browserSessionPersistence` causes UX confusion**
Auth is scoped to the browser tab. Closing and reopening the tab logs the user out.
Most users expect to stay logged in across sessions. Consider switching to
`localPersistence` for standard "stay logged in" behaviour, or add a "remember me"
checkbox that selects the persistence type.

**[ARCH-11] `vertexService` imports the `model` singleton directly from `firebase.ts`**
All AI calls share one model instance imported at module load time. If Firebase
initialisation is delayed or fails, all nine service methods will throw at the point
of `model.generateContent()` with a confusing error. The service should lazily
initialise or accept the model as a dependency.

**[ARCH-12] MobileNavBar missing key navigation items**
The mobile bottom nav (5 items) includes Dashboard, Resumes, ATS Analyzer, Jobs,
Interview. It omits Cover Letter Builder and the Resume Builder, which means mobile
users cannot create new documents without going through the Resumes tab first.

---

### 🟢 Low — Polish & Minor Issues

**[UX-1] No confirmation dialogs for destructive actions**
Resume/cover letter deletion has no "Are you sure?" prompt. Once wired up (see BUG-1),
a misclick will permanently delete a document.

**[UX-2] `window.confirm` used in ActiveInterviewSession**
`handleEndSession` calls `window.confirm(...)` — a blocking browser dialog that looks
visually jarring and cannot be styled. Replace with a modal using Radix UI Dialog
(already installed in `package.json`).

**[UX-3] No loading skeletons**
Loading states across the app use text like `"Loading your resumes..."`. Skeleton
loaders (shimmer placeholders) would significantly improve perceived performance,
especially on the Dashboard which makes 4+ async calls on mount.

**[UX-4] Hero images may 404**
`Hero.tsx` references `/hero-images/Macbook-Air-localhost.png` and three variants.
These files are not included in the repository and will return 404 in production
unless manually uploaded to `/public/hero-images/`.

**[UX-5] LogoTicker uses hardcoded external CDN image paths**
Several logo images in `LogoTicker.tsx` use paths like `/logo/paystack.png`. These are
relative paths that require the files to exist in `/public/logo/`. Missing files will
break the ticker silently (broken image icons).

**[UX-6] `ResumeBuilderPage` auto-enhances on save without warning**
When the user clicks "Save to Dashboard", `handleSave` calls
`vertexService.enhanceResume(formData)` silently before saving. The user's original
wording is replaced by AI content without explicit consent. The "Enhance with AI"
button on the form implies it's opt-in, but the save flow makes it mandatory.

**[UX-7] Cover letter print CSS uses `position: absolute`**
The `@media print` styles in `CoverLetterDetailsPage.tsx` use
`position: absolute; left: 0; top: 0` which can produce incorrect output in some
browsers. A better approach is `@page` margin control and letting the browser reflow
the content naturally.

**[UX-8] Onboarding can advance past step 2 without selecting experience level**
`OnboardingPage.tsx` calls `nextStep()` directly without checking if `selectedLevel`
has a value. A user can reach step 3 with no `experience` value, causing `setDoc` to
write `undefined` for `experienceLevel` in Firestore.

**[UX-9] `InterviewResultsPage` has no fallback if reached without state**
If a user navigates directly to `/mock-interview/results` (e.g. via bookmark), both
`messages` and `feedback` will be empty/undefined. The empty state renders correctly
but the URL is still `/results`, which is confusing. Should redirect to
`/mock-interview` if no state is present.

**[CODE-1] Inconsistent service export naming**
The jobs service is exported as `jobsService` (with an `s`) in most files but
`jobService` (without) in some imports. This works because of how the exports are
named but is confusing for anyone reading the code.

**[CODE-2] `device_job_api_date` localStorage key is now obsolete**
The old Remotive daily-limiter wrote to `localStorage['device_job_api_date']`.
The new Adzuna service does not use this key but also does not clean it up.
Old users will have this key sitting in storage indefinitely. Add a one-time cleanup.

**[CODE-3] `Billing Page` has no real payment integration**
`BillingPage.tsx` shows a "Redirect to payment gateway" toast on upgrade click but no
Paystack or any payment SDK is initialised. The plan is described as ₦0/month Free.
This is a placeholder page. Paystack integration has been planned per the product
roadmap but is not implemented.

**[CODE-4] Firebase Analytics is initialised but no custom events are tracked**
`firebase.ts` exports `analytics` from `getAnalytics(app)` but no component calls
`logEvent()`. The analytics dashboard will show only automatic page-view events.

**[CODE-5] `@radix-ui/react-dialog` is installed but barely used**
The Radix Dialog package is in `package.json` and imported in at least one file but
only used in one place. Given that `window.confirm` (BUG/UX-2) and several missing
modals (delete confirmations, etc.) need proper dialogs, this should be used more
broadly.

---

## 9. Recommended Fix Priority

| Priority | ID | Task | Effort |
|---|---|---|---|
| 1 | SEC-2 | Add ProtectedRoute for all authenticated pages | Small |
| 2 | BUG-3 | Fix ForgotPasswordPage to call Firebase | Small |
| 3 | BUG-4 | Fix AccountPage to call Firebase updatePassword | Small |
| 4 | SEC-1 | Namespace localStorage keys by user UID | Medium |
| 5 | BUG-1 | Wire delete buttons to resumeService/coverLetterService | Small |
| 6 | BUG-2 | Implement PDF download (window.print or html2pdf.js) | Small |
| 7 | ARCH-1 | Move interview stats to Firestore | Medium |
| 8 | ARCH-2 | Add React error boundaries | Small |
| 9 | UX-8 | Add validation to onboarding step 2 | Small |
| 10 | BUG-12 | Implement real job-resume match scoring | Large |
| 11 | ARCH-6 | Enable TypeScript strict mode + fix type errors | Large |
| 12 | ARCH-3 | Migrate data fetching to React Query | Large |

---

## 10. Deployment Checklist

- [ ] Add `ADZUNA_APP_ID` to Vercel environment variables
- [ ] Add `ADZUNA_APP_KEY` to Vercel environment variables
- [ ] Remove `VITE_RAPIDAPI_KEY` from Vercel environment variables (no longer used)
- [ ] Verify `/api/jobs.ts` is at the repository root (not inside `src/`)
- [ ] Confirm `vercel.json` rewrites exclude `/api/` routes:
  ```json
  { "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }] }
  ```
- [ ] Deploy Firestore security rules: `firebase deploy --only firestore:rules`
- [ ] Deploy Storage security rules: `firebase deploy --only storage`
- [ ] Test job fallback: temporarily remove Adzuna env vars, confirm curated jobs appear
- [ ] Test auth guard once ProtectedRoute is added

---

## 11. Adzuna API Reference

- **Base URL:** `https://api.adzuna.com/v1/api/jobs/{country}/search/{page}`
- **Nigeria country code:** `ng`
- **Key params:** `app_id`, `app_key`, `what` (job title query), `results_per_page`, `sort_by`
- **Sort options:** `date` (freshest), `relevance`, `salary`
- **Response shape:**
  ```typescript
  {
    count: number,         // total matching jobs
    mean: number,          // average salary
    results: AdzunaJob[]
  }
  // Each AdzunaJob:
  {
    id: string,
    title: string,
    description: string,
    created: string,       // ISO date
    redirect_url: string,  // canonical apply link
    salary_min: number,
    salary_max: number,
    location: { area: string[] }, // e.g. ["Nigeria", "Lagos", "Victoria Island"]
    company: { display_name: string },
    category: { label: string, tag: string }
  }
  ```
- **Free tier:** ~1,000 requests/month
- **Docs:** https://developer.adzuna.com/docs/search

---

*End of context document. Update this file whenever a significant feature, bug fix,
or architectural change is made.*
