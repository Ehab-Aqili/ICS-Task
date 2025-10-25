# ICS Task Management API

A robust NestJS-based RESTful API for task management with user authentication, JWT authorization, and email verification using OTP (One-Time Password).

## 🚀 Features

- **User Management**: Registration, login, and profile management
- **Email Verification**: OTP-based account activation via nodemailer
- **JWT Authentication**: Secure token-based authentication
- **Task Management**: CRUD operations for tasks with AI-powered advice
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Database Integration**: PostgreSQL with TypeORM
- **Input Validation**: Comprehensive request validation using class-validator
- **Error Handling**: Standardized error responses with custom interceptors

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens) with Passport
- **Email Service**: Nodemailer
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v20.11 or higher)
- [PostgreSQL](https://www.postgresql.org/) database
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ehab-Aqili/ICS-Task.git
   cd ICS-Task
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory and configure the following variables:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_NAME=ics_task_db
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   
   # Email Configuration (for OTP)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # Application
   PORT=3000
   ```

4. **Database Setup**
   
   Make sure PostgreSQL is running and create the database:
   ```sql
   CREATE DATABASE ics_task_db;
   ```

## 🚦 Running the Application

### Development Mode
```bash
# Start the application in development mode with hot-reload
npm run start:dev
```

### Production Mode
```bash
# Build the application
npm run build

# Start the production server
npm run start:prod
```

### Debug Mode
```bash
# Start with debugging enabled
npm run start:debug
```

## 📚 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build the application for production |
| `npm run format` | Format code using Prettier |
| `npm run start` | Start the application |
| `npm run start:dev` | Start in development mode with watch |
| `npm run start:debug` | Start in debug mode with watch |
| `npm run start:prod` | Start the production build |
| `npm run lint` | Run ESLint and fix issues |

## 📖 API Documentation

### Local Development
Once the application is running locally, you can access the interactive API documentation at:

- **Swagger UI**: `http://localhost:3000/api/docs`

### Live Production
You can also test the API using the live production deployment:

- **Production API**: [https://ics-task.onrender.com](https://ics-task.onrender.com)
- **Production Swagger UI**: [https://ics-task.onrender.com/api/docs](https://ics-task.onrender.com/api/docs)

The API documentation includes:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Interactive testing interface

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication. To access protected routes:

1. Register a new user account
2. Verify your email using the OTP sent to your email
3. Login to receive a JWT token
4. Include the token in the Authorization header: `Bearer <your-token>`

## 📧 Email Verification (OTP)

The application includes an OTP-based email verification system:

- Users must verify their email before account activation
- OTP is valid for 1 minute
- Uses nodemailer for email delivery
- See [OTP_DOCUMENTATION.md](./OTP_DOCUMENTATION.md) for detailed information

## 🗂️ Project Structure

```
src/
├── auth/                 # Authentication module (JWT strategy, middleware)
├── common/              # Shared utilities and interceptors
│   └── interceptors/    # Response interceptors
├── task/                # Task management module
│   ├── dto/            # Data Transfer Objects
│   └── entities/       # TypeORM entities
├── user/               # User management module
│   ├── dto/           # Data Transfer Objects
│   ├── entities/      # TypeORM entities
│   ├── services/      # Email service
│   └── utils/         # Password hashing utilities
├── app.module.ts       # Root application module
└── main.ts            # Application entry point
```

## 🔧 Development

### Code Style
The project uses ESLint and Prettier for code formatting:

```bash
# Format code
npm run format

# Lint and fix issues
npm run lint
```

### Database Migrations
The application currently uses TypeORM's `synchronize: true` for development. For production, consider using proper migrations.

## 📦 Dependencies

### Main Dependencies
- `@nestjs/core` - NestJS framework core
- `@nestjs/typeorm` - TypeORM integration
- `@nestjs/jwt` - JWT authentication
- `@nestjs/swagger` - API documentation
- `pg` - PostgreSQL driver
- `bcrypt` - Password hashing
- `nodemailer` - Email service
- `class-validator` - Input validation

### Development Dependencies
- `eslint` - Code linting
- `prettier` - Code formatting
- `typescript` - TypeScript compiler

## 🌐 Deployment

### Live Production
The application is deployed and accessible at:
- **Production URL**: [https://ics-task.onrender.com](https://ics-task.onrender.com)
- **API Documentation**: [https://ics-task.onrender.com/api/docs](https://ics-task.onrender.com/api/docs)

### Deployment Platform
The application is deployed on **Render.com** with the following features:
- Automatic deployments from the `main` branch
- Environment variables configured for production
- Self-ping functionality to prevent cold starts (pings every 14 minutes)
- PostgreSQL database integration

### Deployment Configuration
The application includes automatic self-ping functionality that sends HTTP requests every 14 minutes to keep the service active and prevent cold starts on free-tier deployments.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License.

## 👥 Author

**Ehab Aqili**

## 🐛 Issues

If you encounter any issues, please report them on the [GitHub Issues](https://github.com/Ehab-Aqili/ICS-Task/issues) page.
