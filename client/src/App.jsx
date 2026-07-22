import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Navbar from './components/ui/Navbar';
import Footer from './components/ui/Footer';
import HeroSection from './pages/public/HeroSection';
import AboutSection from './pages/public/AboutSection';
import ProjectsSection from './pages/public/ProjectsSection';
import ContactSection from './pages/public/ContactSection';

// Review Page
import ReviewPage from './pages/review/ReviewPage';

// Admin Pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProjectManagerPage from './pages/admin/ProjectManagerPage';
import ReviewTokensPage from './pages/admin/ReviewTokensPage';
import ProfileEditorPage from './pages/admin/ProfileEditorPage';
import MessagesPage from './pages/admin/MessagesPage';

// Portfolio Landing Page
const PortfolioPage = () => (
  <>
    <Navbar />
    <main>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#f1f5f9',
              border: '1px solid rgba(6,182,212,0.2)',
              borderRadius: '12px',
              fontSize: '0.9rem',
            },
          }}
        />
        <Routes>
          {/* Public Portfolio */}
          <Route path="/" element={<PortfolioPage />} />

          {/* Review Page (token-based, no auth) */}
          <Route path="/review/:token" element={<ReviewPage />} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="projects" element={<ProjectManagerPage />} />
            <Route path="reviews" element={<ReviewTokensPage />} />
            <Route path="profile" element={<ProfileEditorPage />} />
            <Route path="messages" element={<MessagesPage />} />
          </Route>

          {/* Catch all unknown URLs and redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
