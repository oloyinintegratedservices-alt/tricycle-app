import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { TemplateService } from './template.service';
import { BrevoProvider } from './brevo.provider';

@Module({
  controllers: [],
  providers: [EmailService, TemplateService, BrevoProvider],
  exports: [EmailService],
})
export class EmailModule {}
