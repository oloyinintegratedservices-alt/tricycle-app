import { Injectable } from '@nestjs/common';
import { TemplateService } from './template.service';
import { BrevoProvider } from './brevo.provider';

@Injectable()
export class EmailService {
  constructor(
    private templateService: TemplateService,
    private brevo: BrevoProvider,
  ) {}

  async sendMail(options: {
    to: string;
    subject: string;
    template: string;
    context: Record<string, any>;
  }) {
    const html = this.templateService.render(options.template, options.context);

    await this.brevo.sendEmail({
      to: options.to,
      subject: options.subject,
      html,
      from: process.env.MAIL_FROM!,
    });
  }
}
