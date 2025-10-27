import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import CommitPage from './pages/CommitPage';
import ReadmePage from './pages/ReadmePage';
import UploadZipPage from './pages/UploadZipPage';
import ChangelogPage from './pages/ChangelogPage';
import ResponsiveCheckerPage from './pages/ResponsiveCheckerPage'; // Impor halaman baru

export default function App() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/commit" element={<CommitPage />} />
          <Route path="/readme" element={<ReadmePage />} />
          <Route path="/upload-zip" element={<UploadZipPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          {/* Tambahkan rute baru di sini */}
          <Route path="/responsive-checker" element={<ResponsiveCheckerPage />} /> 
        </Routes>
      </main>
      <Footer />
    </div>
  );
}