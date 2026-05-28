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
  Warehouse,
} from 'lucide-react';
import { exportToJpgZip, exportToPdf, exportToPptx } from './exportUtils';

const totalSlides = 3;
const reportPath = '/reports/warehouse-quotation';

export default function WarehouseQuotationViewer() {
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
      if (type === 'jpg') forceDownload(await exportToJpgZip(totalSlides), 'Warehouse-Quotation-Slides.zip');
      else if (type === 'pptx') forceDownload(await exportToPptx(totalSlides), 'Warehouse-Digitalization-Quotation-Rp75jt.pptx');
      else forceDownload(await exportToPdf(totalSlides), 'Warehouse-Digitalization-Quotation-Rp75jt.pdf');
    } catch (err) {
      console.error('Export failed:', err);
      alert('Gagal melakukan export. Silakan coba kembali.');
    } finally {
      setExporting(null);
    }
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (tokenInput.trim().toUpperCase() === 'WAREHOUSE75') {
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
      <main className="flex h-screen w-screen items-center justify-center overflow-hidden bg-[#f4fbff] px-5 text-[#06214a]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0f6f62] via-[#3aa7d7] to-[#d7a33f]" />
        <section className="relative w-full max-w-[430px] rounded-[20px] border border-[#dbe9f2] bg-white p-9 shadow-[0_24px_70px_rgba(6,52,111,0.13)]">
          <div className="absolute left-10 right-10 top-0 h-[3px] rounded-b bg-gradient-to-r from-[#0f6f62] via-[#67c7b6] to-[#d7a33f]" />
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8f7f3]">
            <LockKeyhole className="h-8 w-8 text-[#0f6f62]" />
          </div>
          <p className="mb-2 text-center text-xs font-black uppercase tracking-[0.18em] text-[#0f6f62]">Warehouse Quotation</p>
          <h1 className="mb-3 text-center text-2xl font-black">Akses proposal quotation</h1>
          <p className="mx-auto mb-7 max-w-[310px] text-center text-sm leading-6 text-[#63758a]">
            Masukkan token untuk membuka pengajuan Warehouse Digitalization Rp75 juta.
          </p>

          <form className="space-y-3" onSubmit={handleLogin}>
            <input
              type="password"
              value={tokenInput}
              onChange={(event) => setTokenInput(event.target.value)}
              placeholder="Masukkan Access Token"
              className="w-full rounded-xl border border-[#dbe9f2] bg-[#f6fbff] px-4 py-3 text-center font-mono text-sm tracking-[0.12em] text-[#06214a] outline-none transition focus:border-[#0f6f62] focus:ring-4 focus:ring-[#0f6f62]/10"
            />
            {errorToken && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-xs font-bold text-red-600">{errorToken}</div>}
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f6f62] px-4 py-3 text-sm font-black text-white transition hover:bg-[#0b554d]" type="submit">
              <ShieldCheck className="h-4 w-4" />
              Verifikasi Akses
            </button>
          </form>
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
    <main ref={viewerRef} className={`relative h-screen w-screen overflow-hidden bg-[#eaf1f5] ${!isUiVisible && isFullscreen ? 'cursor-none' : ''}`}>
      {Array.from({ length: totalSlides }).map((_, index) => {
        const slideNumber = index + 1;
        const active = currentSlide === slideNumber;
        return (
          <div
            key={slideNumber}
            className={`absolute left-0 flex w-full items-center justify-center px-4 transition duration-500 ${active ? 'z-10 scale-100 opacity-100' : 'pointer-events-none z-0 scale-[0.985] opacity-0'}`}
            style={slideViewportStyle}
          >
            <iframe
              src={`${reportPath}/slide${slideNumber}.html`}
              title={`Warehouse quotation slide ${slideNumber}`}
              className="border-0 bg-white shadow-[0_18px_52px_rgba(6,52,111,0.13)]"
              style={slideFrameStyle}
            />
          </div>
        );
      })}

      <div className={`absolute inset-0 z-[100] flex items-center justify-center bg-white/85 backdrop-blur-md transition ${exporting ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div className="flex flex-col items-center rounded-2xl border border-[#dbe9f2] bg-white px-10 py-9 text-[#06214a] shadow-[0_18px_60px_rgba(6,52,111,0.15)]">
          <Loader2 className="mb-4 h-11 w-11 animate-spin text-[#0f6f62]" />
          <h2 className="text-xl font-black">Memproses Dokumen</h2>
          <p className="mt-2 max-w-[320px] text-center text-sm text-[#63758a]">
            Menyiapkan {totalSlides} slide dalam format {exporting?.toUpperCase()}.
          </p>
        </div>
      </div>

      <nav className={`absolute inset-x-0 top-0 z-50 flex items-center justify-between border-b border-[#dbe9f2] bg-white/95 px-5 py-3 text-[#06214a] shadow-sm backdrop-blur-md transition ${isUiVisible && !exporting ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'}`}>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f7f3] text-[#0f6f62]">
            <Warehouse className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black leading-tight">Warehouse Quotation</p>
            <p className="text-xs font-semibold text-[#63758a]">Standard Recommended | Rp75 juta + OPEX Rp15 juta</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => handleExport('jpg')} className="flex items-center gap-2 rounded-lg border border-[#dbe9f2] bg-[#f6fbff] px-3 py-2 text-xs font-black text-[#1b4f75] transition hover:bg-[#e8f7f3]">
            <FileArchive className="h-4 w-4" />
            JPG
          </button>
          <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 rounded-lg border border-[#ffd5db] bg-[#fff1f3] px-3 py-2 text-xs font-black text-[#c33445] transition hover:bg-[#ffe7ea]">
            <FileText className="h-4 w-4" />
            PDF
          </button>
          <button onClick={() => handleExport('pptx')} className="flex items-center gap-2 rounded-lg border border-[#bde9de] bg-[#e8f7f3] px-3 py-2 text-xs font-black text-[#0f6f62] transition hover:bg-[#dcf2ec]">
            <Presentation className="h-4 w-4" />
            PPTX
          </button>
        </div>
      </nav>

      <div className={`absolute inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 border-t border-[#dbe9f2] bg-white/95 px-4 py-3 text-[#06214a] shadow-sm backdrop-blur-md transition sm:px-6 ${isUiVisible && !exporting ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'}`}>
        <div className="hidden items-center gap-2 text-xs font-semibold text-[#63758a] md:flex">
          <Download className="h-4 w-4" />
          Gunakan tombol panah untuk navigasi, H untuk menyembunyikan panel.
        </div>
        <div className="flex flex-1 items-center justify-center gap-3 md:flex-none">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 1))}
            disabled={currentSlide === 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dbe9f2] bg-[#f6fbff] transition hover:bg-[#e8f7f3] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-20 rounded-lg border border-[#dbe9f2] bg-[#f6fbff] px-4 py-2 text-center font-mono text-sm font-black">
            {currentSlide} / {totalSlides}
          </div>
          <button
            onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides))}
            disabled={currentSlide === totalSlides}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dbe9f2] bg-[#f6fbff] transition hover:bg-[#e8f7f3] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <button onClick={toggleFullscreen} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#dbe9f2] bg-[#f6fbff] text-xs font-black transition hover:bg-[#e8f7f3] sm:w-auto sm:gap-2 sm:px-3 sm:py-2">
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
