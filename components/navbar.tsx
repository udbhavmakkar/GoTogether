import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";

export async function Navbar() {
  const currentUser = await getCurrentUser();

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
          GoTogether
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="transition hover:text-slate-900">
            Home
          </Link>
          <Link href="/create" className="transition hover:text-slate-900">
            Create Ride
          </Link>
          <Link href="/my-rides" className="transition hover:text-slate-900">
            My Rides
          </Link>
          {currentUser ? (
            <Link href="/profile" className="transition hover:text-slate-900">
              My Profile
            </Link>
          ) : (
            <>
              <Link href="/login" className="transition hover:text-slate-900">
                Login
              </Link>
              <Link href="/register" className="transition hover:text-slate-900">
                Register
              </Link>
            </>
          )}
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {currentUser ? `Active: ${currentUser.name}` : "Not logged in"}
          </span>
        </nav>
      </div>
    </header>
  );
}
