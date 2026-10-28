import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PageView from './pages/PageView';
import StudyAbroadPage from './pages/StudyAbroadPage';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './context/AuthContext';

const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminPages = lazy(() => import('./pages/AdminPages'));
const AdminPageEditor = lazy(() => import('./pages/AdminPageEditor'));
const AdminStudyAbroad = lazy(() => import('./pages/AdminStudyAbroad'));
const AdminCountryUniversities = lazy(
  () => import('./pages/AdminCountryUniversities')
);
const AdminSettings = lazy(() => import('./pages/AdminSettings'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));

function PrivateAdmin({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm font-semibold text-gray-500">
        Checking your session...
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return isAdmin ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center bg-white text-sm font-semibold text-gray-500">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="about" element={<PageView slug="about" />} />
          <Route path="services" element={<PageView slug="services" />} />
          <Route path="web-development" element={<PageView slug="web-development" />} />
          <Route path="video-editing" element={<PageView slug="video-editing" />} />
          <Route path="photo-editing" element={<PageView slug="photo-editing" />} />
          <Route path="it-solutions" element={<PageView slug="it-solutions" />} />
          <Route path="portfolio" element={<PageView slug="universities" />} />
          <Route path="study-abroad" element={<StudyAbroadPage />} />
          <Route path="universities" element={<PageView slug="universities" />} />
          <Route path="team" element={<PageView slug="team" />} />
          <Route path="contact" element={<PageView slug="contact" />} />
          <Route path="america" element={<PageView slug="america" />} />
          <Route path="uk" element={<PageView slug="uk" />} />
          <Route path="canada" element={<PageView slug="canada" />} />
          <Route path="australia" element={<PageView slug="australia" />} />
          <Route path="japan" element={<PageView slug="japan" />} />
          <Route path="south-korea" element={<PageView slug="south-korea" />} />
          <Route path=":slug" element={<PageView />} />
        </Route>
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        <Route
          path="/admin"
          element={
            <PrivateAdmin>
              <AdminDashboard />
            </PrivateAdmin>
          }
        />
        <Route
          path="/admin/pages"
          element={
            <PrivateAdmin>
              <AdminPages />
            </PrivateAdmin>
          }
        />
        <Route
          path="/admin/edit/:id"
          element={
            <PrivateAdmin>
              <AdminPageEditor />
            </PrivateAdmin>
          }
        />
        <Route
          path="/admin/study-abroad"
          element={
            <PrivateAdmin>
              <AdminStudyAbroad />
            </PrivateAdmin>
          }
        />
        <Route
          path="/admin/study-abroad/edit/:id"
          element={
            <PrivateAdmin>
              <AdminPageEditor />
            </PrivateAdmin>
          }
        />
        <Route
          path="/admin/study-abroad/:slug/universities"
          element={
            <PrivateAdmin>
              <AdminCountryUniversities />
            </PrivateAdmin>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateAdmin>
              <AdminUsers />
            </PrivateAdmin>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <PrivateAdmin>
              <AdminSettings />
            </PrivateAdmin>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
