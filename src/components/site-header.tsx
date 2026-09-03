import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          PMS
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="rounded-md px-2 py-1 text-zinc-700 hover:bg-zinc-100"
            >
              Dashboard
            </Link>
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-md px-3 py-1.5 text-zinc-700 hover:bg-zinc-100"
              >
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-700"
              >
                Sign up
              </button>
            </SignUpButton>
          </Show>
        </nav>
      </div>
    </header>
  );
}
