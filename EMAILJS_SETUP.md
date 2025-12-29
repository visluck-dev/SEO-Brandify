# EmailJS Integration Setup Guide

This project uses **EmailJS** to send email notifications when someone submits the contact form. EmailJS allows you to send emails directly from the frontend without needing a backend server.

## Quick Setup Steps

### 1. Create an EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (200 emails/month free)

### 2. Add an Email Service
1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions to connect your email
5. **Copy your Service ID** (you'll need this later)

### 3. Create an Email Template
1. Go to **Email Templates** in your dashboard
2. Click **Create New Template** (or use your existing template)
3. Use this template structure:

**Subject:** `New message from {{name}}`

**Content:**
```
Hello ,
You got a new message from {{name}}
{{ message }}
contact : {{ phone}}
email : ({{ email}})

Best wishes,
EmailJS team
```

**Note:** Make sure your template uses these exact variable names:
- `{{name}}` - The sender's name
- `{{email}}` - The sender's email
- `{{phone}}` - The sender's phone number
- `{{message}}` - The message content

4. **Copy your Template ID** (you'll need this later)

### 4. Get Your Public Key
1. Go to **Account** → **General** → **API Keys**
2. **Copy your Public Key**

### 5. Configure Environment Variables
1. Create a `.env` file in the root of your project (same level as `package.json`)
2. Add the following variables:

```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
```

3. Replace the placeholder values with your actual EmailJS credentials

### 6. Restart Your Development Server
After adding the environment variables, restart your dev server:
```bash
npm run dev
```

## How It Works

When someone submits the contact form:
1. The form data is sent to EmailJS
2. EmailJS uses your email service to send an email
3. You receive an email notification with all the form details
4. The user sees a success message

## Testing

1. Fill out the contact form on your website
2. Submit it
3. Check your email inbox - you should receive the notification
4. Check the browser console for any errors

## Troubleshooting

### Email not sending?
- Verify your environment variables are set correctly
- Check that your EmailJS service is properly connected
- Make sure your template variables match: `{{from_name}}`, `{{from_email}}`, `{{phone}}`, `{{subject}}`, `{{message}}`
- Check the browser console for error messages

### Environment variables not working?
- Make sure your `.env` file is in the root directory
- Restart your dev server after adding environment variables
- Variables must start with `VITE_` to be accessible in Vite

## Alternative: Direct Configuration

If you prefer not to use environment variables, you can directly edit `client/src/lib/emailjs.ts` and replace the placeholder values:

```typescript
export const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'your_actual_public_key',
  SERVICE_ID: 'your_actual_service_id',
  TEMPLATE_ID: 'your_actual_template_id',
};
```

**Note:** This is less secure for production. Use environment variables instead.

## Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- Basic email templates
- Standard support

For production use with higher volume, consider upgrading to a paid plan.


