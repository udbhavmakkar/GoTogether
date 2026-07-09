import nodemailer from "nodemailer";

import { formatRideDate } from "@/lib/format";

const SUPPORT_EMAIL = "gotogether.support@gmail.com";

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || "";
}

function getSmtpConfig() {
  const user = process.env.SMTP_GMAIL_USER;
  const pass = process.env.SMTP_GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("EMAIL_NOT_CONFIGURED");
  }

  return {
    user,
    pass,
  };
}

async function sendEmail(input: {
  to: string;
  bcc?: string[];
  subject: string;
  text: string;
}) {
  const { user, pass } = getSmtpConfig();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from: user,
    to: input.to,
    bcc: input.bcc,
    subject: input.subject,
    text: input.text,
  });
}

export async function sendRideJoinNotificationEmail(input: {
  bccRecipients: string[];
  joinerName: string;
  routeLabel: string;
  departureDate: Date;
  departureTime: string;
}) {
  const { user } = getSmtpConfig();

  if (input.bccRecipients.length === 0) {
    return;
  }

  const appUrl = getAppUrl();
  const text = [
    `${input.joinerName} has joined your ride.`,
    "",
    `Route: ${input.routeLabel}`,
    `Date: ${formatRideDate(input.departureDate)}`,
    `Time: ${input.departureTime}`,
    ...(appUrl ? ["", `Open GoTogether: ${appUrl}`] : []),
  ].join("\n");

  await sendEmail({
    to: user,
    bcc: input.bccRecipients,
    subject: "New member joined your ride",
    text,
  });
}

export async function sendRideChatNotificationEmail(input: {
  bccRecipients: string[];
  senderName: string;
  routeLabel: string;
  departureDate: Date;
  departureTime: string;
}) {
  const { user } = getSmtpConfig();

  if (input.bccRecipients.length === 0) {
    return;
  }

  const appUrl = getAppUrl();
  const text = [
    "You have a chat.",
    "",
    `${input.senderName} sent a message in your ride.`,
    `Route: ${input.routeLabel}`,
    `Date: ${formatRideDate(input.departureDate)}`,
    `Time: ${input.departureTime}`,
    ...(appUrl ? ["", `Open GoTogether: ${appUrl}`] : []),
  ].join("\n");

  await sendEmail({
    to: user,
    bcc: input.bccRecipients,
    subject: "You have a chat",
    text,
  });
}

export async function sendSupportFeedbackEmail(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const appUrl = getAppUrl();
  const text = [
    "New feedback for GoTogether.",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Subject: ${input.subject}`,
    "",
    input.message,
    ...(appUrl ? ["", `App URL: ${appUrl}`] : []),
  ].join("\n");

  await sendEmail({
    to: SUPPORT_EMAIL,
    subject: `Feedback: ${input.subject}`,
    text,
  });
}

export async function sendProviderContactNotificationEmail(input: {
  providerName: string;
  providerPhone: string;
  contactedAt: Date;
  userName?: string | null;
  userEmail?: string | null;
}) {
  const appUrl = getAppUrl();
  const contactedAtText = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "long",
    timeZone: "Asia/Kolkata",
  }).format(input.contactedAt);

  const text = [
    "A provider call button was clicked on GoTogether.",
    "",
    `Provider: ${input.providerName}`,
    `Provider phone: ${input.providerPhone}`,
    `Contacted at: ${contactedAtText}`,
    ...(input.userName ? [`User name: ${input.userName}`] : []),
    ...(input.userEmail ? [`User email: ${input.userEmail}`] : []),
    ...(appUrl ? ["", `App URL: ${appUrl}`] : []),
  ].join("\n");

  await sendEmail({
    to: SUPPORT_EMAIL,
    subject: `Provider contacted: ${input.providerName}`,
    text,
  });
}
