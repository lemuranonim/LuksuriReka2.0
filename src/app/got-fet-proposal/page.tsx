'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  FileArchive,
  FileText,
  Loader2,
  LockKeyhole,
  Maximize2,
  Minimize2,
  Presentation,
  ShieldCheck,
} from 'lucide-react';
import { exportToJpgZip, exportToPdf, exportToPptx } from './exportUtils';

const totalSlides = 2;
const reportPath = '/reports/got-fet-proposal';

export default function GotFetProposalViewer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [errorToken, setErrorToken] = useState('');
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [exporting, setExporting] = useState<'jpg' | 'pptx' | 'pdf' | null>(null);
  const [isUiVisible, setIsUiVisible] = useState(true);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const full = Boolean(document.fullscreenElement);
      setIsFullscreen(full);
      if (!full) setIsUiVisible(true);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (exporting) return;
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides));
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 1));
      } else if (event.key.toLowerCase() === 'h') {
        setIsUiVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [exporting]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
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

  const forceDownload = (blob: Blob | null, filename: string) => {
    if (!blob) {
      alert('File gagal diproses. Coba ulang export.');
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async (type: 'jpg' | 'pptx' | 'pdf') => {
    if (exporting) return;
    setExporting(type);

    try {
      if (type === 'jpg') forceDownload(await exportToJpgZip(totalSlides), 'GOT-FET-Proposal-Slides.zip');
      else if (type === 'pptx') forceDownload(await exportToPptx(totalSlides), 'GOT-FET-Proposal-Rp80jt.pptx');
      else forceDownload(await exportToPdf(totalSlides), 'GOT-FET-Proposal-Rp80jt.pdf');
    } catch (err) {
      console.error('Export failed:', err);
      alert('Gagal melakukan export. Silakan coba kembali.');
    } finally {
      setExporting(null);
    }
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (tokenInput.trim().toUpperCase() === 'GOTFET80') {
      setIsAuthenticated(true);
      setErrorToken('');
      return;
    }

    setErrorToken('Token tidak valid. Akses ditolak.');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) viewerRef.current?.requestFullscreen().catch(console.error);
    else document.exitFullscreen();
  };

  if (!isAuthenticated) {
    return (
      <main className="flex h-screen w-screen items-center justify-center overflow-hidden bg-[#f5faff] px-5 text-[#06214a]">
        <div className="absolute inset-x-0 top-0 h-1 bg-[#25b34b]" />
        <section className="w-full max-w-[430px] rounded-[18px] border border-[#d9e6f3] bg-white p-9 shadow-[0_18px_60px_rgba(6,52,111,0.12)]">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf8ee]">
            <LockKeyhole className="h-8 w-8 text-[#0b8e45]" />
          </div>
          <p className="mb-2 text-center text-xs font-black uppercase tracking-[0.18em] text-[#0b8e45]">Proposal GOT + FET</p>
          <h1 className="mb-3 text-center text-2xl font-black">Akses dokumen proposal</h1>
          <p className="mx-auto mb-7 max-w-[300px] text-center text-sm leading-6 text-[#6b7a90]">
            Masukkan token untuk membuka dokumen pengajuan fixed cost Rp80 juta.
          </p>

          <form className="space-y-3" onSubmit={handleLogin}>
            <input
              type="password"
              value={tokenInput}
              onChange={(event) => setTokenInput(event.target.value)}
              placeholder="Masukkan Access Token"
              className="w-full rounded-xl border border-[#d9e6f3] bg-[#f5faff] px-4 py-3 text-center font-mono text-sm tracking-[0.12em] text-[#06214a] outline-none transition focus:border-[#25b34b] focus:ring-4 focus:ring-[#25b34b]/10"
            />
            {errorToken && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-xs font-bold text-red-600">{errorToken}</div>}
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#06346f] px-4 py-3 text-sm font-black text-white transition hover:bg-[#031a3d]" type="submit">
              <ShieldCheck className="h-4 w-4" />
              Verifikasi Akses
            </button>
          </form>
          <p className="mt-5 text-center text-xs text-[#9aa8b8]">Security token: GOTFET80</p>
        </section>
      </main>
    );
  }

  const hasVisibleChrome = isUiVisible && !exporting;
  const slideViewportStyle = {
    top: hasVisibleChrome ? '58px' : 0,
    height: hasVisibleChrome ? 'calc(100% - 116px)' : '100%',
  };
  const slideFrameStyle = {
    width: hasVisibleChrome ? 'min(calc(100vw - 32px), calc((100vh - 148px) * 16 / 9))' : 'min(calc(100vw - 32px), calc((100vh - 32px) * 16 / 9))',
    height: hasVisibleChrome ? 'min(calc(100vh - 148px), calc((100vw - 32px) * 9 / 16))' : 'min(calc(100vh - 32px), calc((100vw - 32px) * 9 / 16))',
  };

  return (
    <main ref={viewerRef} className={`relative h-screen w-screen overflow-hidden bg-[#e8eef5] ${!isUiVisible && isFullscreen ? 'cursor-none' : ''}`}>
      {Array.from({ length: totalSlides }).map((_, index) => {
        const slideNumber = index + 1;
        const active = currentSlide === slideNumber;
        return (
          <div
            key={slideNumber}
            className={`absolute left-0 flex w-full items-center justify-center px-4 transition duration-500 ${active ? 'z-10 scale-100 opacity-100' : 'z-0 scale-[0.985] opacity-0 pointer-events-none'}`}
            style={slideViewportStyle}
          >
            <iframe
              src={`${reportPath}/slide${slideNumber}.html`}
              title={`GOT FET proposal slide ${slideNumber}`}
              className="border-0 bg-white shadow-[0_16px_46px_rgba(6,52,111,0.12)]"
              style={slideFrameStyle}
            />
          </div>
        );
      })}

      <div className={`absolute inset-0 z-[100] flex items-center justify-center bg-white/85 backdrop-blur-md transition ${exporting ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div className="flex flex-col items-center rounded-2xl border border-[#d9e6f3] bg-white px-10 py-9 text-[#06214a] shadow-[0_18px_60px_rgba(6,52,111,0.15)]">
          <Loader2 className="mb-4 h-11 w-11 animate-spin text-[#25b34b]" />
          <h2 className="text-xl font-black">Memproses Dokumen</h2>
          <p className="mt-2 max-w-[320px] text-center text-sm text-[#6b7a90]">
            Menyiapkan {totalSlides} slide dalam format {exporting?.toUpperCase()}.
          </p>
        </div>
      </div>

      <nav className={`absolute inset-x-0 top-0 z-50 flex items-center justify-between border-b border-[#d9e6f3] bg-white/95 px-5 py-3 text-[#06214a] shadow-sm backdrop-blur-md transition ${isUiVisible && !exporting ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'}`}>
        <div className="flex items-center gap-3">
          <img src={`${reportPath}/logo_got_fet_unbox.png`} alt="GOT FET" className="h-9 w-11 object-contain" />
          <div>
            <p className="text-sm font-black leading-tight">Proposal GOT + FET</p>
            <p className="text-xs font-semibold text-[#6b7a90]">GOT + FET Fixed Cost Proposal | Rp80 juta</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => handleExport('jpg')} className="flex items-center gap-2 rounded-lg border border-[#d9e6f3] bg-[#f5faff] px-3 py-2 text-xs font-black text-[#06346f] transition hover:bg-[#eaf8ee]">
            <FileArchive className="h-4 w-4" />
            JPG
          </button>
          <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 rounded-lg border border-[#ffd5db] bg-[#fff1f3] px-3 py-2 text-xs font-black text-[#c33445] transition hover:bg-[#ffe7ea]">
            <FileText className="h-4 w-4" />
            PDF
          </button>
          <button onClick={() => handleExport('pptx')} className="flex items-center gap-2 rounded-lg border border-[#b9e9c7] bg-[#eaf8ee] px-3 py-2 text-xs font-black text-[#0b8e45] transition hover:bg-[#dbf4e2]">
            <Presentation className="h-4 w-4" />
            PPTX
          </button>
        </div>
      </nav>

      <div className={`absolute inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 border-t border-[#d9e6f3] bg-white/95 px-4 py-3 text-[#06214a] shadow-sm backdrop-blur-md transition sm:px-6 ${isUiVisible && !exporting ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'}`}>
        <div className="hidden items-center gap-2 text-xs font-semibold text-[#6b7a90] md:flex">
          <Download className="h-4 w-4" />
          Gunakan tombol panah untuk navigasi, H untuk menyembunyikan panel.
        </div>
        <div className="flex flex-1 items-center justify-center gap-3 md:flex-none">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 1))}
            disabled={currentSlide === 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d9e6f3] bg-[#f5faff] transition hover:bg-[#eaf8ee] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-20 rounded-lg border border-[#d9e6f3] bg-[#f5faff] px-4 py-2 text-center font-mono text-sm font-black">
            {currentSlide} / {totalSlides}
          </div>
          <button
            onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides))}
            disabled={currentSlide === totalSlides}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d9e6f3] bg-[#f5faff] transition hover:bg-[#eaf8ee] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <button onClick={toggleFullscreen} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#d9e6f3] bg-[#f5faff] text-xs font-black transition hover:bg-[#eaf8ee] sm:w-auto sm:gap-2 sm:px-3 sm:py-2">
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          <span className="hidden whitespace-nowrap sm:inline">{isFullscreen ? 'Keluar full screen' : 'Full screen'}</span>
        </button>
      </div>

      {isFullscreen && !isUiVisible && !exporting && (
        <div className="absolute inset-0 z-40 flex">
          <div className="h-full w-1/2 cursor-none" onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 1))} />
          <div className="h-full w-1/2 cursor-none" onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides))} />
        </div>
      )}
    </main>
  );
}
