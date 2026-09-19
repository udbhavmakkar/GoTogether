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
  html?: string;
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
    from: {
      name: "GoTogether",
      address: user,
    },
    replyTo: user,
    to: input.to,
    bcc: input.bcc,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getFirstNameFromEmail(email: string) {
  const localPart = email.split("@")[0] || "";
  const firstSegment = localPart.split(/[._-]+/).find((segment) => /[a-z]/i.test(segment)) || "";
  const lettersOnly = firstSegment.replace(/[^a-z]/gi, "");

  if (lettersOnly.length < 2) {
    return "there";
  }

  return `${lettersOnly.charAt(0).toUpperCase()}${lettersOnly.slice(1).toLowerCase()}`;
}

function getCustomerFirstName(name: string | null | undefined, email: string) {
  const firstName = name?.trim().split(/\s+/)[0]?.replace(/[^a-z'-]/gi, "") || "";

  if (firstName.length < 2) {
    return getFirstNameFromEmail(email);
  }

  return `${firstName.charAt(0).toUpperCase()}${firstName.slice(1).toLowerCase()}`;
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
  followUpId?: string | null;
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
    ...(input.followUpId ? [`Lead ID: ${input.followUpId}`] : []),
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

export async function sendProviderFollowUpEmail(input: {
  customerEmail: string;
  customerName?: string | null;
  providerName: string;
  contactedAt: Date;
  followUpId: string;
  responseToken: string;
}) {
  const appUrl = getAppUrl();

  if (!appUrl) {
    throw new Error("APP_URL_NOT_CONFIGURED");
  }

  const customerFirstName = getCustomerFirstName(input.customerName, input.customerEmail);
  const contactedAtText = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(input.contactedAt);
  const createResponseUrl = (response: "BOOKED" | "NOT_BOOKED" | "DECIDING") => {
    const url = new URL("/api/provider-follow-ups/respond", appUrl);
    url.searchParams.set("token", input.responseToken);
    url.searchParams.set("response", response);
    return url.toString();
  };
  const bookedUrl = createResponseUrl("BOOKED");
  const notBookedUrl = createResponseUrl("NOT_BOOKED");
  const decidingUrl = createResponseUrl("DECIDING");
  const text = [
    `Hi ${customerFirstName},`,
    "",
    `You recently contacted ${input.providerName} through GoTogether on ${contactedAtText}.`,
    "",
    "We just wanted to check how it went.",
    "",
    "Did you book your taxi with this provider?",
    "",
    `Yes, I booked: ${bookedUrl}`,
    `No, I didn't: ${notBookedUrl}`,
    `Still deciding: ${decidingUrl}`,
    "",
    "Your response helps us improve provider quality and make GoTogether better for future rides.",
    "",
    `Reference: ${input.followUpId}`,
    "",
    "Thanks,",
    "Team GoTogether",
  ].join("\n");
  const buttonStyle =
    "display:block;margin:10px 0;padding:13px 18px;border-radius:12px;text-align:center;text-decoration:none;font-size:15px;font-weight:700;";
  const html = `
    <!doctype html>
    <html lang="en">
      <body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#0f172a;">
        <div style="display:none;max-height:0;overflow:hidden;">A follow-up about the taxi provider you contacted through GoTogether.</div>
        <div style="margin:0 auto;max-width:560px;padding:24px 14px;">
          <div style="overflow:hidden;border:1px solid #e2e8f0;border-radius:22px;background:#ffffff;">
            <div style="padding:20px 24px;background:#075985;color:#ffffff;">
              <div style="font-size:22px;font-weight:800;">GoTogether</div>
              <div style="margin-top:4px;font-size:13px;color:#bae6fd;">VIT ride coordination</div>
            </div>
            <div style="padding:24px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Hi ${escapeHtml(customerFirstName)},</p>
              <p style="margin:0 0 14px;font-size:15px;line-height:1.6;">
                You recently contacted <strong>${escapeHtml(input.providerName)}</strong> through GoTogether on
                <strong>${escapeHtml(contactedAtText)}</strong>.
              </p>
              <p style="margin:0 0 18px;font-size:15px;line-height:1.6;">We just wanted to check how it went.</p>
              <p style="margin:0 0 14px;font-size:16px;font-weight:700;">Did you book your taxi with this provider?</p>
              <a href="${escapeHtml(bookedUrl)}" style="${buttonStyle}background:#0284c7;color:#ffffff;">Yes, I booked</a>
              <a href="${escapeHtml(notBookedUrl)}" style="${buttonStyle}border:1px solid #cbd5e1;background:#ffffff;color:#0f172a;">No, I didn&apos;t</a>
              <a href="${escapeHtml(decidingUrl)}" style="${buttonStyle}border:1px solid #fed7aa;background:#fff7ed;color:#9a3412;">Still deciding</a>
              <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#64748b;">
                Your response helps us improve provider quality and make GoTogether better for future rides.
              </p>
              <p style="margin:18px 0 0;font-size:13px;color:#94a3b8;">Reference: ${escapeHtml(input.followUpId)}</p>
              <p style="margin:20px 0 0;font-size:15px;line-height:1.6;">Thanks,<br />Team GoTogether</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: input.customerEmail,
    subject: `Did you book your ride with ${input.providerName}?`,
    text,
    html,
  });
}

export async function sendProviderFollowUpResponseNotificationEmail(input: {
  customerName: string;
  customerEmail: string;
  providerName: string;
  response: "BOOKED" | "NOT_BOOKED" | "DECIDING";
  contactedAt: Date;
  respondedAt: Date;
  followUpId: string;
}) {
  const responseLabels = {
    BOOKED: "Booked the cab",
    NOT_BOOKED: "Did not book the cab",
    DECIDING: "Still deciding",
  } as const;
  const responseLabel = responseLabels[input.response];
  const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
  const text = [
    "A customer responded to the GoTogether booking confirmation.",
    "",
    `Customer: ${input.customerName}`,
    `Customer email: ${input.customerEmail}`,
    `Provider: ${input.providerName}`,
    `Response: ${responseLabel}`,
    `Provider contacted: ${dateFormatter.format(input.contactedAt)}`,
    `Response received: ${dateFormatter.format(input.respondedAt)}`,
    `Lead ID: ${input.followUpId}`,
  ].join("\n");

  await sendEmail({
    to: SUPPORT_EMAIL,
    subject: `Cab booking response: ${responseLabel} - ${input.customerName}`,
    text,
  });
}
