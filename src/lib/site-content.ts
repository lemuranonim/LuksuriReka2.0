export type Locale = "id" | "en";
export type Need = "website" | "operations" | "integration" | "unsure";
export type PageKey = "home" | "work" | "kroscekapps" | "scify-compfeed" | "solutions" | "website" | "operations" | "integration" | "products" | "sign" | "studio" | "contact" | "help" | "privacy";

export const SITE_URL = "https://www.luksurireka.com";
export const CONTACT = { email: "hello@luksurireka.com", phone: "+62 821 4370 6440", whatsapp: "6282143706440", product: "https://sign.luksurireka.com" };
export const text = (locale: Locale, id: string, en: string) => locale === "id" ? id : en;

export const routes: Record<PageKey, Record<Locale, string>> = {
  home: { id: "/", en: "/en" },
  work: { id: "/karya", en: "/en/work" },
  kroscekapps: { id: "/karya/kroscekapps", en: "/en/work/kroscekapps" },
  "scify-compfeed": { id: "/karya/scify-compfeed", en: "/en/work/scify-compfeed" },
  solutions: { id: "/solusi", en: "/en/solutions" },
  website: { id: "/solusi/website-pengalaman-digital", en: "/en/solutions/websites-digital-experience" },
  operations: { id: "/solusi/aplikasi-bisnis-operasional", en: "/en/solutions/business-operations-apps" },
  integration: { id: "/solusi/integrasi-otomasi", en: "/en/solutions/integration-automation" },
  products: { id: "/produk", en: "/en/products" },
  sign: { id: "/produk/luksuri-sign", en: "/en/product/luksuri-sign" },
  studio: { id: "/studio", en: "/en/studio" },
  contact: { id: "/kontak", en: "/en/contact" },
  help: { id: "/bantuan", en: "/en/help" },
  privacy: { id: "/privasi", en: "/en/privacy" },
};

export function resolveRoute(pathname: string): { page: PageKey; locale: Locale } | null {
  const normalized = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  for (const [page, localized] of Object.entries(routes)) {
    for (const locale of ["id", "en"] as const) {
      if (localized[locale] === normalized) return { page: page as PageKey, locale };
    }
  }
  return null;
}

export const labels = {
  id: { descriptor: "Studio Digital", work: "Karya", solutions: "Solusi", products: "Produk", studio: "Studio", contact: "Kontak", help: "Bantuan", discuss: "Diskusikan proyek", viewWork: "Lihat karya", learn: "Pelajari solusi", caseStudy: "Baca studi kasus", openProduct: "Buka Luksuri Sign", promise: "Dirancang dengan makna. Dibangun untuk bekerja.", skip: "Lewati ke konten", menu: "Buka navigasi", close: "Tutup", privacy: "Privasi & data", back: "Kembali", related: "Karya terkait", diagram: "SKEMA ALUR", included: "Yang kami kerjakan", questions: "Yang kami tanyakan di awal", outputs: "Bentuk keluaran", flexibility: "Ruang lingkup dan tahap pengerjaan disusun setelah kami memahami tujuan, pengguna, sistem yang sudah ada, serta prioritas Anda." },
  en: { descriptor: "Digital Studio", work: "Work", solutions: "Solutions", products: "Products", studio: "Studio", contact: "Contact", help: "Help", discuss: "Discuss your project", viewWork: "See our work", learn: "Explore the solution", caseStudy: "Read the case study", openProduct: "Open Luksuri Sign", promise: "Designed with purpose. Built to work.", skip: "Skip to content", menu: "Open navigation", close: "Close", privacy: "Privacy & data", back: "Back", related: "Related work", diagram: "WORKFLOW DIAGRAM", included: "What we work on", questions: "Where we start", outputs: "Possible deliverables", flexibility: "We shape the scope and stages around your goals, users, existing systems, and priorities." },
};

type Localized<T> = Record<Locale, T>;
export interface Solution {
  key: Exclude<Need, "unsure">;
  number: string;
  title: Localized<string>;
  short: Localized<string>;
  situation: Localized<string>;
  benefit: Localized<string>;
  scope: Localized<string[]>;
  questions: Localized<string[]>;
  outputs: Localized<string[]>;
  related: ("kroscekapps" | "scify-compfeed")[];
}

