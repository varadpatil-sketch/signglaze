const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const SGT_EMAIL = process.env.NOTIFICATION_EMAIL || 'sg_tech9@rediffmail.com';

// Configure SMTP transport if credentials are provided in .env
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

/**
 * Send lead notification to SGT Workshop & acknowledgment to Client
 */
async function sendLeadNotifications(lead, uploadedFile) {
  const mailSubject = `🔔 New Signage Inquiry [${lead.lead_id}]: ${lead.name} (${lead.company || 'Direct Client'})`;
  
  const attachments = [];
  if (uploadedFile && uploadedFile.filename) {
    attachments.push({
      filename: uploadedFile.originalname,
      path: path.join(__dirname, 'uploads', uploadedFile.filename)
    });
  }

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #e63946, #b81d2c); padding: 20px; color: #ffffff;">
        <h2 style="margin: 0; font-size: 20px;">SIGN GLAZE TECHNOLOGY (SGT)</h2>
        <p style="margin: 5px 0 0; font-size: 13px; opacity: 0.9;">Total Solution for Indoor & Outdoor Signages • Thane (W)</p>
      </div>

      <div style="padding: 24px; background: #ffffff; color: #1e293b;">
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 18px;">
          <div>
            <strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Lead Reference ID</strong>
            <div style="font-size: 18px; font-weight: bold; color: #e63946;">${lead.lead_id}</div>
          </div>
          <div style="text-align: right;">
            <strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Source</strong>
            <div style="font-size: 14px; font-weight: 600; text-transform: capitalize;">${lead.source.replace('_', ' ')}</div>
          </div>
        </div>

        <h3 style="margin: 0 0 12px; font-size: 16px; color: #0f172a;">Client Contact Information</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 140px;">Client Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">${lead.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Phone / Mobile:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">
              <a href="tel:${lead.phone}" style="color: #e63946; text-decoration: none;">${lead.phone}</a> 
              &nbsp;|&nbsp; 
              <a href="https://wa.me/91${lead.phone.replace(/[^0-9]/g, '')}" style="color: #25d366; text-decoration: none; font-weight: bold;">WhatsApp Chat</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Email Address:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${lead.email || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Company / Brand:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">${lead.company || 'Direct'}</td>
          </tr>
        </table>

        <h3 style="margin: 0 0 12px; font-size: 16px; color: #0f172a;">Signage Requirements &amp; Specs</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 140px;">Signage Type:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">${lead.sign_type || 'Custom'}</td>
          </tr>
          ${lead.dimensions ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Dimensions / Area:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${lead.dimensions} ${lead.area_sqft ? `(${lead.area_sqft} Sq. Ft.)` : ''}</td>
          </tr>` : ''}
          ${lead.illumination ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Lighting Style:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${lead.illumination}</td>
          </tr>` : ''}
          ${lead.estimated_budget ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Estimated Budget:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #e63946; font-weight: bold;">${lead.estimated_budget}</td>
          </tr>` : ''}
          ${lead.location ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Installation Site:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${lead.location}</td>
          </tr>` : ''}
          ${lead.custom_text ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Simulated Text:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; font-family: monospace;">${lead.custom_text}</td>
          </tr>` : ''}
          ${lead.notes ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Project Notes:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${lead.notes}</td>
          </tr>` : ''}
          ${uploadedFile ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Uploaded Artwork:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #0284c7; font-weight: bold;">Attached (${uploadedFile.originalname})</td>
          </tr>` : ''}
        </table>

        <div style="background: #f8fafc; padding: 15px; border-radius: 6px; text-align: center; margin-top: 15px;">
          <a href="http://localhost:3000/admin" style="background: #0f172a; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; display: inline-block;">
            Open SGT Admin Dashboard →
          </a>
        </div>
      </div>

      <div style="background: #f1f5f9; padding: 14px 24px; font-size: 12px; color: #64748b; text-align: center;">
        Sign Glaze Technology • 4/404, Prathpushpa Complex, Near Suraj Water Park, GB Road, Thane (W) - 400601
      </div>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"SGT Web Inquiries" <${process.env.SMTP_USER}>`,
        to: SGT_EMAIL,
        subject: mailSubject,
        html: htmlBody,
        attachments: attachments
      });
      console.log(`[MAILER] Notification email sent to ${SGT_EMAIL} for lead ${lead.lead_id}`);
      return { success: true };
    } catch (err) {
      console.error('[MAILER ERROR] Failed to send email via SMTP:', err.message);
      return { success: false, error: err.message };
    }
  } else {
    console.log(`[MAILER SIMULATION] SMTP not configured in .env. Notification for lead ${lead.lead_id} recorded in database.`);
    return { success: true, simulated: true };
  }
}

module.exports = {
  sendLeadNotifications
};
