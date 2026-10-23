import { RouteEntry, type RouteProps } from "@/components/site/RouteEntry";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata = siteMetadata("studio", "id");

export default function Page(props: RouteProps) {
  return <RouteEntry {...props} page="studio" locale="id" />;
}
