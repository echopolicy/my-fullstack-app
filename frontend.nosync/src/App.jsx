// App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext'; 

import routes from './routes';
import Seo from './components/Seo';

// ✅ Admin-specific pages
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProtectedAdminRoute from "./pages/Admin/ProtectedAdminRoute"; 

function AppWrapper() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const embedMode = params.get('embed') === '1';

  return (
    <>
      {!embedMode && <Navbar />}
      <main className="flex-grow p-4">
        <Routes>
          {/* ✅ Regular user routes */}
          {routes.map(({ path, element, seo }) => (
            <Route
              key={path}
              path={path}
              element={
                <>
                  <Seo {...seo} />
                  {element}
                </>
              }
            />
          ))}

          {/* ✅ Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </main>
      {!embedMode && <Footer />}
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        {/* ✅ Wrap both user + admin contexts */}
        <AuthProvider>
          <AdminAuthProvider>
            <div className="flex flex-col min-h-screen">
              <AppWrapper />
            </div>
          </AdminAuthProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;