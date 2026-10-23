import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Menu, Plus } from "lucide-react";
import { CONTACT, labels, routes, text, type Locale, type PageKey } from "@/lib/site-content";
import { contactLinks } from "@/lib/composer";
import SiteEvents from "./SiteEvents";

export function Action({ href, children, secondary = false, external = false, className = "" }: { href: string; children: React.ReactNode; secondary?: boolean; external?: boolean; className?: string }) {
  const style = `lr-button ${secondary ? "lr-button-secondary" : "lr-button-primary"} ${className}`;
  return external ? <a className={style} href={href} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={17} aria-hidden="true" /></a> : <Link className={style} href={href}>{children}<ArrowUpRight size={17} aria-hidden="true" /></Link>;
}

export function Brand({ locale }: { locale: Locale }) {
  return <Link href={routes.home[locale]} className="lr-brand-lockup" aria-label={`Luksuri Reka — ${labels[locale].descriptor}`}><Image src="/logo.png" width={42} height={42} alt="" className="lr-brand-logo" priority /><span><strong>LUKSURI<span>REKA</span></strong><small>{labels[locale].descriptor}</small></span></Link>;
}

export function SiteShell({ locale, page, children }: { locale: Locale; page: PageKey; children: React.ReactNode }) {
  const l = labels[locale];
  const nav: [PageKey, string][] = [["work", l.work], ["solutions", l.solutions], ["products", l.products], ["studio", l.studio], ["contact", l.contact]];
  const alternate = locale === "id" ? "en" : "id";
  return <div className="lr-foundation">
    <SiteEvents locale={locale} />
    <a href="#main" className="lr-skip-link">{l.skip}</a>
    <header className="lr-header"><div className="lr-container lr-header-inner">
      <Brand locale={locale} />
      <nav className="lr-desktop-nav" aria-label={text(locale, "Navigasi utama", "Main navigation")}>{nav.map(([key, title]) => <Link key={key} href={routes[key][locale]} aria-current={page === key || (key === "work" && ["kroscekapps", "scify-compfeed"].includes(page)) || (key === "solutions" && ["website", "operations", "integration"].includes(page)) || (key === "products" && page === "sign") ? "page" : undefined}>{title}</Link>)}</nav>
      <div className="lr-header-actions"><Link className="lr-locale" href={routes[page][alternate]} hrefLang={alternate} lang={alternate} aria-label={alternate === "en" ? "Read this page in English" : "Baca halaman ini dalam Bahasa Indonesia"}>{locale.toUpperCase()}<span aria-hidden="true">/</span><span>{alternate.toUpperCase()}</span></Link><Link className="lr-header-contact" href={routes.contact[locale]}>{l.discuss}<ArrowUpRight size={15} aria-hidden="true" /></Link></div>
      <details className="lr-mobile-menu"><summary aria-label={l.menu}><Menu size={23} aria-hidden="true" /></summary><nav aria-label={text(locale, "Navigasi seluler", "Mobile navigation")}>{nav.map(([key, title]) => <Link key={key} href={routes[key][locale]}>{title}<ArrowUpRight size={18} aria-hidden="true" /></Link>)}<Link href={routes.help[locale]}>{l.help}<Plus size={18} aria-hidden="true" /></Link></nav></details>
    </div></header>
    <main id="main">{children}</main>
    <footer className="lr-footer"><div className="lr-container"><div className="lr-footer-top"><div><p className="lr-eyebrow">{text(locale, "LANGKAH BERIKUTNYA", "THE NEXT STEP")}</p><h2>{text(locale, "Ide Anda berikutnya", "Your next idea")}<br /><span>{text(locale, "dimulai di sini.", "starts here.")}</span></h2><Action href={routes.contact[locale]}>{text(locale, "Ceritakan kebutuhan Anda", "Tell us what you need")}</Action></div><div className="lr-footer-contact"><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}<ArrowUpRight size={18} aria-hidden="true" /></a><a href={contactLinks("", locale).whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp<ArrowUpRight size={18} aria-hidden="true" /></a><p>Tulungagung, Indonesia<br /><span>{l.promise}</span></p></div></div><div className="lr-footer-bottom"><Brand locale={locale} /><p>© {new Date().getFullYear()} Luksuri Reka</p><div><Link href={routes.help[locale]}>{l.help}</Link><Link href={routes.privacy[locale]}>{l.privacy}</Link><Link href={routes[page][alternate]} hrefLang={alternate}>{alternate === "en" ? "English" : "Bahasa Indonesia"}</Link></div></div></div></footer>
  </div>;
}

export function Chapter({ number, children }: { number: string; children: React.ReactNode }) {
  return <p className="lr-eyebrow lr-chapter"><span>{number}</span><span className="lr-chapter-line" />{children}</p>;
}

export function PageIntro({ locale, eyebrow, title, description, children }: { locale: Locale; eyebrow: string; title: string; description: string; children?: React.ReactNode }) {
  return <section className="lr-page-intro lr-container"><Link className="lr-back" href={routes.home[locale]}><ArrowDown size={14} aria-hidden="true" />{text(locale, "Beranda", "Home")}</Link><p className="lr-eyebrow">{eyebrow}</p><h1>{title}</h1><div className="lr-intro-bottom"><p className="lr-lead">{description}</p>{children}</div></section>;
}
