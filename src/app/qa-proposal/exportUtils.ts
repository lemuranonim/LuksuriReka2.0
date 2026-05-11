/**
 * Export utilities untuk QA Fixed Budget Proposal
 */

async function captureSlideUrl(slideNumber: number): Promise<string | null> {
    return new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:fixed; top:0; left:0; width:1920px; height:1080px; border:none; opacity:0.01; z-index:-9999; pointer-events:none;';
        iframe.src = `/reports/qa-proposal/slide${slideNumber}.html`;
        document.body.appendChild(iframe);

        iframe.onload = async () => {
            try {
                const doc = iframe.contentDocument || iframe.contentWindow?.document;
                if (!doc) { document.body.removeChild(iframe); return resolve(null); }
                await new Promise(r => setTimeout(r, 2000));
                if (doc.fonts) await doc.fonts.ready;

                const styleInject = doc.createElement('style');
                styleInject.innerHTML = `
                    html, body { width: 1920px !important; height: 1080px !important; min-width: 1920px !important; min-height: 1080px !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; }
                    .slide-wrapper { width: 1920px !important; height: 1080px !important; min-height: 1080px !important; }
                    * { animation: none !important; transition: none !important; }
                `;
                doc.head.appendChild(styleInject);
                await new Promise(r => setTimeout(r, 500));

                const html2canvas = (await import('html2canvas')).default;
                const canvas = await html2canvas(doc.body, {
                    width: 1920, height: 1080, windowWidth: 1920, windowHeight: 1080,
                    scale: 1.5, useCORS: true, allowTaint: true, logging: false, backgroundColor: '#f7f8fa'
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
    const folder = zip.folder('QA-Proposal-Slides')!;
    for (let i = 1; i <= totalSlides; i++) {
        const dataUrl = await captureSlideUrl(i);
        if (dataUrl) { const res = await fetch(dataUrl); const blob = await res.blob(); folder.file(`Slide-${String(i).padStart(2, '0')}.jpg`, blob); }
    }
    return await zip.generateAsync({ type: 'blob' });
}

export async function exportToPptx(totalSlides: number): Promise<Blob | null> {
    const PptxGenJS = (await import('pptxgenjs')).default;
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    for (let i = 1; i <= totalSlides; i++) {
        const dataUrl = await captureSlideUrl(i);
        if (dataUrl) { const slide = pptx.addSlide(); slide.addImage({ data: dataUrl, x: 0, y: 0, w: '100%', h: '100%', sizing: { type: 'cover', w: 13.33, h: 7.5 } }); }
    }
    return (await pptx.write({ outputType: 'blob' })) as Blob;
}

export async function exportToPdf(totalSlides: number): Promise<Blob | null> {
    const jsPDF = (await import('jspdf')).jsPDF;
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1920, 1080] });
    for (let i = 1; i <= totalSlides; i++) {
        const dataUrl = await captureSlideUrl(i);
        if (dataUrl) { if (i > 1) pdf.addPage([1920, 1080], 'landscape'); pdf.addImage(dataUrl, 'JPEG', 0, 0, 1920, 1080); }
    }
    return pdf.output('blob');
}
