import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor() {
    // Initialize SendGrid with your API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendEmail(data: { to: string; subject: string; text: string }) {
    const msg = {
      to: data.to,
      from: process.env.SENDGRID_FROM_EMAIL, // Your verified sender email
      subject: data.subject,
      text: data.text,
    };

    try {
      await sgMail.send(msg);
      console.log(`Email sent to ${data.to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email.');
    }
  }
}
