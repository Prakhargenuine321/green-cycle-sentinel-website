import dns from "node:dns";
import nodemailer from "nodemailer";

// Force Node.js to prefer IPv4 DNS resolution.
// This prevents ENETUNREACH errors in environments (like Railway, AWS, Docker) where IPv6 outbound is not configured or disabled.
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

// Create reusable transporter
const createTransporter = () => {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true", // true for port 465, false for 587 or 2525
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // Fallback to default Gmail service
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export async function sendOtpEmail(toEmail: string, otpCode: string, userName: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || process.env.SMTP_USER === "your-gmail@gmail.com") {
      throw new Error("Email SMTP credentials are not configured in .env file.");
    }

    const transporter = createTransporter();

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GCS Sentinel - Verify Your Email</title>
</head>
<body style="margin:0;padding:0;background-color:#0d1117;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d1117;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#12181f;border-radius:16px;border:1px solid rgba(34,197,94,0.15);overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#064e3b,#0d2518);padding:32px 40px;text-align:center;border-bottom:1px solid rgba(34,197,94,0.1);">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.3);border-radius:12px;padding:12px;margin-right:12px;vertical-align:middle;">
                    <span style="font-size:22px;">♻️</span>
                  </td>
                  <td style="padding-left:12px;vertical-align:middle;">
                    <span style="color:#f0fdf4;font-size:18px;font-weight:700;letter-spacing:-0.5px;">GCS <span style="font-weight:300;color:#86efac;">Sentinel</span></span>
                  </td>
                </tr>
              </table>
              <p style="color:#86efac;font-size:11px;margin:12px 0 0;text-transform:uppercase;letter-spacing:2px;font-family:monospace;">Green Cycle Sentinel Platform</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="color:#f0fdf4;font-size:22px;font-weight:700;margin:0 0 8px;letter-spacing:-0.5px;">Verify Your Email Address</h1>
              <p style="color:#6b7280;font-size:14px;margin:0 0 28px;line-height:1.6;">Hello ${userName}, please use the verification code below to complete your registration to the GCS Sentinel waste management platform.</p>
              
              <!-- OTP Code -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,rgba(34,197,94,0.08),rgba(16,185,129,0.04));border:1px solid rgba(34,197,94,0.2);border-radius:12px;padding:24px;text-align:center;">
                    <p style="color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:3px;font-family:monospace;margin:0 0 12px;">Your Verification Code</p>
                    <p style="color:#4ade80;font-size:38px;font-weight:700;letter-spacing:12px;margin:0;font-family:monospace;">${otpCode}</p>
                    <p style="color:#6b7280;font-size:11px;font-family:monospace;margin:12px 0 0;">⏱ Expires in 10 minutes</p>
                  </td>
                </tr>
              </table>

              <p style="color:#6b7280;font-size:12px;line-height:1.6;margin:24px 0 0;">Enter this code on the verification screen to activate your account. If you did not register on GCS Sentinel, you can safely ignore this email.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0d1117;padding:20px 40px;border-top:1px solid rgba(255,255,255,0.05);">
              <p style="color:#374151;font-size:11px;margin:0;text-align:center;font-family:monospace;">Green Cycle Sentinel &mdash; Municipal Waste Management Intelligence</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Green Cycle Sentinel" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `GCS Sentinel: Your verification code is ${otpCode}`,
      text: `Hello ${userName},\n\nYour GCS Sentinel email verification code is: ${otpCode}\n\nThis code expires in 10 minutes.\n\nIf you didn't register, please ignore this email.\n\n— Green Cycle Sentinel`,
      html: htmlBody,
    });

    return { success: true };
  } catch (error) {
    console.error("[EMAIL] Failed to send OTP email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send verification email",
    };
  }
}

