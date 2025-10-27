import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import CommitPage from './pages/CommitPage';
import ReadmePage from './pages/ReadmePage';
import UploadZipPage from './pages/UploadZipPage';
import ChangelogPage from './pages/ChangelogPage';
import ResponsiveCheckerPage from './pages/ResponsiveCheckerPage';

export default function App() {
  const location = useLocation();
  const isCheckerPage = location.pathname === '/responsive-checker';

  return (
    // Hapus 'flex flex-col' jika di checker page, biarkan page-nya ngatur layout sendiri
    <div className={`bg-white min-h-screen ${isCheckerPage ? '' : 'flex flex-col'}`}>
      
      {/* Sembunyikan Navbar jika di checker page */}
      {!isCheckerPage && <Navbar />}

      {/* Ganti 'flex-grow' jadi 'h-screen' di checker page 
        biar <main> ngisi seluruh layar
      */}
      <main className={isCheckerPage ? 'h-screen' : 'flex-grow'}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/commit" element={<CommitPage />} />
          <Route path="/readme" element={<ReadmePage />} />
          <Route path="/upload-zip" element={<UploadZipPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/responsive-checker" element={<ResponsiveCheckerPage />} />
        </Routes>
      </main>
      
      {/* Sembunyikan Footer jika di checker page */}
      {!isCheckerPage && <Footer />}
    </div>
  );
}