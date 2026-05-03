"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { fetchNotifications, markAllNotificationsRead } from "@/api/client";
import { Button } from "@/components/ui/button";
import { formatRideTimestamp } from "@/lib/format";

type NotificationItem = {
  id: string;
  type: "RIDE_JOINED" | "CHAT_MESSAGE";
  title: string;
  body: string;
  rideId: string | null;
  isRead: boolean;
  createdAt: string;
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toastQueue, setToastQueue] = useState<NotificationItem[]>([]);
  const hasLoadedRef = useRef(false);
  const seenIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;

    async function loadNotifications() {
      try {
        const data = await fetchNotifications();

        if (!mounted) {
          return;
        }

        const nextIds = new Set(data.notifications.map((notification) => notification.id));

        if (hasLoadedRef.current) {
          const newUnreadNotifications = data.notifications.filter(
            (notification) => !notification.isRead && !seenIdsRef.current.has(notification.id),
          );

          if (newUnreadNotifications.length > 0) {
            setToastQueue((current) => [...newUnreadNotifications, ...current].slice(0, 4));
          }
        } else {
          hasLoadedRef.current = true;
        }

        seenIdsRef.current = nextIds;
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch {
        // Silent polling failure; keep current UI state.
      }
    }

    void loadNotifications();
    const interval = window.setInterval(loadNotifications, 5000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (toastQueue.length === 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToastQueue((current) => current.slice(0, -1));
    }, 4500);

    return () => window.clearTimeout(timeout);
  }, [toastQueue]);

  const hasNotifications = notifications.length > 0;
  const visibleNotifications = useMemo(() => notifications.slice(0, 8), [notifications]);

  async function handleToggle() {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen && unreadCount > 0) {
      setUnreadCount(0);
      setNotifications((current) => current.map((notification) => ({ ...notification, isRead: true })));
      try {
        await markAllNotificationsRead();
      } catch {
        // Keep the optimistic read state; next poll will recover if needed.
      }
    }
  }

  return (
    <>
      <div className="relative">
        <Button type="button" variant="outline" size="sm" className="relative h-9 px-3" onClick={handleToggle}>
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
          {unreadCount > 0 ? (
            <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </Button>

        {open ? (
          <div className="absolute right-0 z-30 mt-2 w-[min(92vw,24rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                <p className="text-xs text-slate-500">Join and chat updates appear here.</p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>

            {!hasNotifications ? (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                No notifications yet.
              </p>
            ) : (
              <div className="space-y-2">
                {visibleNotifications.map((notification) => {
                  const content = (
                    <div
                      className={`rounded-xl border px-3 py-3 text-left ${
                        notification.isRead ? "border-slate-200 bg-white" : "border-sky-200 bg-sky-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                          <p className="mt-1 text-sm text-slate-600">{notification.body}</p>
                        </div>
                        {!notification.isRead ? <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-sky-500" /> : null}
                      </div>
                      <p className="mt-2 text-[11px] text-slate-400">{formatRideTimestamp(new Date(notification.createdAt))}</p>
                    </div>
                  );

                  return notification.rideId ? (
                    <Link key={notification.id} href={`/ride/${notification.rideId}`} onClick={() => setOpen(false)}>
                      {content}
                    </Link>
                  ) : (
                    <div key={notification.id}>{content}</div>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}
      </div>

      <div className="pointer-events-none fixed bottom-4 right-4 z-40 flex w-[min(92vw,22rem)] flex-col gap-3">
        {toastQueue.map((notification) => (
          <div key={notification.id} className="pointer-events-auto rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
            <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
            <p className="mt-1 text-sm text-slate-600">{notification.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}
