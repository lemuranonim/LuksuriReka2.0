import { RouteEntry, type RouteProps } from "@/components/site/RouteEntry";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata = siteMetadata("home", "en");

export default function Page(props: RouteProps) {
  return <RouteEntry {...props} page="home" locale="en" />;
}
