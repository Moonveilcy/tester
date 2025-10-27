import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, Tablet, Monitor, RotateCw } from 'lucide-react';

// Definisikan ukuran device
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

  // Ref buat nyimpen tag viewport asli
  const viewportMetaRef = useRef<HTMLMetaElement | null>(null);
  const originalViewportContentRef = useRef<string | null>(null);

  useEffect(() => {
    // --- INI BAGIAN PENTINGNYA ---
    // 1. Cari tag viewport yang udah ada
    let viewportTag = document.querySelector('meta[name="viewport"]');
    
    if (viewportTag) {
      // 2. Simpen tag & konten aslinya
      viewportMetaRef.current = viewportTag as HTMLMetaElement;
      originalViewportContentRef.current = viewportTag.getAttribute('content');
    } else {
      // Kalo gak ada, bikin baru (jarang terjadi di app React modern)
      viewportTag = document.createElement('meta');
      viewportTag.setAttribute('name', 'viewport');
      document.head.appendChild(viewportTag);
      viewportMetaRef.current = viewportTag as HTMLMetaElement;
      originalViewportContentRef.current = 'width=device-width, initial-scale=1.0';
    }
    
    // 3. Set viewport baru yang super lebar
    viewportMetaRef.current.setAttribute('content', 'width=5000');
    // --- SELESAI BAGIAN PENTING ---

    // 4. Cleanup function (dijalanin pas keluar dari halaman ini)
    return () => {
      if (viewportMetaRef.current && originalViewportContentRef.current) {
        // 5. Balikin viewport ke setelan aslinya
        viewportMetaRef.current.setAttribute('content', originalViewportContentRef.current);
      }
    };
  }, []); // Array kosong berarti cuma jalan sekali pas masuk, dan cleanup pas keluar

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = 'https://' + url;
    }
    setDisplayUrl(finalUrl);
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

  return (
    // Area "canvas" yang lebar dengan background grid
    // Kita set min-width biar dia selebar viewport yang kita paksa (5000px)
    <div 
      className="w-full min-h-screen py-12 bg-white bg-[radial-gradient(#e0e0e0_1px,transparent_1px)] [background-size:16px_16px]"
      style={{ minWidth: 5000 }} // Paksa lebar minimum
    >
      {/* Kontainer buat isi konten, kita taruh di tengah area 5000px */}
      <div className="w-full flex flex-col items-center px-4">
        
        {/* Kontrol (Judul, Input, Tombol) kita batasi lebarnya biar gak aneh */}
        <div className="max-w-2xl w-full text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">Responsive Checker</h1>
          <p className="text-lg text-gray-600 mt-2">Test your website's responsiveness across various devices.</p>
        </div>

        <form onSubmit={handleUrlSubmit} className="flex flex-col sm:flex-row gap-2 max-w-2xl w-full mx-auto mb-8">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., example.com)"
            className="flex-grow w-full p-3 border-2 border-black rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          >
            Test URL
          </button>
        </form>

        {/* Kontrol Device (bikin scrollable kalo gak muat) */}
        <div className="w-full max-w-4xl overflow-x-auto pb-2 mb-6">
          <div className="flex flex-nowrap items-center justify-start sm:justify-center gap-2 p-4 bg-gray-100 rounded-lg shadow-sm min-w-max">
            {devicePresets.map((device) => {
              const Icon = device.icon;
              const isActive = device.width === currentWidth && device.height === currentHeight;
              return (
                <button
                  key={device.name}
                  onClick={() => setDevice(device.width, device.height)}
                  title={`${device.name} (${device.width}x${device.height})`}
                  className={`flex items-center gap-2 p-2 rounded-md transition-colors flex-shrink-0 ${
                    isActive ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'
                  } border border-gray-300`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium hidden md:inline">{device.name}</span>
                  <span className="text-sm font-medium md:hidden">{isActive ? device.name.split(' ')[0] : ''}</span>
                </button>
              );
            })}
            <button
              onClick={rotate}
              title="Rotate"
              className="flex items-center gap-2 p-2 rounded-md bg-white text-gray-600 hover:bg-gray-200 border border-gray-300 flex-shrink-0"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tampilan Iframe (tetap di tengah) */}
        <div className="flex justify-center w-full py-2 mt-8">
          <div
            className="bg-gray-800 p-4 rounded-xl shadow-2xl transition-all duration-300 ease-in-out flex-shrink-0"
            style={{ width: currentWidth + 32 }}
          >
            <p className="text-center text-white text-sm mb-2 font-mono">{currentWidth} x {currentHeight}</p>
            <iframe
              // Ganti key iframe setiap URL berubah biar React nge-force re-render
              key={displayUrl} 
              src={displayUrl}
              title="Responsive Preview"
              className="bg-white"
              style={{ width: currentWidth, height: currentHeight, transition: 'all 0.3s ease-in-out' }}
              onError={(e) => console.error("Iframe load error. Target site might have X-Frame-Options set.", e)}
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}