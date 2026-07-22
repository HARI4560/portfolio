import https from 'https';

/**
 * Universal mail sender using Brevo API (bypasses SMTP firewalls completely)
 */
const sendMailToClient = async (mailOptions) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('Missing BREVO_API_KEY in environment variables');
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.ADMIN_EMAIL;

  const payload = JSON.stringify({
    sender: { name: 'portfolio', email: senderEmail },
    to: [{ email: mailOptions.to }],
    subject: mailOptions.subject,
    htmlContent: mailOptions.html,
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.brevo.com',
      port: 443,
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
        } else {
          reject(new Error(`Brevo API Error: ${data}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Brevo API Request Error: ${e.message}`));
    });

    req.write(payload);
    req.end();
  });
};

/**
 * Send a review request email to a client
 */
const sendReviewEmail = async ({ clientEmail, clientName, projectTitle, reviewLink, expiresAt }) => {
  const expiryDate = new Date(expiresAt).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);border-radius:16px;padding:40px;border:1px solid rgba(6,182,212,0.2);">
          <!-- Header -->
          <div style="text-align:center;margin-bottom:32px;">
            <h1 style="color:#06b6d4;font-size:24px;margin:0 0 8px 0;">Review Request</h1>
            <div style="width:60px;height:3px;background:linear-gradient(90deg,#06b6d4,#8b5cf6);margin:0 auto;border-radius:2px;"></div>
          </div>
          
          <!-- Body -->
          <p style="color:#e2e8f0;font-size:16px;line-height:1.6;margin:0 0 16px 0;">
            Hi <strong style="color:#06b6d4;">${clientName}</strong>,
          </p>
          <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px 0;">
            Thank you for giving me this opportunity! I'd love to hear your feedback on the project 
            <strong style="color:#e2e8f0;">"${projectTitle}"</strong>. Your review helps showcase the quality of my work.
          </p>
          
          <!-- CTA Button -->
          <div style="text-align:center;margin:32px 0;">
            <a href="${reviewLink}" 
               style="display:inline-block;background:linear-gradient(135deg,#06b6d4,#8b5cf6);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;letter-spacing:0.5px;">
              ⭐ Leave Your Review
            </a>
          </div>
          
          <!-- Expiry Notice -->
          <div style="background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.2);border-radius:8px;padding:16px;margin:24px 0;">
            <p style="color:#c4b5fd;font-size:13px;margin:0;text-align:center;">
              ⏳ This link expires on <strong>${expiryDate}</strong>
            </p>
          </div>
          
          <!-- Fallback Link -->
          <p style="color:#64748b;font-size:12px;line-height:1.5;margin:24px 0 0 0;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${reviewLink}" style="color:#06b6d4;word-break:break-all;">${reviewLink}</a>
          </p>
        </div>
        
        <!-- Footer -->
        <p style="color:#475569;font-size:11px;text-align:center;margin-top:24px;">
          This is an automated email. Please do not reply directly.
        </p>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    to: clientEmail,
    subject: `Review Request: ${projectTitle}`,
    html: htmlTemplate,
  };

  await sendMailToClient(mailOptions);
};

/**
 * Send a security alert email to the admin
 */
const sendSecurityAlertEmail = async ({ adminEmail, eventType, ipAddress, userAgent, details }) => {

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="background:linear-gradient(135deg,#2a1015 0%,#1a0505 100%);border-radius:16px;padding:40px;border:1px solid rgba(239,68,68,0.2);">
          <div style="text-align:center;margin-bottom:32px;">
            <h1 style="color:#ef4444;font-size:24px;margin:0 0 8px 0;">Security Alert</h1>
            <div style="width:60px;height:3px;background:linear-gradient(90deg,#ef4444,#f59e0b);margin:0 auto;border-radius:2px;"></div>
          </div>
          <p style="color:#e2e8f0;font-size:16px;line-height:1.6;margin:0 0 16px 0;">
            <strong>Alert Type:</strong> ${eventType}
          </p>
          <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px 0;">
            A suspicious activity or critical security event was detected on your admin account.
          </p>
          <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:8px;padding:16px;margin:24px 0;">
            <p style="color:#fca5a5;font-size:14px;margin:0 0 8px 0;"><strong>IP Address:</strong> ${ipAddress}</p>
            <p style="color:#fca5a5;font-size:14px;margin:0 0 8px 0;"><strong>User Agent:</strong> ${userAgent}</p>
            <p style="color:#fca5a5;font-size:14px;margin:0;"><strong>Details:</strong> ${JSON.stringify(details)}</p>
          </div>
          <p style="color:#64748b;font-size:12px;line-height:1.5;margin:24px 0 0 0;">
            If you did not authorize this action, please investigate your server immediately.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    to: adminEmail,
    subject: `🚨 Security Alert: ${eventType}`,
    html: htmlTemplate,
  };

  try {
    await sendMailToClient(mailOptions);
  } catch (error) {
    console.error('Failed to send security alert email:', error.message);
  }
};

export { sendReviewEmail, sendSecurityAlertEmail };
