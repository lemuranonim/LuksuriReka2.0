'use client';

import { useState, useEffect, useRef } from 'react';
import { exportToJpgZip, exportToPptx, exportToPdf } from './exportUtils';

export default function PresentationViewer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [errorToken, setErrorToken] = useState('');

  const [currentSlide, setCurrentSlide] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  // State untuk mengatur apakah panel UI (tombol-tombol) ditampilkan atau tidak
  const [isUiVisible, setIsUiVisible] = useState(true);

  // Sesuai dengan request, 3 slide
  const totalSlides = 3;
  const viewerRef = useRef<HTMLDivElement>(null);

  // 1. Deteksi Perubahan Fullscreen (Penting agar tombol Esc juga terdeteksi)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull) {
        setIsUiVisible(true); // Selalu tampilkan UI jika tidak fullscreen
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 2. Navigasi Keyboard & Shortcut Tombol 'H' untuk Hide/Show
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Jika sedang loading/exporting, matikan fungsi keyboard navigasi
      if (exporting) return;

      if (e.key === 'ArrowRight' || e.key === ' ') { // Tombol panah kanan atau Spasi
        e.preventDefault(); // Mencegah scroll bawah saat tekan spasi
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides));
      } else if (e.key === 'ArrowLeft') { // Tombol panah kiri
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 1));
      } else if (e.key.toLowerCase() === 'h') {
        // Tekan 'H' untuk toggle (sembunyikan/tampilkan) panel
        setIsUiVisible((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides, exporting]);

  // 3. Efek Auto-Hide UI jika mouse tidak bergerak saat Fullscreen
  // Serta munculkan saat diklik di sembarang tempat
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleInteraction = () => {
      setIsUiVisible(true); // Tampilkan UI saat mouse bergerak atau layar diklik

      if (isFullscreen) {
        clearTimeout(timeout);
        // Sembunyikan otomatis setelah 2.5 detik mouse/layar diam
        timeout = setTimeout(() => {
          setIsUiVisible(false);
        }, 2500);
      }
    };

    window.addEventListener('mousemove', handleInteraction);
    // Tambahan event listener untuk touch (bagi pengguna layar sentuh) dan klik
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('click', handleInteraction);

    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      clearTimeout(timeout);
    };
  }, [isFullscreen]);

  // Fitur Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  };

  // Helper untuk Trigger Download File
  const forceDownload = (blob: Blob | null, filename: string) => {
    if (!blob) {
      alert("Terjadi kesalahan saat memproses file. Silakan coba lagi.");
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handler Export
  const handleExport = async (type: 'jpg' | 'pptx' | 'pdf') => {
    if (exporting) return;
    setExporting(type); // Memicu UI Loading muncul
    try {
      if (type === 'jpg') {
        const blob = await exportToJpgZip(totalSlides);
        forceDownload(blob, 'Maintenance-Proposal-Slides.zip');
      } else if (type === 'pptx') {
        const blob = await exportToPptx(totalSlides);
        forceDownload(blob, 'Maintenance-Proposal.pptx');
      } else if (type === 'pdf') {
        const blob = await exportToPdf(totalSlides);
        forceDownload(blob, 'Maintenance-Proposal.pdf');
      }
    } catch (err) {
      console.error("Gagal melakukan export: ", err);
      alert("Gagal melakukan export. Cek koneksi atau periksa konsol.");
    } finally {
      setExporting(null); // Menghilangkan UI Loading setelah selesai
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim().toUpperCase() === 'ADVFISCAL2627') {
      setIsAuthenticated(true);
      setErrorToken('');
    } else {
      setErrorToken('Token tidak valid. Akses ditolak.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-screen h-screen bg-[#050510] flex items-center justify-center font-sans overflow-hidden relative">
        <style dangerouslySetInnerHTML={{ __html: `@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');` }} />
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl"></div>
        <div className="relative z-10 bg-slate-800/80 border border-violet-500/30 p-10 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.2)] max-w-sm w-full mx-4 text-center">
          <div className="w-20 h-20 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-shield-halved text-4xl text-violet-400"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Secure Access</h2>
          <p className="text-slate-400 text-sm mb-6">Masukkan Security Token untuk melihat dokumen proposal ini.</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter Access Token"
                className="w-full bg-slate-900/80 border border-slate-600 rounded-lg px-4 py-3 text-white text-center tracking-widest focus:outline-none focus:border-violet-500 transition-colors"
              />
              {errorToken && <p className="text-red-400 text-xs mt-2 text-left"><i className="fa-solid fa-circle-exclamation mr-1"></i>{errorToken}</p>}
            </div>
            <button type="submit" className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              <i className="fa-solid fa-key"></i> Verifikasi
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={viewerRef}
      // Sembunyikan kursor mouse juga jika UI sedang disembunyikan
      className={`relative w-screen h-screen bg-[#050510] overflow-hidden font-sans ${!isUiVisible && isFullscreen ? 'cursor-none' : ''}`}
    >

      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
        .spin { display: inline-block; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        /* Animasi pulsa untuk teks loading */
        @keyframes pulse-text {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse-text {
          animation: pulse-text 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}} />

      {/* RENDER IFRAME SLIDES */}
      {Array.from({ length: totalSlides }).map((_, index) => {
        const slideNum = index + 1;
        const isActive = currentSlide === slideNum;

        return (
          <iframe
            key={slideNum}
            src={`/reports/maintenance-proposal/slide${slideNum}.html`}
            className={`absolute top-0 left-0 w-full h-full border-none transition-all duration-700 ease-in-out origin-center
              ${isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'}`}
            title={`Slide ${slideNum}`}
          />
        );
      })}

      {/* ========================================================= */}
      {/* OVERLAY LOADING (Hanya muncul saat exporting berjalan) */}
      {/* ========================================================= */}
      <div
        className={`absolute inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-500
          ${exporting ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Background Overlay Gelap (Glassmorphism) */}
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"></div>

        {/* Kotak Loading */}
        <div className="relative flex flex-col items-center bg-slate-800/60 border border-violet-500/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.2)]">
          <div className="w-16 h-16 border-4 border-slate-600 border-t-violet-500 rounded-full spin mb-6"></div>
          <h3 className="text-2xl font-bold text-white mb-2">Memproses Dokumen</h3>
          <p className="text-slate-300 text-center max-w-sm animate-pulse-text">
            Mohon tunggu sebentar. Sistem sedang merender {totalSlides} slide presentasi dengan presisi tinggi ke format {exporting?.toUpperCase()}...
          </p>
        </div>
      </div>
      {/* ========================================================= */}


      {/* PANEL EXPORT (Pojok Kanan Atas) */}
      <div className={`absolute top-6 right-6 flex gap-3 z-50 transition-all duration-500 ease-in-out
        ${isUiVisible && !exporting ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}
      `}>
        <button
          onClick={() => handleExport('jpg')}
          disabled={!!exporting}
          className="flex items-center gap-2 bg-slate-900/80 hover:bg-violet-600 text-white border border-violet-500/50 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
        >
          <i className="fa-solid fa-file-zipper"></i>
          JPG (Zip)
        </button>
        <button
          onClick={() => handleExport('pdf')}
          disabled={!!exporting}
          className="flex items-center gap-2 bg-slate-900/80 hover:bg-red-600 text-white border border-red-500/50 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
        >
          <i className="fa-solid fa-file-pdf"></i>
          PDF
        </button>
        <button
          onClick={() => handleExport('pptx')}
          disabled={!!exporting}
          className="flex items-center gap-2 bg-slate-900/80 hover:bg-amber-600 text-white border border-amber-500/50 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
        >
          <i className="fa-solid fa-file-powerpoint"></i>
          PPTX
        </button>
      </div>

      {/* PANEL NAVIGASI (Bawah Tengah) */}
      <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 transition-all duration-500 ease-in-out
        ${isUiVisible && !exporting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
      `}>
        <button
          onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 1))}
          disabled={currentSlide === 1 || !!exporting}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-violet-500 disabled:opacity-30 transition-all cursor-pointer"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div className="min-w-[80px] text-center">
          <span className="text-white font-mono font-bold tracking-widest text-sm">
            {currentSlide} <span className="text-slate-500">/</span> {totalSlides}
          </span>
        </div>
        <button
          onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides))}
          disabled={currentSlide === totalSlides || !!exporting}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-violet-500 disabled:opacity-30 transition-all cursor-pointer"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
        <div className="w-[1px] h-6 bg-slate-700 mx-2"></div>
        <button
          onClick={toggleFullscreen}
          disabled={!!exporting}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-violet-500 disabled:opacity-30 transition-all cursor-pointer"
        >
          <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
        </button>
      </div>

      {/* Area yang bisa diklik untuk navigasi cepat saat UI tersembunyi */}
      {isFullscreen && !isUiVisible && !exporting && (
        <div className="absolute inset-0 z-40 flex">
          <div
            className="w-1/2 h-full cursor-none"
            onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 1))}
          />
          <div
            className="w-1/2 h-full cursor-none"
            onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides))}
          />
        </div>
      )}

    </div>
  );
}
