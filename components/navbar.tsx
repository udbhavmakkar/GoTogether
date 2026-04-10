import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";

export async function Navbar() {
  const currentUser = await getCurrentUser();

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
            GoTogether
          </Link>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 sm:px-3 sm:text-xs">
            {currentUser ? (
              <>
                <span className="sm:hidden">Signed in</span>
                <span className="hidden sm:inline">{`Active: ${currentUser.name}`}</span>
              </>
            ) : (
              "Not logged in"
            )}
          </span>
        </div>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-600 sm:text-sm">
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
        </nav>
      </div>
    </header>
  );
}
