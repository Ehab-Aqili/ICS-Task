import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: configService.get<string>('EMAIL_USER'),
        pass: configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendOtpEmail(email: string, otp: number): Promise<void> {
    console.log(
      "this.configService.get<string>('EMAIL_USER')",
      configService.get<string>('EMAIL_USER'),
      typeof configService.get<string>('EMAIL_PASSWORD'),
    );
    const mailOptions = {
      from: configService.get<string>('EMAIL_USER'),
      to: email,
      subject: 'Account Verification - OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Account Verification</h2>
          <p>Hello,</p>
          <p>Please use the following OTP code to verify your account:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otp}</h1>
          </div>
          <p><strong>Important:</strong> This OTP will expire in 1 minute.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <p>Best regards,<br>Your App Team</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send OTP email');
    }
  }
}
