import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client for logging email status (if credentials exist)
const supabaseAdmin = (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

// Role-based SMTP credentials
const SMTP_CONFIGS = {
  ADMIN: {
    user: '12220064.gcit@rub.edu.bt',
    pass: 'qvsw zjpq eexf fqwk'
  },
  SUPPLIER: {
    user: 'kwangchuk508@gmail.com',
    pass: 'vomy fhxk hviw dxdh'
  },
  AGENCY: {
    user: 'ngawangg927@gmail.com',
    pass: 'bjms isqc rpve eutu'
  },
  AUDITOR: {
    user: 'guruwangchuk1234@gmail.com',
    pass: 'baqz lywr njla qwss'
  },
  DEFAULT: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};

/**
 * Creates a transporter for a specific role or returns the default one.
 */
const getTransporter = (role) => {
  const config = SMTP_CONFIGS[role?.toUpperCase()] || SMTP_CONFIGS.DEFAULT;
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
};

/**
 * Sends a real email via Gmail SMTP and logs the result to Supabase.
 * 
 * @param {Object} options 
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email body (text or html)
 * @param {string} options.senderRole - (Optional) ADMIN, SUPPLIER, AGENCY, AUDITOR
 * @param {Object} options.metadata - Related entity IDs for logging
 */
export const sendEmail = async ({ to, subject, message, senderRole = 'DEFAULT', metadata = {} }) => {
  // Create pending notification record in Supabase (if available)
  let logRecord = null;
  if (supabaseAdmin) {
    const { data, error: logError } = await supabaseAdmin
      .from('email_notifications')
      .insert({
        recipient_email: to,
        subject,
        message,
        status: 'pending',
        ...metadata
      })
      .select()
      .single();
    logRecord = data;

    if (logError) {
      console.error('Error logging email notification:', logError);
    }
  }

  try {
    const config = SMTP_CONFIGS[senderRole?.toUpperCase()] || SMTP_CONFIGS.DEFAULT;
    const transporter = getTransporter(senderRole);
    
    const info = await transporter.sendMail({
      from: `"BGPS ${senderRole.charAt(0).toUpperCase() + senderRole.slice(1).toLowerCase()}" <${config.user}>`,
      to,
      subject,
      html: message,
    });

    console.log(`Email sent from ${senderRole}: %s`, info.messageId);

    // Update log status to sent (if available)
    if (logRecord && supabaseAdmin) {
      await supabaseAdmin
        .from('email_notifications')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', logRecord.id);
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Error sending email from ${senderRole}:`, error);

    // Update log status to failed (if available)
    if (logRecord && supabaseAdmin) {
      await supabaseAdmin
        .from('email_notifications')
        .update({ status: 'failed', error_message: error.message })
        .eq('id', logRecord.id);
    }

    return { success: false, error: error.message };
  }
};
