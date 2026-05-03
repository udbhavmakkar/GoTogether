"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const SUPPORT_EMAIL = "gotogether.support@gmail.com";

type FeedbackFormProps = {
  defaultName?: string;
  defaultEmail?: string;
};

export function FeedbackForm({ defaultName = "", defaultEmail = "" }: FeedbackFormProps) {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedSubject = subject.trim() || "Feedback for GoTogether";
    const trimmedMessage = message.trim();

    const body = [
      `Name: ${name.trim() || "Not provided"}`,
      `Email: ${email.trim() || "Not provided"}`,
      "",
      trimmedMessage || "No message provided.",
    ].join("\n");

    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(trimmedSubject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="feedback-name" className="text-sm font-medium text-slate-700">
            Name
          </label>
          <Input id="feedback-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
        </div>
        <div className="space-y-2">
          <label htmlFor="feedback-email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <Input
            id="feedback-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="feedback-subject" className="text-sm font-medium text-slate-700">
          Subject
        </label>
        <Input
          id="feedback-subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="What is this about?"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="feedback-message" className="text-sm font-medium text-slate-700">
          Message
        </label>
        <Textarea
          id="feedback-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Share your question, issue, or feedback here."
          className="min-h-[160px]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit">Send Feedback</Button>
        <p className="text-sm text-slate-500">This opens your mail app and sends the message to {SUPPORT_EMAIL}.</p>
      </div>
    </form>
  );
}
