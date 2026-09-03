import { auth } from "@clerk/nextjs/server";

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  await auth.protect();
  return children;
}