export const solutions: Solution[] = [
  {
    key: "website", number: "01", title: { id: "Website & Pengalaman Digital", en: "Websites & Digital Experience" },
    short: { id: "Informasi yang jelas. Pengalaman yang berkarakter.", en: "Clear information. A distinctive experience." },
    situation: { id: "Pengunjung sulit memahami layanan Anda dan tidak tahu langkah berikutnya?", en: "Do visitors struggle to understand what you offer or what to do next?" },
    benefit: { id: "Menyusun informasi dan jalur tindakan agar pengunjung memahami layanan, mengenali merek, dan menemukan langkah berikutnya.", en: "Shape information and clear paths to action so visitors understand your services, recognize your brand, and know where to go next." },
    scope: { id: ["Struktur informasi dan alur pengunjung", "Copy, desain antarmuka, dan identitas digital", "Pengembangan web responsif", "Pemeriksaan perangkat dan aksesibilitas"], en: ["Information architecture and visitor journeys", "Copy, interface design, and digital identity", "Responsive web development", "Device and accessibility checks"] },
    questions: { id: ["Siapa pengunjung utama Anda?", "Apa yang perlu mereka pahami atau lakukan?", "Siapa yang mengelola dan memperbarui isi?"], en: ["Who are your main visitors?", "What should they understand or do?", "Who will manage and update the content?"] },
    outputs: { id: ["Website perusahaan", "Portal layanan", "Halaman verifikasi", "Pengalaman interaktif"], en: ["Company websites", "Service portals", "Verification pages", "Interactive experiences"] },
    related: ["scify-compfeed"],
  },
  {
    key: "operations", number: "02", title: { id: "Aplikasi Bisnis & Operasional", en: "Business & Operations Apps" },
    short: { id: "Sistem yang mengikuti cara tim Anda bekerja.", en: "Systems shaped around the way your team works." },
    situation: { id: "Pencatatan dan pekerjaan tim tersebar di banyak tempat?", en: "Are your team’s records and work spread across too many places?" },
    benefit: { id: "Merancang pencatatan, status pekerjaan, dan laporan sesuai peran pengguna serta kondisi kerja di lapangan maupun kantor.", en: "Design records, work status, and reports around user roles and the realities of field and office work." },
    scope: { id: ["Pemetaan alur kerja dan peran pengguna", "Rancangan layar dan interaksi", "Pengembangan aplikasi dan pengelolaan data", "Pengujian, panduan, dan serah terima"], en: ["Workflow and user-role mapping", "Screen and interaction design", "Application development and data management", "Testing, guidance, and handover"] },
    questions: { id: ["Siapa yang mencatat dan siapa yang memeriksa?", "Laporan apa yang dibutuhkan?", "Bagaimana perangkat dan koneksi digunakan?"], en: ["Who records information, and who reviews it?", "Which reports are needed?", "What devices and connectivity do people use?"] },
    outputs: { id: ["Aplikasi lapangan", "Dashboard", "Pengelolaan pekerjaan", "Alur persetujuan"], en: ["Field applications", "Dashboards", "Work management", "Approval workflows"] }, related: ["kroscekapps"],
  },
  {
    key: "integration", number: "03", title: { id: "Integrasi & Otomasi", en: "Integration & Automation" },
    short: { id: "Hubungkan sistem. Rapikan alur kerja.", en: "Connect systems. Bring clarity to workflows." },
    situation: { id: "Tim masih menyalin data dari satu sistem ke sistem lain?", en: "Is your team still copying data from one system to another?" },
    benefit: { id: "Menilai dan menghubungkan sistem yang sudah ada agar pertukaran data, notifikasi, dan tindak lanjut memiliki alur yang jelas.", en: "Assess and connect existing systems so data exchange, notifications, and follow-up have a clear flow." },
    scope: { id: ["Penilaian sistem, akses, dan batas teknis", "Rancangan pertukaran data", "Konektor dan notifikasi sesuai kebutuhan", "Penerapan dan pemeriksaan bertahap"], en: ["Assessment of systems, access, and constraints", "Data exchange design", "Connectors and notifications where appropriate", "Staged implementation and verification"] },
    questions: { id: ["Sistem apa yang sudah dipakai?", "Data dan pekerjaan apa yang perlu terhubung?", "Akses dan batas teknis apa yang tersedia?"], en: ["Which systems are already in use?", "Which data and tasks need to connect?", "What access and technical constraints exist?"] },
    outputs: { id: ["Konektor", "Sinkronisasi", "Notifikasi", "Alur tindak lanjut"], en: ["Connectors", "Synchronization", "Notifications", "Follow-up workflows"] }, related: ["scify-compfeed", "kroscekapps"],
  },
];

export interface CaseStudy {
  key: "kroscekapps" | "scify-compfeed";
  name: string;
  category: Localized<string>;
  title: Localized<string>;
  summary: Localized<string>;
  context: Localized<string>;
  role: Localized<string>;
  steps: Localized<string[]>;
  decisions: Localized<{ title: string; body: string }[]>;
  outcome: Localized<string>;
  stack: string[];
}

