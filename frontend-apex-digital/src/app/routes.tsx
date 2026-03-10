import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { CareersPage } from './pages/CareersPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLogin } from './pages/AdminLogin';
import { AdminPanel } from './pages/AdminPanel';
import { AdminJobsPage } from './pages/admin/AdminJobsPage';
import { AdminJobFormPage } from './pages/admin/AdminJobFormPage';
import { AdminApplicantsPage } from './pages/admin/AdminApplicantsPage';
import { isAuthenticated } from './config/auth';
import { LanguageProvider } from './contexts/LanguageContext';

// Route guard для защищенных маршрутов
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
}

// Wrapper для Layout с LanguageProvider
function LayoutWithProvider() {
  return (
    <LanguageProvider>
      <Layout />
    </LanguageProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutWithProvider />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'services',
        element: <ServicesPage />,
      },
      {
        path: 'projects',
        element: <ProjectsPage />,
      },
      {
        path: 'projects/:slug',
        element: <ProjectDetailPage />,
      },
      {
        path: 'careers',
        element: <CareersPage />,
      },
      {
        path: 'careers/:slug',
        element: <JobDetailPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'contacts',
        element: <ContactPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <LanguageProvider>
        <AdminLogin />
      </LanguageProvider>
    ),
  },
  {
    path: '/admin/panel',
    element: (
      <LanguageProvider>
        <ProtectedRoute>
          <AdminPanel />
        </ProtectedRoute>
      </LanguageProvider>
    ),
  },
  {
    path: '/admin/jobs',
    element: (
      <LanguageProvider>
        <ProtectedRoute>
          <AdminJobsPage />
        </ProtectedRoute>
      </LanguageProvider>
    ),
  },
  {
    path: '/admin/jobs/new',
    element: (
      <LanguageProvider>
        <ProtectedRoute>
          <AdminJobFormPage />
        </ProtectedRoute>
      </LanguageProvider>
    ),
  },
  {
    path: '/admin/jobs/:id',
    element: (
      <LanguageProvider>
        <ProtectedRoute>
          <AdminJobFormPage />
        </ProtectedRoute>
      </LanguageProvider>
    ),
  },
  {
    path: '/admin/applicants',
    element: (
      <LanguageProvider>
        <ProtectedRoute>
          <AdminApplicantsPage />
        </ProtectedRoute>
      </LanguageProvider>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);