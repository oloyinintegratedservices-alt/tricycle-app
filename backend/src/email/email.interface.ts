export interface EmailInput {
  email: string;
}

export interface EmailProvider {
  sendEmail(input: EmailInput): void;
}
