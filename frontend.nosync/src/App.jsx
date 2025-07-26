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

function App() {
  return (
    <Router>
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
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;