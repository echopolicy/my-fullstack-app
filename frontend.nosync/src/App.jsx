// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';

import routes from './routes';
import Seo from './components/Seo'



function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow p-4">
              <Routes>
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
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;