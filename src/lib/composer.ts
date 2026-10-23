import { CONTACT, type Locale, type Need, solutions, text } from "./site-content";

export interface Brief {
  needs: Need[];
  goal: string;
  audience: "" | "internal" | "public" | "both";
  place: "" | "office" | "field" | "mixed";
  existing: "" | "yes" | "no" | "unknown";
}
export const emptyBrief: Brief = { needs: [], goal: "", audience: "", place: "", existing: "" };
export const needLabels = {
  id: { website: "Website atau pengalaman digital", operations: "Aplikasi untuk operasional", integration: "Menghubungkan sistem yang ada", unsure: "Belum yakin, bantu saya menentukan" },
  en: { website: "A website or digital experience", operations: "An operations application", integration: "Connect existing systems", unsure: "I am not sure yet — help me explore" },
};

export function toggleNeed(current: Need[], next: Need): Need[] {
  if (next === "unsure") return current.includes(next) ? [] : [next];
  const filtered = current.filter(n => n !== "unsure");
  return filtered.includes(next) ? filtered.filter(n => n !== next) : [...filtered, next];
}

export function briefRecommendations(brief: Brief, locale: Locale) {
  const items: { title: string; reason: string; question: string }[] = [];
  for (const need of brief.needs) {
    const solution = solutions.find(s => s.key === need);
    if (solution) items.push({ title: solution.title[locale], reason: solution.benefit[locale], question: solution.questions[locale][0] });
    else if (need === "unsure") items.push({ title: text(locale, "Pemetaan kebutuhan", "Map the needs first"), reason: text(locale, "Mulai dari tujuan dan bagian pekerjaan yang ingin diperbaiki.", "Start with your goals and the work you would like to improve."), question: text(locale, "Apa hambatan yang paling penting saat ini?", "What is the most important obstacle right now?") });
  }
  if (brief.place === "field" || brief.place === "mixed") items.push({ title: text(locale, "Kondisi koneksi", "Connectivity conditions"), reason: text(locale, "Penggunaan di lapangan menjadi alasan untuk memeriksa kebutuhan koneksi terbatas.", "Field use is a reason to examine limited-connectivity needs."), question: text(locale, "Seberapa sering sinyal hilang, dan berapa lama pekerjaan boleh menunggu?", "How often is connectivity lost, and how long can work wait?") });
  if (brief.existing === "yes") items.push({ title: text(locale, "Sistem yang sudah ada", "Existing systems"), reason: text(locale, "Sistem yang digunakan perlu dipahami sebelum menentukan integrasi.", "Existing systems need to be understood before choosing integrations."), question: text(locale, "Sistem, data, dan akses apa yang tersedia?", "Which systems, data, and access are available?") });
  return items;
}

export function briefSections(brief: Brief, locale: Locale) {
  const unknown = text(locale, "Belum dijelaskan", "Not specified");
  const audiences = { internal: text(locale, "Tim internal", "Internal team"), public: text(locale, "Pelanggan atau publik", "Customers or public"), both: text(locale, "Keduanya", "Both") };
  const places = { office: text(locale, "Kantor", "Office"), field: text(locale, "Lapangan", "Field"), mixed: text(locale, "Campuran", "Mixed") };
  const existing = { yes: text(locale, "Sudah ada", "Yes"), no: text(locale, "Belum ada", "No"), unknown: text(locale, "Belum diketahui", "Unknown") };
  const recommendations = briefRecommendations(brief, locale);
  return {
    answers: [
      `${text(locale, "Kebutuhan", "Needs")}: ${brief.needs.map(n => needLabels[locale][n]).join(", ") || unknown}`,
      `${text(locale, "Hasil yang dicari", "Desired outcome")}: ${brief.goal.trim() || unknown}`,
      `${text(locale, "Pengguna", "Users")}: ${brief.audience ? audiences[brief.audience] : unknown}`,
      `${text(locale, "Lokasi penggunaan", "Working environment")}: ${brief.place ? places[brief.place] : unknown}`,
      `${text(locale, "Sistem saat ini", "Existing systems")}: ${brief.existing ? existing[brief.existing] : unknown}`,
    ].join("\n"),
    directions: recommendations.map(r => `${r.title}: ${r.reason}`).join("\n\n"),
    questions: recommendations.map(r => `• ${r.question}`).join("\n"),
  };
}

export const briefDisclaimer = (locale: Locale) => text(locale, "Ringkasan ini disusun dari jawaban Anda sebagai bahan diskusi. Ini bukan penawaran, arsitektur, atau komitmen fitur.", "This summary is based on your answers and is a starting point for discussion. It is not a quote, architecture, or feature commitment.");

export function buildBrief(brief: Brief, locale: Locale) {
  const sections = briefSections(brief, locale);
  return [text(locale, "Halo Luksuri Reka, saya ingin berdiskusi tentang proyek.", "Hello Luksuri Reka, I would like to discuss a project."), text(locale, "JAWABAN ANDA", "YOUR ANSWERS"), sections.answers, text(locale, "ARAH AWAL UNTUK DISKUSI", "INITIAL DIRECTION FOR DISCUSSION"), sections.directions, text(locale, "BELUM DIKETAHUI", "OPEN QUESTIONS"), sections.questions, briefDisclaimer(locale)].join("\n\n");
}

export function contactLinks(body = "", locale: Locale = "id") {
  const message = body || text(locale, "Halo Luksuri Reka, saya ingin berdiskusi tentang proyek.", "Hello Luksuri Reka, I would like to discuss a project.");
  return { whatsapp: `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`, email: `mailto:${CONTACT.email}?subject=${encodeURIComponent(text(locale, "Diskusi proyek — Luksuri Reka", "Project discussion — Luksuri Reka"))}&body=${encodeURIComponent(message)}` };
}
