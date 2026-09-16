# EmailJS setup (consultation form)

The **Book a Free Consultation** form (`/book-a-consultation`) sends an email through [EmailJS](https://www.emailjs.com) — no backend is needed, which suits GitHub Pages hosting.

## 1. Keys

Set these in a `.env` file (see `.env.example`). They are public identifiers, so shipping them in the client bundle is expected. If unset, the values in `client/src/lib/emailjs.ts` are used.

```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
```

## 2. Template variables

The form posts these parameters (input `name`s):

| Parameter | Content |
|---|---|
| `name`, `email`, `phone`, `message`, `reply_to` | Kept for **backwards compatibility** — the existing template keeps working unchanged. `message` is a formatted summary of every field. |
| `fullName`, `location`, `jobTitle`, `experience`, `targetRole`, `industry`, `linkedin`, `cvLink`, `preferredTime` | Individual fields if you want a richer template. |
| `cv` | The uploaded CV file (see below). |

A minimal template body that shows everything:

```
New consultation request

{{message}}

Reply to: {{reply_to}}
```

## 3. CV attachments

EmailJS attaches files only on **paid plans**. To enable:

1. Open the template → **Attachments** → add **Form File Attachment** with parameter name `cv`.
2. Keep `VITE_CV_UPLOAD_MODE=file` (the default).

If you stay on the free plan, set `VITE_CV_UPLOAD_MODE=link` and the form shows a "Link to your CV" field instead of an upload.

## 4. Spam protection

The form has a hidden honeypot field and ignores submissions completed in under three seconds. No CAPTCHA is used. EmailJS also lets you enable domain allow-listing and rate limits in its dashboard — recommended for production.

## 5. Testing

Fill the form on `npm run dev` and submit. A success panel appears and the email arrives in the inbox connected to your EmailJS service. Errors are shown inline and in a toast, with a `mailto:` fallback.