export const cases: CaseStudy[] = [
  {
    key: "kroscekapps", name: "KrosCekApps", category: { id: "APLIKASI LAPANGAN", en: "FIELD APPLICATION" },
    title: { id: "Pencatatan lapangan saat koneksi terbatas.", en: "Field records when connectivity is limited." },
    summary: { id: "Pencatatan inspeksi pertanian dengan penyimpanan lokal dan sinkronisasi ketika perangkat kembali terhubung.", en: "Agricultural inspection records with local storage and synchronization when a connection becomes available." },
    context: { id: "Pekerjaan inspeksi berlangsung di area pertanian dengan kondisi jaringan yang dapat berubah. Aplikasi perlu mengikuti proses pengamatan dan pencatatan di lapangan.", en: "Inspections take place in agricultural areas where connectivity can vary. The application needs to support observation and record-keeping in the field." },
    role: { id: "Pengembangan aplikasi lintas platform, penyimpanan lokal, sinkronisasi data, dan pencatatan lokasi.", en: "Cross-platform application development, local storage, data synchronization, and location recording." },
    steps: { id: ["Catat di lapangan", "Simpan saat offline", "Sinkronkan saat terhubung"], en: ["Record in the field", "Store while offline", "Sync when connected"] },
    decisions: {
      id: [{ title: "Mulai dari kondisi pengguna", body: "Penyimpanan lokal mendukung pencatatan ketika koneksi belum tersedia." }, { title: "Hubungkan data saat memungkinkan", body: "Sinkronisasi menghubungkan catatan lokal dengan layanan data ketika perangkat kembali terhubung." }, { title: "Pertahankan konteks lapangan", body: "Pencatatan lokasi memberi konteks pada aktivitas inspeksi." }],
      en: [{ title: "Start with working conditions", body: "Local storage supports record-keeping when a connection is unavailable." }, { title: "Connect data when possible", body: "Synchronization connects local records to data services when the device comes back online." }, { title: "Keep the field context", body: "Location recording gives inspection activity additional context." }],
    },
    outcome: { id: "Alur yang ditampilkan menghubungkan pencatatan lokal, sinkronisasi, dan konteks lokasi dalam satu aplikasi lapangan.", en: "The workflow brings local records, synchronization, and location context together in one field application." },
    stack: ["Flutter", "Dart", "Hive", "Firebase", "Supabase"],
  },
  {
    key: "scify-compfeed", name: "Scify CompFeed", category: { id: "APLIKASI WEB & INTEGRASI", en: "WEB APPLICATION & INTEGRATION" },
    title: { id: "Verifikasi produk dan tindak lanjut dalam satu alur.", en: "Product verification and follow-up in one workflow." },
    summary: { id: "Pengalaman web untuk verifikasi melalui QR, pengajuan keluhan, dan notifikasi pada tahapan tindak lanjut.", en: "A web experience for QR verification, complaint submission, and notifications through the follow-up stages." },
    context: { id: "Verifikasi produk dan pengajuan keluhan membutuhkan jalur yang dapat dipahami pengguna serta tahapan yang dapat diikuti tim penanganan.", en: "Product verification and complaint submission need a clear journey for users and a sequence that the handling team can follow." },
    role: { id: "Pengembangan aplikasi web, alur verifikasi dan keluhan, pengelolaan data, serta integrasi notifikasi.", en: "Web application development, verification and complaint workflows, data management, and notification integration." },
    steps: { id: ["Verifikasi produk", "Ajukan keluhan", "Tindak lanjuti kasus"], en: ["Verify the product", "Submit a complaint", "Follow up the case"] },
    decisions: {
      id: [{ title: "Awali dari akses yang jelas", body: "QR pada kemasan menjadi salah satu pintu masuk ke proses verifikasi dan pengajuan keluhan." }, { title: "Susun tahap penanganan", body: "Alur menghubungkan investigasi, pengujian laboratorium, dan penyelesaian kasus." }, { title: "Hubungkan pihak yang terlibat", body: "Integrasi WhatsApp dan email mendukung pemberitahuan pada tahapan penanganan." }],
      en: [{ title: "Create a clear entry point", body: "Packaging QR codes provide an entry point for verification and complaint submission." }, { title: "Structure the follow-up", body: "The workflow connects investigation, laboratory testing, and case resolution." }, { title: "Connect the people involved", body: "WhatsApp and email integration support notifications during the handling process." }],
    },
    outcome: { id: "Verifikasi, pengajuan keluhan, dan tindak lanjut disusun sebagai bagian dari satu pengalaman web yang terhubung.", en: "Verification, complaint submission, and follow-up are structured as parts of one connected web experience." },
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "WhatsApp API"],
  },
];

