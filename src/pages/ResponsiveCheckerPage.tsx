import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, Tablet, Monitor, RotateCw, Home, Zap, GitBranch, FileText } from 'lucide-react';

// Definisikan ukuran device, mirip kayak di web itu
const devicePresets = [
  { name: 'Mobile (S)', width: 360, height: 740, icon: Smartphone },
  { name: 'Mobile (M)', width: 390, height: 844, icon: Smartphone },
  { name: 'Mobile (L)', width: 430, height: 932, icon: Smartphone },
  { name: 'Tablet (M)', width: 768, height: 1024, icon: Tablet },
  { name: 'Tablet (L)', width: 1024, height: 768, icon: Tablet },
  { name: 'Desktop', width: 1280, height: 800, icon: Monitor },
  { name: 'Full HD', width: 1920, height: 1080, icon: Monitor },
  { name: '4K', width: 3840, height: 2160, icon: Monitor },
];

export default function ResponsiveCheckerPage() {
  const [url, setUrl] = useState('https://example.com');
  const [displayUrl, setDisplayUrl] = useState('https://example.com');
  const [size, setSize] = useState({ width: 1280, height: 800 });
  const [isRotated, setIsRotated] = useState(false);

  // --- INI DIA LOGIKA VIEWPORT YANG HILANG ---
  const viewportMetaRef = useRef<HTMLMetaElement | null>(null);
  const originalViewportContentRef = useRef<string | null>(null);

  useEffect(() => {
    // 1. Cari tag viewport yang udah ada
    let viewportTag = document.querySelector('meta[name="viewport"]');
    
    if (viewportTag) {
      // 2. Simpen tag & konten aslinya
      viewportMetaRef.current = viewportTag as HTMLMetaElement;
      originalViewportContentRef.current = viewportTag.getAttribute('content');
    } else {
      // Kalo gak ada, bikin baru
      viewportTag = document.createElement('meta');
      viewportTag.setAttribute('name', 'viewport');
      document.head.appendChild(viewportTag);
      viewportMetaRef.current = viewportTag as HTMLMetaElement;
      originalViewportContentRef.current = 'width=device-width, initial-scale=1.0';
    }
    
    // 3. Set viewport baru yang super lebar (INI KUNCINYA)
    // Ini bilang ke browser, "Anggap layar lu lebarnya 5000px"
    viewportMetaRef.current.setAttribute('content', 'width=5000');
    
    // 4. Cleanup function (dijalanin pas keluar dari halaman ini)
    return () => {
      if (viewportMetaRef.current && originalViewportContentRef.current) {
        // 5. Balikin viewport ke setelan aslinya
        viewportMetaRef.current.setAttribute('content', originalViewportContentRef.current);
      }
    };
  }, []); // Array kosong berarti cuma jalan sekali pas masuk, dan cleanup pas keluar
  // --- SELESAI LOGIKA VIEWPORT ---


  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = 'https://' + url;
    }
    setDisplayUrl(finalUrl);
    setIsRotated(false);
  };

  const setDevice = (width: number, height: number) => {
    setSize({ width, height });
    setIsRotated(false);
  };

  const rotate = () => {
    setSize({ width: size.height, height: size.width });
    setIsRotated(!isRotated);
  };

  const currentWidth = isRotated ? size.height : size.width;
  const currentHeight = isRotated ? size.width : size.height;

  // Kita tentuin lebar minimal 'world' kita.
  // Harus cukup lebar buat nampung iframe + sidebar + padding
  const minWorldWidth = currentWidth + 56 + 64; // 56px sidebar + 64px padding

  return (
    // HAPUS 'overflow-hidden' dan 'h-screen'.
    // Ganti 'w-full' jadi 'min-w-full'
    // 'min-h-screen' biar tingginya minimal se-layar
    <div 
      className="flex min-w-full min-h-screen bg-gray-100 text-gray-800"
      // Kasih tau 'world' nya harus selebar apa
      style={{ minWidth: `${minWorldWidth}px` }}
    >
      {/* 1. Sidebar Kiri (Fixed) */}
      {/* 'position: fixed' sekarang ngikut ke viewport 5000px, jadi dia nempel di kiri */}
      <nav className="w-14 h-screen bg-black text-gray-400 flex flex-col items-center py-4 gap-4 fixed top-0 left-0 z-30 shadow-lg">
        <a href="/" title="Home" className="p-2 rounded-lg hover:bg-gray-700 hover:text-white transition-colors">
          <Home className="w-6 h-6" />
        </a>
        <div className="p-2 rounded-lg bg-purple-600 text-white" title="Responsive Tool">
          <Smartphone className="w-6 h-6" />
        </div>
        <a href="/commit" title="Commit & Push" className="p-2 rounded-lg hover:bg-gray-700 hover:text-white transition-colors">
          <GitBranch className="w-6 h-6" />
        </a>
        <a href="/readme" title="README Generator" className="p-2 rounded-lg hover:bg-gray-700 hover:text-white transition-colors">
          <FileText className="w-6 h-6" />
        </a>
      </nav>

      {/* 2. Main Area (Kanan Sidebar) */}
      <div className="flex-1 flex flex-col pl-14"> {/* Offset sidebar (pl-14) */}
        
        {/* 2a. Header Atas (Fixed) */}
        {/* 'position: fixed' juga ngikut viewport 5000px */}
        <header className="w-full bg-white border-b border-gray-200 fixed top-0 left-14 right-0 z-20 shadow-sm"> {/* Offset sidebar (left-14) */}
          {/* Baris 1: URL Input & Ukuran */}
          <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100">
            <form onSubmit={handleUrlSubmit} className="flex-grow flex gap-2 max-w-lg">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL..."
                className="flex-grow w-full p-2 border-2 border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Go
              </button>
            </form>
            <div className="text-gray-600 font-mono text-lg ml-4 p-2 bg-gray-100 rounded-md hidden lg:block">
              {currentWidth} x {currentHeight}
            </div>
          </div>

          {/* Baris 2: Device Buttons */}
          <div className="w-full h-14 overflow-x-auto bg-gray-50">
            <div className="flex flex-nowrap items-center justify-center h-full gap-2 px-4 min-w-max">
              {/* ... (Isi tombol-tombol device, GAK ADA PERUBAHAN DISINI) ... */}
              {devicePresets.map((device) => {
                const Icon = device.icon;
                const isBaseActive = device.width === size.width && device.height === size.height && !isRotated;
                const isRotatedActive = device.width === size.height && device.height === size.width && isRotated;
                const isActive = isBaseActive || isRotatedActive;

                return (
                  <button
                    key={device.name}
                    onClick={() => setDevice(device.width, device.height)}
                    title={`${device.name} (${device.width}x${device.height})`}
                    className={`flex items-center gap-2 p-2 rounded-md transition-colors flex-shrink-0 ${
                      isActive ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'
                    } border border-gray-300 shadow-sm`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium hidden md:inline">{device.name}</span>
                  </button>
                );
              })}
              <button
                onClick={rotate}
                title="Rotate"
                className={`flex items-center gap-2 p-2 rounded-md transition-colors flex-shrink-0 ${
                  isRotated ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'
                } border border-gray-300 shadow-sm`}
              >
                <RotateCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* 2b. Content Canvas (BISA SCROLL) */}
        {/* HAPUS 'overflow-auto' dari sini. Biar browser yang scroll */}
        <main className="flex-1 pt-28 bg-gray-200 bg-[radial-gradient(#bbb_1px,transparent_1px)] [background-size:20px_20px]">
          
          {/* Wrapper buat ngasih padding & centering */}
          {/* 'min-h-full' biar tingginya ngikutin <main> */}
          <div className="w-full p-8 flex justify-center items-start min-h-full">
            
            {/* Bingkai Iframe */}
            <div 
              className="bg-black p-4 rounded-xl shadow-2xl transition-all duration-300 ease-in-out"
              style={{ width: currentWidth + 32, height: currentHeight + 56 }} 
            >
              {/* Info ukuran di dalam bingkai */}
              <p className="text-center text-white text-sm mb-2 font-mono">{currentWidth} x {currentHeight}</p>
              
              {/* Iframe */}
              <iframe
                key={displayUrl} // Force re-render pas URL ganti
                src={displayUrl}
                title="Responsive Preview"
                className="bg-white"
                style={{ width: currentWidth, height: currentHeight, transition: 'all 0.3s ease-in-out' }}
                onError={(e) => console.error("Iframe load error. Target site might have X-Frame-Options set.", e)}
              ></iframe>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}