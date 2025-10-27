import React, { useState } from 'react';
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
];

export default function ResponsiveCheckerPage() {
  const [url, setUrl] = useState('https://example.com');
  const [displayUrl, setDisplayUrl] = useState('https://example.com');
  const [size, setSize] = useState({ width: 1280, height: 800 });
  const [isRotated, setIsRotated] = useState(false);

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

  // Tampilkan ukuran yang sedang aktif (bisa jadi rotasi)
  const currentWidth = isRotated ? size.height : size.width;
  const currentHeight = isRotated ? size.width : size.height;

  return (
    <div className="bg-white text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">Responsive Checker</h1>
          <p className="text-lg text-gray-600 mt-2">Test your website's responsiveness across various devices.</p>
        </div>

        {/* Input URL */}
        <form onSubmit={handleUrlSubmit} className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto mb-8">
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

        {/* Kontrol Device */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-4 bg-gray-100 rounded-lg mb-8 shadow-sm">
          {devicePresets.map((device) => {
            const Icon = device.icon;
            const isActive = device.width === currentWidth && device.height === currentHeight;
            return (
              <button
                key={device.name}
                onClick={() => setDevice(device.width, device.height)}
                title={`${device.name} (${device.width}x${device.height})`}
                className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
                  isActive ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'
                } border border-gray-300`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium hidden md:inline">{device.name}</span>
              </button>
            );
          })}
          <button
            onClick={rotate}
            title="Rotate"
            className="flex items-center gap-2 p-2 rounded-md bg-white text-gray-600 hover:bg-gray-200 border border-gray-300"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>

        {/* Tampilan Iframe */}
        <div className="flex justify-center">
          <div className="bg-gray-800 p-4 rounded-xl shadow-2xl transition-all duration-300 ease-in-out" style={{ width: currentWidth + 32, height: currentHeight + 32 }}>
            <p className="text-center text-white text-sm mb-2 font-mono">{currentWidth} x {currentHeight}</p>
            <iframe
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