export const processSteps = {
  id: [
    { title: "Pahami", body: "Memetakan tujuan, pengguna, dan kondisi kerja.", output: "Ringkasan kebutuhan dan batas lingkup." },
    { title: "Rancang", body: "Menyusun struktur, tampilan, dan alur yang bisa ditinjau.", output: "Rancangan untuk dibahas bersama." },
    { title: "Bangun", body: "Mengembangkan dan menghubungkan bagian yang diperlukan.", output: "Versi yang dapat dicoba bertahap." },
    { title: "Uji & jalankan", body: "Memeriksa bersama pengguna dan menyiapkan serah terima.", output: "Sistem, panduan, dan jalur bantuan." },
  ],
  en: [
    { title: "Understand", body: "Map goals, users, and working conditions.", output: "A needs summary and defined scope." },
    { title: "Design", body: "Shape structures, screens, and flows that can be reviewed.", output: "A design to discuss together." },
    { title: "Build", body: "Develop and connect the parts the project needs.", output: "A version to try in stages." },
    { title: "Test & run", body: "Review with users and prepare the handover.", output: "The system, guidance, and a support path." },
  ],
};

export function pageMeta(page: PageKey, locale: Locale) {
  const solution = solutions.find(s => s.key === page);
  const study = cases.find(c => c.key === page);
  if (solution) return { title: solution.title[locale], description: solution.benefit[locale] };
  if (study) return { title: `${study.name} — ${text(locale, "Studi Kasus", "Case Study")}`, description: study.summary[locale] };
  const title: Record<string, string> = { home: `Luksuri Reka — ${labels[locale].descriptor}`, work: labels[locale].work, solutions: labels[locale].solutions, products: labels[locale].products, sign: "Luksuri Sign", studio: labels[locale].studio, contact: labels[locale].contact, help: labels[locale].help, privacy: labels[locale].privacy };
  const descriptions: Record<Locale, Partial<Record<PageKey, string>>> = {
    id: {
      home: "Luksuri Reka menyatukan desain, pengembangan aplikasi, dan otomasi. Jelajahi solusi, karya, dan produk dari studio digital kami.",
      work: "Jelajahi karya Luksuri Reka: konteks pengguna, peran studio, dan keputusan di balik aplikasi lapangan serta sistem web yang terhubung.",
      solutions: "Temukan bantuan untuk website, aplikasi operasional, dan integrasi. Lingkup solusi Luksuri Reka mengikuti tujuan dan kondisi bisnis Anda.",
      products: "Kenali produk dari studio Luksuri Reka, mulai dari Luksuri Sign untuk tanda tangan dan verifikasi dokumen, beserta akses dan bantuannya.",
      sign: "Pelajari fungsi Luksuri Sign, buka produk tanda tangan dan verifikasi dokumen, atau temukan jalur bantuan dari tim Luksuri Reka.",
      studio: "Kenali Luksuri Reka, studio digital di Tulungagung yang menyatukan desain, pengembangan aplikasi, dan otomasi melalui proses yang jelas.",
      contact: "Ceritakan kebutuhan proyek Anda kepada Luksuri Reka melalui WhatsApp, email, atau ringkasan kebutuhan dengan Project Composer.",
      help: "Temukan akses Luksuri Sign, panduan awal pemeriksaan dokumen, dan kanal bantuan produk maupun proyek dari tim Luksuri Reka.",
      privacy: "Pelajari bagaimana halaman studio Luksuri Reka mengolah ringkasan Composer, membuka draf kontak, dan menjelaskan penggunaan informasi.",
    },
    en: {
      home: "Luksuri Reka brings design, application development, and automation together. Explore solutions, work, and products from our digital studio.",
      work: "Explore Luksuri Reka projects through their user context, our role, and the decisions behind field applications and connected web systems.",
      solutions: "Find support for websites, operations applications, and integration. Luksuri Reka shapes each scope around your business goals and conditions.",
      products: "Explore products from Luksuri Reka, including Luksuri Sign for document signing and verification, with access and support information.",
      sign: "Learn about Luksuri Sign, open the document signing and verification product, or find support from the Luksuri Reka team.",
      studio: "Meet Luksuri Reka, a digital studio in Tulungagung bringing design, application development, and automation together through a clear process.",
      contact: "Discuss your project with Luksuri Reka through WhatsApp, email, or a short project brief created with our optional Project Composer.",
      help: "Find Luksuri Sign access, initial guidance for checking documents, and product or project support channels from Luksuri Reka.",
      privacy: "Learn how Luksuri Reka studio pages process Composer briefs, open contact drafts, and explain the use of information.",
    },
  };
  return { title: title[page], description: descriptions[locale][page] ?? labels[locale].promise };
}
