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
  const [isUiVisible, setIsUiVisible] = useState(true);

  const totalSlides = 1;
  const viewerRef = useRef<HTMLDivElement>(null);

  // 1. Deteksi Perubahan Fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull) setIsUiVisible(true);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 2. Navigasi Keyboard & Shortcut 'H' untuk Hide/Show
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (exporting) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 1));
      } else if (e.key.toLowerCase() === 'h') {
        setIsUiVisible((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides, exporting]);

  // 3. Auto-Hide UI saat Fullscreen
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleInteraction = () => {
      setIsUiVisible(true);
      if (isFullscreen) {
        clearTimeout(timeout);
        timeout = setTimeout(() => setIsUiVisible(false), 2500);
      }
    };
    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('click', handleInteraction);
    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      clearTimeout(timeout);
    };
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  };

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

  const handleExport = async (type: 'jpg' | 'pptx' | 'pdf') => {
    if (exporting) return;
    setExporting(type);
    try {
      if (type === 'jpg') {
        const blob = await exportToJpgZip(totalSlides);
        forceDownload(blob, 'QA-Budget-Slides.zip');
      } else if (type === 'pptx') {
        const blob = await exportToPptx(totalSlides);
        forceDownload(blob, 'QA-Budget.pptx');
      } else if (type === 'pdf') {
        const blob = await exportToPdf(totalSlides);
        forceDownload(blob, 'QA-Budget.pdf');
      }
    } catch (err) {
      console.error("Gagal melakukan export: ", err);
      alert("Gagal melakukan export. Cek koneksi atau periksa konsol.");
    } finally {
      setExporting(null);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim().toUpperCase() === 'QABUDGET2627') {
      setIsAuthenticated(true);
      setErrorToken('');
    } else {
      setErrorToken('Token tidak valid. Akses ditolak.');
    }
  };

  // ─── LOGIN SCREEN ───
  if (!isAuthenticated) {
    return (
      <div className="w-screen h-screen flex items-center justify-center font-sans overflow-hidden relative"
        style={{ background: 'linear-gradient(145deg, #f0f4f8 0%, #e8f0eb 50%, #eef2f7 100%)' }}>

        <style dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@400;500;600&display=swap');
          .login-input:focus { outline: none; border-color: #237a3f !important; box-shadow: 0 0 0 3px rgba(35,122,63,0.12); }
          .login-btn:hover { background: #1a5c2e !important; }
        `}} />

        {/* Decorative corner accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
          background: 'linear-gradient(90deg, #1a5c2e, #2fa355, #b8871f)'
        }} />

        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e6ec',
          padding: '44px 48px',
          borderRadius: '20px',
          boxShadow: '0 8px 40px rgba(15,32,64,0.10), 0 2px 8px rgba(15,32,64,0.06)',
          maxWidth: '420px',
          width: '100%',
          margin: '0 16px',
          textAlign: 'center',
          position: 'relative',
        }}>
          {/* Top accent bar */}
          <div style={{
            position: 'absolute', top: 0, left: '48px', right: '48px', height: '3px',
            background: 'linear-gradient(90deg, #1a5c2e, #2fa355)',
            borderRadius: '0 0 3px 3px'
          }} />

          {/* Logo mark */}
          <div style={{
            width: '64px', height: '64px',
            background: 'linear-gradient(135deg, #1a5c2e, #2fa355)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 4px 16px rgba(26,92,46,0.20)'
          }}>
            <svg viewBox="0 0 28 28" fill="none" width="30" height="30">
              <path d="M14 24 C14 24 4 17 4 10 C4 6.1 8.5 3 14 3 C19.5 3 24 6.1 24 10 C24 17 14 24 14 24Z" fill="rgba(255,255,255,0.92)" />
              <path d="M14 24 L14 11" stroke="rgba(26,92,46,0.5)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M14 15 C11.5 13 8 12.5 8 12.5" stroke="rgba(26,92,46,0.35)" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M14 12 C16.5 10 20 9.5 20 9.5" stroke="rgba(26,92,46,0.35)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>

          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 600, color: '#237a3f', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '6px' }}>
            PT Advanta Seeds Indonesia
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: '#0f2040', marginBottom: '6px' }}>
            QA Digitalization
          </h2>
          <p style={{ fontSize: '13.5px', color: '#637085', marginBottom: '28px', lineHeight: 1.5 }}>
            Masukkan Security Token untuk mengakses<br />dokumen proposal anggaran.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Masukkan Access Token"
              className="login-input"
              style={{
                width: '100%',
                background: '#f7f8fa',
                border: '1.5px solid #e2e6ec',
                borderRadius: '10px',
                padding: '12px 16px',
                color: '#1c2535',
                fontSize: '14px',
                textAlign: 'center',
                letterSpacing: '0.12em',
                fontFamily: 'monospace',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
            />
            {errorToken && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff5f5', border: '1px solid #fecaca', borderRadius: '8px', padding: '8px 12px' }}>
                <span style={{ fontSize: '12px', color: '#c53030' }}>⚠ {errorToken}</span>
              </div>
            )}
            <button
              type="submit"
              className="login-btn"
              style={{
                width: '100%',
                background: '#237a3f',
                color: '#fff',
                fontWeight: 600,
                fontSize: '14px',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                transition: 'background 0.2s',
                fontFamily: "'Source Sans 3', sans-serif",
              }}
            >
              Verifikasi Akses
            </button>
          </form>

          <p style={{ fontSize: '11px', color: '#a0aab8', marginTop: '20px' }}>
            Dokumen ini bersifat rahasia — hanya untuk Direksi & Manajemen
          </p>
        </div>
      </div>
    );
  }

  // ─── MAIN VIEWER ───
  return (
    <div
      ref={viewerRef}
      style={{ background: '#e8ecf0' }}
      className={`relative w-screen h-screen overflow-hidden font-sans ${!isUiVisible && isFullscreen ? 'cursor-none' : ''}`}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

        .spin { display: inline-block; animation: spin 0.9s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .export-btn { transition: all 0.18s ease; }
        .export-btn:hover { transform: translateY(-1px); }
        .export-btn:active { transform: translateY(0); }

        .nav-btn { transition: all 0.18s ease; }
        .nav-btn:hover:not(:disabled) { background: #237a3f !important; color: #fff !important; border-color: #237a3f !important; }
        .nav-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .pulse-soft { animation: pulse-soft 2s ease-in-out infinite; }

        /* Subtle slide shadow */
        .slide-frame {
          box-shadow: 0 4px 40px rgba(15,32,64,0.18), 0 1px 6px rgba(15,32,64,0.10);
          border-radius: 2px;
          overflow: hidden;
        }
      `}} />

      {/* SLIDE IFRAMES */}
      {Array.from({ length: totalSlides }).map((_, index) => {
        const slideNum = index + 1;
        const isActive = currentSlide === slideNum;
        return (
          <iframe
            key={slideNum}
            src={`/reports/qa-budget/slide${slideNum}.html`}
            className={`absolute top-0 left-0 w-full h-full border-none transition-all duration-600 ease-in-out
              ${isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-98 z-0 pointer-events-none'}`}
            title={`Slide ${slideNum}`}
          />
        );
      })}

      {/* ── EXPORT LOADING OVERLAY ── */}
      <div className={`absolute inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-400
        ${exporting ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0" style={{ background: 'rgba(247,248,250,0.88)', backdropFilter: 'blur(12px)' }} />
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e6ec',
          boxShadow: '0 8px 40px rgba(15,32,64,0.12)',
          borderRadius: '18px',
          padding: '40px 48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #1a5c2e, #2fa355, #b8871f)', borderRadius: '18px 18px 0 0' }} />
          <div className="spin" style={{ width: '48px', height: '48px', border: '3px solid #e2e6ec', borderTopColor: '#237a3f', borderRadius: '50%', marginBottom: '20px' }} />
          <h3 style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: '20px', fontWeight: 700, color: '#0f2040', marginBottom: '8px' }}>
            Memproses Dokumen
          </h3>
          <p className="pulse-soft" style={{ fontSize: '13.5px', color: '#637085', textAlign: 'center', maxWidth: '320px', lineHeight: 1.6 }}>
            Sistem sedang merender {totalSlides} slide ke format <strong>{exporting?.toUpperCase()}</strong>. Mohon tunggu…
          </p>
        </div>
      </div>

      {/* ── TOP BAR: BRANDING + EXPORT ── */}
      <div className={`absolute top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-400 ease-in-out
        ${isUiVisible && !exporting ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.90) 100%)',
          borderBottom: '1px solid #e2e6ec',
          backdropFilter: 'blur(12px)',
          padding: '10px 20px',
          boxShadow: '0 1px 8px rgba(15,32,64,0.07)',
        }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px', height: '30px',
            background: 'linear-gradient(135deg, #1a5c2e, #2fa355)',
            borderRadius: '7px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 20 20" fill="none" width="17" height="17">
              <path d="M10 17.5 C10 17.5 3.5 12.5 3.5 8 C3.5 5 6.5 2.5 10 2.5 C13.5 2.5 16.5 5 16.5 8 C16.5 12.5 10 17.5 10 17.5Z" fill="rgba(255,255,255,0.9)" />
              <path d="M10 17.5 L10 8.5" stroke="rgba(26,92,46,0.5)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f2040', lineHeight: 1.2, fontFamily: 'Source Sans 3, sans-serif' }}>
              PT Advanta Seeds Indonesia
            </div>
            <div style={{ fontSize: '10.5px', color: '#637085', fontFamily: 'Source Sans 3, sans-serif' }}>
              QA Digitalization — Budget Proposal FY 2026–2027
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: '#a0aab8', marginRight: '4px', fontFamily: 'Source Sans 3, sans-serif' }}>Ekspor:</span>
          <button
            className="export-btn"
            onClick={() => handleExport('jpg')}
            disabled={!!exporting}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#f0f4f8', border: '1px solid #d0d8e4',
              color: '#2c3e55', padding: '6px 14px', borderRadius: '7px',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Source Sans 3, sans-serif',
            }}
          >
            <i className="fa-solid fa-file-zipper" style={{ fontSize: '11px', color: '#637085' }} />
            JPG / ZIP
          </button>
          <button
            className="export-btn"
            onClick={() => handleExport('pdf')}
            disabled={!!exporting}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#fff5f5', border: '1px solid #fecaca',
              color: '#c53030', padding: '6px 14px', borderRadius: '7px',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Source Sans 3, sans-serif',
            }}
          >
            <i className="fa-solid fa-file-pdf" style={{ fontSize: '11px' }} />
            PDF
          </button>
          <button
            className="export-btn"
            onClick={() => handleExport('pptx')}
            disabled={!!exporting}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#fffbeb', border: '1px solid #fcd34d',
              color: '#92611a', padding: '6px 14px', borderRadius: '7px',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Source Sans 3, sans-serif',
            }}
          >
            <i className="fa-solid fa-file-powerpoint" style={{ fontSize: '11px' }} />
            PPTX
          </button>
        </div>
      </div>

      {/* ── BOTTOM NAV BAR ── */}
      <div className={`absolute bottom-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-400 ease-in-out
        ${isUiVisible && !exporting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}`}
        style={{
          background: 'linear-gradient(0deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.90) 100%)',
          borderTop: '1px solid #e2e6ec',
          backdropFilter: 'blur(12px)',
          padding: '10px 24px',
          boxShadow: '0 -1px 8px rgba(15,32,64,0.06)',
        }}>

        {/* Left: shortcut hint */}
        <div style={{ fontSize: '11px', color: '#b0bbc8', fontFamily: 'Source Sans 3, sans-serif' }}>
          Tekan <kbd style={{ background: '#f0f2f5', border: '1px solid #d8dde5', borderRadius: '4px', padding: '1px 6px', fontSize: '10px', color: '#637085' }}>H</kbd> untuk sembunyikan panel
        </div>

        {/* Center: Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="nav-btn"
            onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 1))}
            disabled={currentSlide === 1 || !!exporting}
            style={{
              width: '34px', height: '34px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '8px', background: '#f0f2f5', border: '1px solid #dde2ea',
              color: '#3a4558', cursor: 'pointer',
            }}
          >
            <i className="fa-solid fa-chevron-left" style={{ fontSize: '12px' }} />
          </button>

          <div style={{
            background: '#f7f8fa', border: '1px solid #e2e6ec',
            borderRadius: '8px', padding: '5px 18px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f2040', fontFamily: 'DM Mono, monospace' }}>{currentSlide}</span>
            <span style={{ fontSize: '12px', color: '#c8d0dc' }}>/</span>
            <span style={{ fontSize: '13px', color: '#637085', fontFamily: 'DM Mono, monospace' }}>{totalSlides}</span>
          </div>

          <button
            className="nav-btn"
            onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides))}
            disabled={currentSlide === totalSlides || !!exporting}
            style={{
              width: '34px', height: '34px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '8px', background: '#f0f2f5', border: '1px solid #dde2ea',
              color: '#3a4558', cursor: 'pointer',
            }}
          >
            <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }} />
          </button>
        </div>

        {/* Right: Fullscreen */}
        <button
          className="nav-btn"
          onClick={toggleFullscreen}
          disabled={!!exporting}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            background: '#f0f2f5', border: '1px solid #dde2ea',
            color: '#3a4558', padding: '6px 14px', borderRadius: '8px',
            fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'Source Sans 3, sans-serif',
          }}
        >
          <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`} style={{ fontSize: '11px' }} />
          {isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
        </button>
      </div>

      {/* Touch Areas untuk navigasi saat fullscreen */}
      {isFullscreen && !isUiVisible && !exporting && (
        <div className="absolute inset-0 z-40 flex">
          <div className="w-1/2 h-full cursor-none" onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 1))} />
          <div className="w-1/2 h-full cursor-none" onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides))} />
        </div>
      )}
    </div>
  );
}