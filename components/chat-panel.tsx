"use client";

import { type FormEvent, useEffect, useState, useTransition } from "react";

import { fetchMessages, sendMessage } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatRideTimestamp } from "@/lib/format";

type ChatMessage = {
  id: string;
  text: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
  };
};

type ChatPanelProps = {
  rideId: string;
  initialMessages: ChatMessage[];
  currentUserId: string;
};

export function ChatPanel({ rideId, initialMessages, currentUserId }: ChatPanelProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const interval = window.setInterval(async () => {
      try {
        const result = await fetchMessages(rideId);
        setMessages(result.messages);
      } catch {
        // Polling failures should not interrupt the active chat UI.
      }
    }, 4000);

    return () => window.clearInterval(interval);
  }, [rideId]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        await sendMessage(rideId, text);
        setText("");
        const result = await fetchMessages(rideId);
        setMessages(result.messages);
      } catch (messageError) {
        setError(messageError instanceof Error ? messageError.message : "Unable to send message.");
      }
    });
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>Ride chat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-[380px] space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
          {messages.length === 0 ? (
            <p className="text-sm text-slate-500">No messages yet. Start the coordination here.</p>
          ) : (
            messages.map((message) => {
              const isCurrentUser = message.sender.id === currentUserId;
              const createdAtDate = new Date(message.createdAt);

              return (
                <div
                  key={message.id}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    isCurrentUser ? "ml-auto bg-slate-900 text-white" : "bg-white text-slate-800"
                  }`}
                >
                  <p className={`mb-1 text-xs font-semibold ${isCurrentUser ? "text-slate-200" : "text-slate-500"}`}>
                    {message.sender.name}
                  </p>
                  <p>{message.text}</p>
                  <p className={`mt-2 text-[11px] ${isCurrentUser ? "text-slate-300" : "text-slate-400"}`}>
                    {formatRideTimestamp(createdAtDate)}
                  </p>
                </div>
              );
            })
          )}
        </div>

        <form className="flex gap-3" onSubmit={handleSubmit}>
          <Input placeholder="Message the group..." value={text} onChange={(event) => setText(event.target.value)} />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Sending..." : "Send"}
          </Button>
        </form>
        {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
