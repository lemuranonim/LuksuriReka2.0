"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCheck, Copy, Mail, MessageCircle } from "lucide-react";
import { briefDisclaimer, briefSections, buildBrief, contactLinks, emptyBrief, needLabels, toggleNeed, type Brief } from "@/lib/composer";
import { type Locale, type Need, text } from "@/lib/site-content";
import { trackSiteEvent } from "@/lib/site-analytics";

export default function Composer({ locale, initialNeed }: { locale: Locale; initialNeed?: Need }) {
  const uid = useId();
  const [brief, setBrief] = useState<Brief>({ ...emptyBrief, needs: initialNeed ? [initialNeed] : [] });
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const started = useRef(false);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);
  const summary = buildBrief(brief, locale);
  const sections = briefSections(brief, locale);
  const links = contactLinks(summary, locale);
  const title = [text(locale, "Apa yang ingin Anda bangun?", "What would you like to build?"), text(locale, "Ceritakan konteksnya.", "Tell us a little about it."), text(locale, "Ini awal percakapannya.", "A starting point for our conversation.")];

  useEffect(() => {
    if (copyState === "failed") {
      summaryRef.current?.focus();
      summaryRef.current?.select();
    }
  }, [copyState]);

  function start() { if (!started.current) { trackSiteEvent("composer_start"); started.current = true; } }
  function move(next: number) {
    if (next > 0 && brief.needs.length === 0) { setError(text(locale, "Pilih satu kebutuhan, atau pilih belum yakin.", "Choose a need, or select that you are not sure yet.")); return; }
    start(); setError(""); setCopyState("idle"); setStep(next);
    if (next === 2) trackSiteEvent("composer_summary_generated", { needs_count: brief.needs.length });
    requestAnimationFrame(() => stepHeading.current?.focus());
  }
  async function copy() {
    try { await navigator.clipboard.writeText(summary); setCopyState("copied"); trackSiteEvent("composer_copy"); }
    catch { setCopyState("failed"); }
  }
  function update<K extends keyof Brief>(key: K, value: Brief[K]) { start(); setBrief(current => ({ ...current, [key]: value })); }

  return <section className="lr-composer" aria-label={text(locale, "Susun ringkasan kebutuhan proyek", "Create a project brief")}>
    <div className="lr-composer-top"><span className="lr-eyebrow">PROJECT COMPOSER</span><span className="lr-step-count">{step + 1} / 3</span></div>
    <div className="lr-composer-progress" aria-hidden="true">{[0, 1, 2].map(i => <span key={i} className={i <= step ? "is-complete" : ""} />)}</div>
    <h3 ref={stepHeading} tabIndex={-1} className="lr-composer-title">{title[step]}</h3>
    <p className="lr-composer-intro">{step === 0 ? text(locale, "Pilih yang paling dekat. Beberapa kebutuhan bisa digabung.", "Choose what fits best. You can combine more than one need.") : step === 1 ? text(locale, "Semua boleh dilewati. Jawaban Anda membantu memperjelas arah awal.", "Every question is optional. Your answers help clarify the initial direction.") : text(locale, "Tinjau dan ubah ringkasan sebelum membukanya di WhatsApp atau email.", "Review and edit the brief before opening it in WhatsApp or email.")}</p>
    {error && <p role="alert" className="lr-form-error">{error}</p>}
    {step === 0 && <fieldset className="lr-need-options"><legend className="lr-visually-hidden">{title[0]}</legend>{(["website", "operations", "integration", "unsure"] as Need[]).map((need, i) => <label key={need} className={brief.needs.includes(need) ? "is-selected" : ""}><input type="checkbox" name={`${uid}-needs`} value={need} checked={brief.needs.includes(need)} onChange={() => { update("needs", toggleNeed(brief.needs, need)); setError(""); }} /><span className="lr-option-number">0{i + 1}</span><span>{needLabels[locale][need]}</span><span className="lr-checkbox-visual" aria-hidden="true">{brief.needs.includes(need) && <Check size={14} />}</span></label>)}</fieldset>}
    {step === 1 && <div className="lr-context-fields"><div className="lr-field"><label htmlFor={`${uid}-goal`}>{text(locale, "Hasil apa yang ingin dicapai?", "What would you like to achieve?")}</label><textarea id={`${uid}-goal`} maxLength={600} rows={3} value={brief.goal} onChange={e => update("goal", e.target.value)} placeholder={text(locale, "Misalnya: memudahkan pelanggan menemukan layanan kami.", "For example: help customers find the right service.")} /><span className="lr-field-note">{brief.goal.length}/600 · {text(locale, "Tanpa data sensitif atau rahasia.", "Please leave out sensitive or confidential information.")}</span></div><div className="lr-select-grid"><div className="lr-field"><label htmlFor={`${uid}-audience`}>{text(locale, "Siapa penggunanya?", "Who will use it?")}</label><select id={`${uid}-audience`} value={brief.audience} onChange={e => update("audience", e.target.value as Brief["audience"])}><option value="">{text(locale, "Belum dijelaskan", "Not specified")}</option><option value="internal">{text(locale, "Tim internal", "Internal team")}</option><option value="public">{text(locale, "Pelanggan atau publik", "Customers or public")}</option><option value="both">{text(locale, "Keduanya", "Both")}</option></select></div><div className="lr-field"><label htmlFor={`${uid}-place`}>{text(locale, "Di mana dipakai?", "Where will it be used?")}</label><select id={`${uid}-place`} value={brief.place} onChange={e => update("place", e.target.value as Brief["place"])}><option value="">{text(locale, "Belum dijelaskan", "Not specified")}</option><option value="office">{text(locale, "Kantor", "Office")}</option><option value="field">{text(locale, "Lapangan", "Field")}</option><option value="mixed">{text(locale, "Campuran", "Mixed")}</option></select></div><div className="lr-field"><label htmlFor={`${uid}-existing`}>{text(locale, "Sudah ada sistem?", "Any existing systems?")}</label><select id={`${uid}-existing`} value={brief.existing} onChange={e => update("existing", e.target.value as Brief["existing"])}><option value="">{text(locale, "Belum dijelaskan", "Not specified")}</option><option value="yes">{text(locale, "Ya", "Yes")}</option><option value="no">{text(locale, "Belum", "Not yet")}</option><option value="unknown">{text(locale, "Tidak tahu", "Not sure")}</option></select></div></div></div>}
    {step === 2 && <div className="lr-brief-summary"><div><h4>{text(locale, "Jawaban Anda", "Your answers")}</h4><p className="lr-preserve-lines">{sections.answers}</p></div><div><h4>{text(locale, "Dugaan awal kami", "Our initial direction")}</h4><p className="lr-preserve-lines">{sections.directions}</p></div><div><h4>{text(locale, "Belum diketahui", "Open questions")}</h4><p className="lr-preserve-lines">{sections.questions}</p></div><p className="lr-brief-disclaimer">{briefDisclaimer(locale)}</p><div className="lr-summary-actions"><button className="lr-button lr-button-secondary" type="button" onClick={copy}>{copyState === "copied" ? <CheckCheck size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}{copyState === "copied" ? text(locale, "Tersalin", "Copied") : text(locale, "Salin ringkasan", "Copy brief")}</button><a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="lr-button lr-button-primary" onClick={() => trackSiteEvent("composer_open_whatsapp", { target: "whatsapp" })}><MessageCircle size={17} aria-hidden="true" />{text(locale, "Buka draf WhatsApp", "Open WhatsApp draft")}</a><a href={links.email} className="lr-button lr-button-secondary" onClick={() => trackSiteEvent("composer_open_email", { target: "email" })}><Mail size={17} aria-hidden="true" />{text(locale, "Buka draf email", "Open email draft")}</a></div><p role="status" className="lr-copy-status">{copyState === "copied" ? text(locale, "Ringkasan berhasil disalin.", "The brief was copied.") : copyState === "failed" ? text(locale, "Salin teks yang dipilih di bawah secara manual.", "Copy the selected text below manually.") : ""}</p>{copyState === "failed" && <textarea ref={summaryRef} readOnly value={summary} rows={8} aria-label={text(locale, "Teks ringkasan untuk disalin", "Brief text to copy")} />}</div>}
    <div className="lr-composer-bottom"><p>{text(locale, "Diolah di browser. Tidak disimpan setelah halaman ditutup.", "Processed in your browser. Not saved after you close this page.")}</p><div>{step > 0 && <button type="button" className="lr-text-button" onClick={() => move(step - 1)}><ArrowLeft size={16} aria-hidden="true" />{step === 2 ? text(locale, "Ubah", "Edit") : text(locale, "Kembali", "Back")}</button>}{step < 2 && <button type="button" className="lr-button lr-button-primary" onClick={() => move(step + 1)}>{step === 1 ? text(locale, "Susun ringkasan", "Create brief") : text(locale, "Lanjutkan", "Continue")}<ArrowRight size={17} aria-hidden="true" /></button>}</div></div>
    <noscript><p>{text(locale, "Composer memerlukan JavaScript. Anda tetap dapat memakai kontak langsung dan templat di halaman ini.", "The composer needs JavaScript. Direct contact links and a brief template are still available on this page.")}</p></noscript>
  </section>;
}
