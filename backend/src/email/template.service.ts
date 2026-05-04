import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

@Injectable()
export class TemplateService {
  private templateDir = path.join(__dirname, 'templates');

  render(templateName: string, data: Record<string, any>) {
    const filePath = path.join(this.templateDir, `${templateName}.hbs`);

    const templateFile = fs.readFileSync(filePath, 'utf-8');

    const compiled = Handlebars.compile(templateFile);

    return compiled(data);
  }
}
