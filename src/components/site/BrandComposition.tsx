import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { type Locale, routes, text } from "@/lib/site-content";

export function BrandComposition({ locale }: { locale: Locale }) {
  return <div className="lr-brand-composition" role="img" aria-label={text(locale, "Komposisi statis dari geometri logo Luksuri Reka, bidang, dan sambungan.", "A static composition of the Luksuri Reka logo, planes, and connections.")}>
    <div className="lr-composition-grid" aria-hidden="true" />
    <div className="lr-composition-coordinates" aria-hidden="true"><span>LR / 01</span><span>IDEA → FORM</span></div>
    <div className="lr-composition-frame" aria-hidden="true"><div className="lr-logo-depth lr-depth-back" /><div className="lr-logo-depth lr-depth-mid" /><div className="lr-logo-depth lr-depth-front" /></div>
    <div className="lr-composition-axis" aria-hidden="true"><span /><span /></div>
    <div className="lr-composition-note"><span className="lr-status-dot" />{text(locale, "DESAIN BERTEMU REKAYASA", "DESIGN MEETS ENGINEERING")}</div>
    <p className="lr-composition-footer">{text(locale, "Dari bentuk, menuju fungsi.", "From form, to function.")}</p>
  </div>;
}

export function ProductComposition({ locale }: { locale: Locale }) {
  return <div className="lr-product-composition"><div className="lr-product-sheet"><div className="lr-product-sheet-header"><span className="lr-small-mark" /><span>LUKSURI SIGN</span></div><p>{text(locale, "Satu dokumen.", "One document.")}<br />{text(locale, "Jejak yang terhubung.", "A connected trail.")}</p><div className="lr-document-lines" aria-hidden="true"><span /><span /><span /></div><div className="lr-document-signature" aria-hidden="true">Luksuri</div><div className="lr-product-sheet-bottom"><span>{text(locale, "TANDA TANGAN", "SIGNATURE")}</span><span>↗</span><span>{text(locale, "VERIFIKASI", "VERIFICATION")}</span></div></div><p className="lr-product-figure-label">{text(locale, "ILUSTRASI KONSEP · BUKAN TAMPILAN PRODUK", "CONCEPT ILLUSTRATION · NOT A PRODUCT SCREEN")}</p></div>;
}

export function SolutionLink({ locale, page, number, name, description }: { locale: Locale; page: "website" | "operations" | "integration"; number: string; name: string; description: string }) {
  return <Link href={routes[page][locale]} className="lr-solution-link"><span className="lr-solution-number">{number}</span><div><h3>{name}</h3><p>{description}</p></div><ArrowUpRight size={26} strokeWidth={1.3} aria-hidden="true" /></Link>;
}