export async function sendWasteReportEmail(data: {
  reporterName: string;
  email: string;
  phone: string;
  location: string;
  category: string;
  quantity: number;
  description: string;
  fileUrl?: string | null;
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || process.env.SMTP_USER === "your-gmail@gmail.com") {
      throw new Error("Email SMTP credentials are not configured in .env file.");
    }

    const transporter = createTransporter();

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GCS Sentinel - New Waste Report Registered</title>
</head>
<body style="margin:0;padding:0;background-color:#0d1117;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d1117;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#12181f;border-radius:16px;border:1px solid rgba(239,68,68,0.15);overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7f1d1d,#0d1117);padding:32px 40px;text-align:center;border-bottom:1px solid rgba(239,68,68,0.15);">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);border-radius:12px;padding:12px;margin-right:12px;vertical-align:middle;">
                    <span style="font-size:22px;">⚠️</span>
                  </td>
                  <td style="padding-left:12px;vertical-align:middle;">
                    <span style="color:#fef2f2;font-size:18px;font-weight:700;letter-spacing:-0.5px;">GCS <span style="font-weight:300;color:#fca5a5;">Sentinel</span></span>
                  </td>
                </tr>
              </table>
              <p style="color:#fca5a5;font-size:11px;margin:12px 0 0;text-transform:uppercase;letter-spacing:2px;font-family:monospace;">Waste Intake Alert System</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="color:#fef2f2;font-size:22px;font-weight:700;margin:0 0 16px;letter-spacing:-0.5px;">New Waste Report Registered</h1>
              <p style="color:#9ca3af;font-size:14px;margin:0 0 24px;line-height:1.6;">A new municipal waste deposit report has been registered. The current status is set to <strong>not clear</strong>. Please review the details below:</p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1e293b;border-radius:8px;padding:16px;margin-bottom:24px;">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#9ca3af;font-size:12px;width:140px;font-weight:bold;">Reporter Name</td>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#f1f5f9;font-size:12px;">${data.reporterName}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#9ca3af;font-size:12px;font-weight:bold;">Email Address</td>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#f1f5f9;font-size:12px;">${data.email}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#9ca3af;font-size:12px;font-weight:bold;">Phone Number</td>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#f1f5f9;font-size:12px;">${data.phone}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#9ca3af;font-size:12px;font-weight:bold;">GPS Coordinates</td>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#f1f5f9;font-size:12px;font-family:monospace;color:#fca5a5;">${data.location}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#9ca3af;font-size:12px;font-weight:bold;">Waste Category</td>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#f1f5f9;font-size:12px;text-transform:capitalize;">${data.category}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#9ca3af;font-size:12px;font-weight:bold;">Quantity</td>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#f1f5f9;font-size:12px;">${data.quantity} Metric Tons</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#9ca3af;font-size:12px;font-weight:bold;vertical-align:top;">Description</td>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#f1f5f9;font-size:12px;line-height:1.5;">${data.description}</td>
                </tr>
                ${data.fileUrl ? `
                <tr>
                  <td style="padding:8px 0;color:#9ca3af;font-size:12px;font-weight:bold;">Attached Image</td>
                  <td style="padding:8px 0;color:#38bdf8;font-size:12px;font-weight:bold;"><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${data.fileUrl}" target="_blank" style="color:#38bdf8;text-decoration:underline;">View Image Attachment</a></td>
                </tr>
                ` : ""}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0d1117;padding:20px 40px;border-top:1px solid rgba(255,255,255,0.05);">
              <p style="color:#4b5563;font-size:11px;margin:0;text-align:center;font-family:monospace;">Green Cycle Sentinel &mdash; Circular Logistics Operations</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: `"${data.reporterName}" <${data.email}>`,
      replyTo: data.email,
      to: process.env.SMTP_USER,
      subject: `[New Waste Report Alert] ${data.category.toUpperCase()} at ${data.location}`,
      text: `Hello,\n\nA new waste report has been submitted.\n\nReporter: ${data.reporterName}\nEmail: ${data.email}\nPhone: ${data.phone}\nLocation: ${data.location}\nCategory: ${data.category}\nQuantity: ${data.quantity} Tons\nDescription: ${data.description}\n\nStatus: not clear\n\n— Green Cycle Sentinel Operations`,
      html: htmlBody,
    });

    return { success: true };
  } catch (error) {
    console.error("[EMAIL] Failed to send waste report email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email alert",
    };
  }
}
