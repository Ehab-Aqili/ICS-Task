# OTP Validation Feature

This feature provides One-Time Password (OTP) validation for user account activation using nodemailer.

## Overview

- Users register with `isActive: false` by default
- Users need to verify their email using OTP to activate their account
- OTP expires after 1 minute
- OTP is sent via email using nodemailer

## API Endpoints

### 1. Send OTP

**POST** `/user/send-otp`

Send OTP to user's email for account activation.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "message": "OTP sent successfully to your email"
}
```

### 2. Validate OTP

**POST** `/user/validate-otp`

Validate OTP and activate user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "otp": 123456
}
```

**Response:**

```json
{
  "message": "Account activated successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## Database Changes

### User Entity Updates

- Added `otp: number | null` - stores the 6-digit OTP
- Added `otpExpiresAt: Date | null` - stores OTP expiration timestamp
- Changed default `isActive: false` for new registrations

## Email Configuration

### Environment Variables

Add these to your `.env` file:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an app password
3. Use the app password in the EMAIL_PASSWORD variable

### Email Service

The `EmailService` is configured to use Gmail SMTP by default. You can modify the transporter configuration in `src/user/services/email.service.ts` for other email providers.

## Usage Flow

1. **User Registration**: User registers → Account created with `isActive: false`
2. **Send OTP**: User requests OTP → 6-digit OTP generated and sent via email
3. **Validate OTP**: User enters OTP → If valid and not expired, account is activated (`isActive: true`)

## Error Handling

- **User not found**: HTTP 404
- **Account already active**: HTTP 400
- **Invalid OTP**: HTTP 400
- **Expired OTP**: HTTP 400 (OTP is automatically cleared)
- **No OTP found**: HTTP 400 (user needs to request new OTP)

## Security Features

- OTP expires after 1 minute
- Expired OTPs are automatically cleared from database
- Only users with inactive accounts can request/validate OTPs
- OTP is cleared after successful validation

## Testing

1. Register a new user
2. Call `/user/send-otp` with the user's email
3. Check your email for the OTP
4. Call `/user/validate-otp` with email and OTP within 1 minute
5. User account should now be activated
