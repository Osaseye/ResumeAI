import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
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
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';

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
  useEffect(() => {
    localStorage.removeItem('device_job_api_date');
  }, []);

  return (
    <Router>
      <ToastProvider />
      <NotificationProvider>
        <div className="min-h-screen bg-background-light font-sans text-text-light selection:bg-gray-900 selection:text-white overflow-x-hidden">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes */}
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/my-resumes" element={<ProtectedRoute><MyResumesPage /></ProtectedRoute>} />
          <Route path="/resumes/:id" element={<ProtectedRoute><ResumeDetailsPage /></ProtectedRoute>} />
          <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilderPage /></ProtectedRoute>} />
          <Route path="/cover-letter-builder" element={<ProtectedRoute><CoverLetterBuilderPage /></ProtectedRoute>} />
          <Route path="/cover-letters/:id" element={<ProtectedRoute><CoverLetterDetailsPage /></ProtectedRoute>} />
          <Route path="/ats-analyzer" element={<ProtectedRoute><ATSAnalyzerPage /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><JobMatchesPage /></ProtectedRoute>} />
          <Route path="/jobs/:id" element={<ProtectedRoute><JobDetailsPage /></ProtectedRoute>} />
          <Route path="/mock-interview" element={<ProtectedRoute><MockInterviewPage /></ProtectedRoute>} />
          <Route path="/mock-interview/configure" element={<ProtectedRoute><InterviewConfigurationPage /></ProtectedRoute>} />
          <Route path="/mock-interview/session" element={<ProtectedRoute><ActiveInterviewSession /></ProtectedRoute>} />
          <Route path="/mock-interview/results" element={<ProtectedRoute><InterviewResultsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/settings/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/settings/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/settings/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><HelpCenterPage /></ProtectedRoute>} />
          <Route path="*" element={<DashboardPage />} />
        </Routes>
        </div>
      </NotificationProvider>
    </Router>
  )
}

export default App
