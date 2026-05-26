const REPORT_PATH = '/reports/qa-plant-lab-proposal';
const SLIDE_WIDTH = 1920;
const SLIDE_HEIGHT = 1080;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function waitForImage(image: HTMLImageElement): Promise<void> {
  return new Promise((resolve) => {
    if (image.complete && image.naturalWidth > 0) {
      resolve();
      return;
    }

    const done = () => resolve();
    image.onload = done;
    image.onerror = done;
    setTimeout(done, 2500);
  });
}

async function inlineImages(doc: Document) {
  const images = Array.from(doc.images);

  await Promise.all(
    images.map(async (image) => {
      const rawSrc = image.getAttribute('src');
      if (!rawSrc || rawSrc.startsWith('data:')) {
        await waitForImage(image);
        return;
      }

      const absoluteSrc = new URL(rawSrc, doc.baseURI).toString();

      try {
        const response = await fetch(absoluteSrc, { cache: 'force-cache' });
        if (response.ok) {
          image.src = await blobToDataUrl(await response.blob());
        } else {
          image.src = absoluteSrc;
        }
      } catch {
        image.src = absoluteSrc;
      }

      await waitForImage(image);
      if (image.decode) await image.decode().catch(() => undefined);
    }),
  );
}

async function captureSlideUrl(slideNumber: number): Promise<string | null> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.cssText =
      `position:fixed; top:0; left:0; width:${SLIDE_WIDTH}px; height:${SLIDE_HEIGHT}px; border:none; opacity:0.001; z-index:-9999; pointer-events:none;`;
    iframe.src = `${REPORT_PATH}/slide${slideNumber}.html`;
    document.body.appendChild(iframe);

    iframe.onload = async () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) {
          document.body.removeChild(iframe);
          return resolve(null);
        }

        await wait(800);
        if (doc.fonts) await doc.fonts.ready;
        await inlineImages(doc);

        const styleInject = doc.createElement('style');
        styleInject.innerHTML = `
          html, body {
            width: ${SLIDE_WIDTH}px !important;
            height: ${SLIDE_HEIGHT}px !important;
            min-width: ${SLIDE_WIDTH}px !important;
            min-height: ${SLIDE_HEIGHT}px !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }
          .slide {
            width: ${SLIDE_WIDTH}px !important;
            height: ${SLIDE_HEIGHT}px !important;
          }
          * {
            animation: none !important;
            transition: none !important;
          }
        `;
        doc.head.appendChild(styleInject);
        await wait(300);

        const html2canvas = (await import('html2canvas')).default;
        const target = doc.querySelector<HTMLElement>('.slide') ?? doc.body;
        const canvas = await html2canvas(target, {
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          windowWidth: SLIDE_WIDTH,
          windowHeight: SLIDE_HEIGHT,
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          imageTimeout: 15000,
          logging: false,
          backgroundColor: '#f5faff',
        });

        document.body.removeChild(iframe);
        resolve(canvas.toDataURL('image/jpeg', 0.95));
      } catch (err) {
        console.error(`Gagal capture slide ${slideNumber}:`, err);
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
        resolve(null);
      }
    };
  });
}

export async function exportToJpgZip(totalSlides: number): Promise<Blob | null> {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  const folder = zip.folder('QA-Plant-Lab-Proposal-Slides')!;

  for (let i = 1; i <= totalSlides; i += 1) {
    const dataUrl = await captureSlideUrl(i);
    if (dataUrl) {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      folder.file(`Slide-${String(i).padStart(2, '0')}.jpg`, blob);
    }
  }

  return zip.generateAsync({ type: 'blob' });
}

export async function exportToPptx(totalSlides: number): Promise<Blob | null> {
  const PptxGenJS = (await import('pptxgenjs')).default;
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Luksuri Reka';
  pptx.subject = 'Proposal Plant + Lab';
  pptx.title = 'Proposal Implementasi Plant + Lab';

  for (let i = 1; i <= totalSlides; i += 1) {
    const dataUrl = await captureSlideUrl(i);
    if (dataUrl) {
      const slide = pptx.addSlide();
      slide.background = { color: 'F5FAFF' };
      slide.addImage({
        data: dataUrl,
        x: 0,
        y: 0,
        w: 13.333,
        h: 7.5,
      });
    }
  }

  return (await pptx.write({ outputType: 'blob' })) as Blob;
}

export async function exportToPdf(totalSlides: number): Promise<Blob | null> {
  const jsPDF = (await import('jspdf')).jsPDF;
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1920, 1080] });

  for (let i = 1; i <= totalSlides; i += 1) {
    const dataUrl = await captureSlideUrl(i);
    if (dataUrl) {
      if (i > 1) pdf.addPage([1920, 1080], 'landscape');
      pdf.addImage(dataUrl, 'JPEG', 0, 0, 1920, 1080);
    }
  }

  return pdf.output('blob');
}
