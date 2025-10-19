import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import CommitPage from './pages/CommitPage';

function App() {
  return (
    <div className="bg-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/commit" element={<CommitPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;