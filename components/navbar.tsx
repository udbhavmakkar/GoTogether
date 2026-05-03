import Image from "next/image";
import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";
import { NotificationBell } from "@/components/notification-bell";

export async function Navbar() {
  const currentUser = await getCurrentUser();

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-2 text-slate-900">
            <Image
              src="/gotogether-logo.png"
              alt="GoTogether logo"
              width={1024}
              height={558}
              className="h-8 w-auto shrink-0 object-contain sm:h-10"
              priority
            />
            <span className="truncate text-base font-bold tracking-tight sm:text-lg">GoTogether</span>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            {currentUser ? <NotificationBell /> : null}
            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 sm:px-3 sm:text-xs">
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
          <Link href="/feedback" className="transition hover:text-slate-900">
            Feedback
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
