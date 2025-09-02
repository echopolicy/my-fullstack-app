import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PollFeed from './pages/PollFeed';
import PollDetail from './pages/PollDetail';
import PollResults from './pages/PollResults';
import PollCreate from './pages/PollCreate';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Terms from './pages/Terms';
import PrivacyPolicy from "./pages/PrivacyPolicy";  
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PollEdit from './pages/PollEdit';
import Forum from './components/Forum';

// Import AuthProvider (not default)
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      {/* Wrap everything inside AuthProvider */}
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/polls" element={<PollFeed />} />
              <Route path="/polls/:id" element={<PollDetail />} />
              <Route path="/results/:id" element={<PollResults />} />
              <Route path="/admin/create" element={<PollCreate />} />
              <Route path="/create" element={<PollCreate />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="admin/edit/:id" element={<PollEdit />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/forum" element={<Forum/>}/>
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;