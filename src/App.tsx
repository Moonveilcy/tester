import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import CommitPage from './pages/CommitPage';
import ReadmePage from './pages/ReadmePage';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/commit" element={<CommitPage />} />
            <Route path="/readme" element={<ReadmePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}