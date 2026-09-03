import { auth } from "@clerk/nextjs/server";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  await auth.protect();
  return children;
}
