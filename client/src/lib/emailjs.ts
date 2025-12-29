import emailjs from '@emailjs/browser';

// EmailJS Configuration
// Get these values from https://www.emailjs.com/
// 1. Sign up at https://www.emailjs.com/
// 2. Create an email service (Gmail, Outlook, etc.)
// 3. Create an email template
// 4. Get your Public Key, Service ID, and Template ID

export const EMAILJS_CONFIG = {
  // Your EmailJS Public Key (found in Account > API Keys)
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '3xfHeZB919CMBJudZ',
  
  // Your EmailJS Service ID (found in Email Services)
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_rlionil',
  
  // Your EmailJS Template ID (found in Email Templates)
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_nevx0zw',
};

// Check if EmailJS is properly configured
export function isEmailJSConfigured(): boolean {
  return (
    EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' &&
    EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
    EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
    EMAILJS_CONFIG.PUBLIC_KEY !== '' &&
    EMAILJS_CONFIG.SERVICE_ID !== '' &&
    EMAILJS_CONFIG.TEMPLATE_ID !== ''
  );
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

/**
 * Send contact form message via EmailJS
 * @param formData - The contact form data
 * @returns Promise that resolves when email is sent
 */
export async function sendContactEmail(formData: ContactFormData): Promise<void> {
  // Check if EmailJS is configured
  if (!isEmailJSConfigured()) {
    throw new Error(
      'EmailJS is not configured. Please set up your EmailJS credentials in the .env file. ' +
      'See EMAILJS_SETUP.md for instructions.'
    );
  }

  try {
    // Initialize EmailJS with the public key
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

    const templateParams = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || 'Not provided',
      message: formData.message,
      reply_to: formData.email, // For the Reply To field in EmailJS
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    if (response.status === 200) {
      console.log('Email sent successfully:', response);
    } else {
      throw new Error(`EmailJS returned status ${response.status}`);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}


