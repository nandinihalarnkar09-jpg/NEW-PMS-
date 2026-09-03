import "server-only";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import type { Employee } from "@/types/database";

export async function getClerkUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

export async function getCurrentEmployee(): Promise<Employee | null> {
  const userId = await getClerkUserId();
  if (!userId || !isSupabaseConfigured()) return null;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as Employee | null;
}

export async function requireSignedInUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return userId;
}
