


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { LogoTicker } from '@/components/landing/LogoTicker';
import { FeatureShowcase } from '@/components/landing/FeatureShowcase';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { MyResumesPage } from '@/features/resumes/MyResumesPage';
import { ResumeBuilderPage } from '@/features/builder/ResumeBuilderPage';
import { CoverLetterBuilderPage } from '@/features/cover-letter/CoverLetterBuilderPage';
import { ATSAnalyzerPage } from '@/features/ats/ATSAnalyzerPage';
import { JobMatchesPage } from '@/features/jobs/JobMatchesPage';
import { MockInterviewPage } from '@/features/interview/MockInterviewPage';
import { ActiveInterviewSession } from '@/features/interview/ActiveInterviewSession';
import { InterviewConfigurationPage } from '@/features/interview/InterviewConfigurationPage';
import { InterviewResultsPage } from '@/features/interview/InterviewResultsPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage';
import { AccountPage } from '@/features/settings/AccountPage';
import { NotificationsPage } from '@/features/settings/NotificationsPage';
import { BillingPage } from '@/features/settings/BillingPage';
import { HelpCenterPage } from '@/features/support/HelpCenterPage';

import { JobDetailsPage } from '@/features/jobs/JobDetailsPage';
import { ResumeDetailsPage } from '@/features/resumes/ResumeDetailsPage';
import { CoverLetterDetailsPage } from '@/features/cover-letter/CoverLetterDetailsPage';

import { OnboardingPage } from '@/features/auth/OnboardingPage';

const LandingPage = () => (
  <>
    <Navbar />
    <Hero />
    <LogoTicker />
    <FeatureShowcase />
    <FeaturesGrid />
    <CTASection />
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <ToastProvider />
      <div className="min-h-screen bg-background-light font-sans text-text-light selection:bg-gray-900 selection:text-white overflow-x-hidden">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-resumes" element={<MyResumesPage />} />
          <Route path="/resumes/:id" element={<ResumeDetailsPage />} />
          <Route path="/resume-builder" element={<ResumeBuilderPage />} />
          <Route path="/cover-letter-builder" element={<CoverLetterBuilderPage />} />
          <Route path="/cover-letters/:id" element={<CoverLetterDetailsPage />} />
          <Route path="/ats-analyzer" element={<ATSAnalyzerPage />} />
          <Route path="/jobs" element={<JobMatchesPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/mock-interview" element={<MockInterviewPage />} />
          <Route path="/mock-interview/configure" element={<InterviewConfigurationPage />} />
          <Route path="/mock-interview/session" element={<ActiveInterviewSession />} />
          <Route path="/mock-interview/results" element={<InterviewResultsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/account" element={<AccountPage />} />
          <Route path="/settings/notifications" element={<NotificationsPage />} />
          <Route path="/settings/billing" element={<BillingPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
        </Routes>
      </div>
    </Router>
  )
}




export default App
