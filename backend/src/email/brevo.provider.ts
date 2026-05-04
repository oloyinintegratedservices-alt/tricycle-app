import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class BrevoProvider {
  private baseUrl = 'https://api.brevo.com/v3/smtp/email';

  async sendEmail(payload: {
    to: string;
    subject: string;
    html: string;
    from: string;
  }) {
    return axios.post(
      this.baseUrl,
      {
        sender: { email: payload.from },
        to: [{ email: payload.to }],
        subject: payload.subject,
        htmlContent: payload.html,
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
