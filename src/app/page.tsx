import { redirect } from "next/navigation";
import { SitePage } from "@/components/site/SitePages";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata = siteMetadata("home", "id");

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const oldSections: Record<string, string> = { portfolio: "/studio", casestudy: "/karya", services: "/solusi", about: "/studio" };
  if (query.action === "contact") redirect("/kontak");
  if (typeof query.section === "string" && oldSections[query.section]) redirect(oldSections[query.section]);
  return <SitePage locale="id" page="home" />;
}