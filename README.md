# 🗳️ E-Voting System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.1.1-blue.svg)

**A secure, modern web-based electronic voting system with email OTP verification**

[Features](#-features) • [Architecture](#-architecture) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-documentation) • [Security](#-security)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [User Flows](#-user-flows)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## 🌟 Overview

The E-Voting System is a comprehensive, secure electronic voting platform designed for educational institutions, organizations, or any entity requiring transparent and fair digital voting processes. It features modern UI/UX, secure authentication, and real-time result tracking.

### Key Highlights

- 🔐 **Secure Authentication**: JWT-based authentication with email OTP verification
- 🎨 **Modern UI/UX**: Beautiful, responsive design with smooth animations
- ⚡ **Fast & Efficient**: Built with React and Node.js for optimal performance
- 📊 **Real-time Results**: Live voting statistics and result display
- 🛡️ **Secure Voting**: One-vote-per-user enforcement and encrypted data
- 📱 **Mobile Responsive**: Works seamlessly on all devices
- 👥 **Multi-role System**: Separate flows for voters, admins, and super admins

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│   React Frontend │ ◄─────────────────► │  Express Backend │
│   (Port 5173)    │                     │   (Port 5000)    │
└────────┬─────────┘                     └────────┬─────────┘
         │                                        │
         │                                        ├─────────► MongoDB
         │                                        │           (Database)
         │                                        │
         │                                        └─────────► Nodemailer
         │                                                  (Email Service)
         │
         └─────────────────────────────────────────────────► localStorage
                                                           (Client Storage)
```

### Database Schema

#### User Model
```javascript
{
  name: String (required),
  rollNumber: String (required),
  email: String (required, unique, @nmamit.in domain),
  password: String (hashed with bcrypt),
  isVerified: Boolean (default: false),
  isAdmin: Boolean (default: false),
  hasVoted: Boolean (default: false),
  otp: String (temporary),
  otpExpires: Date (temporary)
}
```

#### Candidate Model
```javascript
{
  name: String (required),
  photo: String (required, URL),
  party: String (required),
  description: String (required),
  votes: Number (default: 0)
}
```

#### Election Model
```javascript
{
  title: String (required),
  description: String (required),
  startDate: Date (required),
  endDate: Date (required),
  status: String (enum: ['upcoming', 'active', 'completed', 'cancelled']),
  isActive: Boolean (default: false),
  candidates: [ObjectId] (ref: 'Candidate'),
  totalVotes: Number (default: 0),
  createdBy: ObjectId (ref: 'User'),
  settings: {
    allowMultipleVotes: Boolean,
    requireVerification: Boolean,
    showResultsBeforeEnd: Boolean,
    maxCandidates: Number
  }
}
```

## 🔄 User Flows

### 1. Voter Registration & Voting Flow

```mermaid
graph TD
    A[Landing Page] --> B[Register]
    B --> C[Email Validation @nmamit.in]
    C --> D[Account Created]
    D --> E[Login]
    E --> F[OTP Sent to Email]
    F --> G[Enter OTP]
    G --> H{OTP Valid?}
    H -->|Yes| I[JWT Token Issued]
    H -->|No| F
    I --> J[Voting Dashboard]
    J --> K[Select Candidate]
    K --> L[Confirm Vote]
    L --> M{Vote Cast?}
    M -->|Yes| N[Vote Recorded]
    M -->|No| O[Already Voted Error]
    N --> P[Results Page]
```

### 2. Admin Management Flow

```mermaid
graph TD
    A[Super Admin Setup] --> B[Create First Admin]
    B --> C[Admin Login]
    C --> D[Admin Dashboard]
    D --> E[Manage Candidates]
    D --> F[View Statistics]
    D --> G[Monitor Elections]
    D --> H[Security Dashboard]
    E --> I[Add/Edit/Delete Candidates]
    F --> J[Real-time Vote Counts]
    G --> K[Start/Stop Elections]
    H --> L[Audit Logs]
```

### 3. Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant E as Email Service

    U->>F: Enter credentials
    F->>B: POST /auth/login
    B->>DB: Validate user
    DB-->>B: User found
    B->>DB: Generate & store OTP
    B->>E: Send OTP email
    E-->>B: Email sent
    B-->>F: OTP sent response
    F-->>U: Check email for OTP
    
    U->>F: Enter OTP
    F->>B: POST /auth/verify-otp
    B->>DB: Validate OTP
    DB-->>B: OTP valid
    B->>B: Generate JWT token
    B-->>F: Token + user data
    F->>F: Store token in localStorage
    F-->>U: Redirect to dashboard
```

## ✨ Features

### 🔐 Authentication & Security
- ✅ **Email Domain Validation**: Only @nmamit.in emails allowed
- ✅ **OTP Verification**: 6-digit code sent via email (5-minute expiry)
- ✅ **JWT Token Management**: Secure session handling
- ✅ **Password Hashing**: Bcrypt with salt rounds
- ✅ **Protected Routes**: Role-based access control
- ✅ **CORS Protection**: Configured allowed origins
- ✅ **Rate Limiting**: Prevents brute force attacks

### 🗳️ Voting System
- ✅ **Candidate Management**: Add, edit, delete candidates
- ✅ **Secure Vote Casting**: One-vote-per-user enforcement
- ✅ **Real-time Vote Counting**: Live statistics
- ✅ **Anonymous Voting**: No vote-to-user mapping
- ✅ **Vote Confirmation**: Double confirmation before casting
- ✅ **Election Management**: Start/stop elections

### 👥 User Management
- ✅ **Multi-role System**: Voters, Admins, Super Admins
- ✅ **User Registration**: College email validation
- ✅ **Profile Management**: Update user information
- ✅ **Admin Creation**: Secure admin user setup
- ✅ **User Statistics**: Registration and voting analytics

### 📊 Admin Features
- ✅ **Dashboard Analytics**: Real-time statistics
- ✅ **Candidate Management**: Full CRUD operations
- ✅ **Election Control**: Start/stop voting periods
- ✅ **Security Monitoring**: Audit logs and security dashboard
- ✅ **User Management**: View and manage users
- ✅ **Result Management**: Export and analyze results

### 🎨 User Experience
- ✅ **Modern UI/UX**: Beautiful, responsive design
- ✅ **Smooth Animations**: Fade-in, slide, and hover effects
- ✅ **Toast Notifications**: Real-time feedback
- ✅ **Loading States**: Visual feedback for async operations
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Mobile Responsive**: Works on all devices
- ✅ **Accessibility**: High contrast, keyboard navigation

## 💻 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.1.1 | UI Framework |
| Vite | 7.1.14 | Build Tool |
| React Router | 7.9.4 | Routing |
| Axios | 1.12.2 | HTTP Client |
| Tailwind CSS | 4.1.15 | Styling |
| React Toastify | 11.0.5 | Notifications |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | ≥14.0.0 | Runtime |
| Express | 5.1.0 | Web Framework |
| MongoDB | Latest | Database |
| Mongoose | 8.19.2 | ODM |
| JWT | 9.0.2 | Authentication |
| Nodemailer | 7.0.10 | Email Service |
| Bcrypt | 3.0.2 | Password Hashing |
| Express-validator | Latest | Input Validation |

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or cloud) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager
- **Git** for version control

### Step 1: Clone the Repository

```bash
git clone https://github.com/NITHINKR06/E-Voting.git
cd E-Voting
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd e-voting-backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Configure the `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/e-voting
JWT_SECRET=your_super_secret_jwt_key_here_change_this
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
SUPER_ADMIN_SECRET=admin123456
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd ../e-voting-frontend

# Install dependencies
npm install
```

### Step 4: Start MongoDB

Make sure MongoDB is running:

```bash
# On Windows
net start MongoDB

# On macOS
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### Step 5: Run the Application

**Terminal 1 - Backend:**
```bash
cd e-voting-backend
npm start
```
Backend will run on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd e-voting-frontend
npm run dev
```
Frontend will run on http://localhost:5173

### Step 6: Create First Admin User

1. **Visit the Super Admin Setup Page**: Go to http://localhost:5173/setup
2. **Fill in the form** with your admin details:
   - Name: Your full name
   - Roll Number: Your roll number
   - Email: Your @nmamit.in email
   - Password: A strong password
   - Secret Key: `admin123456` (default from .env)
3. **Click "Create Super Admin"**
4. **Login** with your admin credentials at http://localhost:5173/admin-login

## ⚙️ Configuration

### Email Setup (Gmail)

1. Enable 2-Step Verification in your Google Account
2. Generate an App Password:
   - Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Enter "E-Voting" and click "Generate"
   - Copy the generated password
3. Add it to your `.env` file as `EMAIL_PASS`

### MongoDB Setup Options

**Local MongoDB:**
```env
MONGO_URI=mongodb://localhost:27017/e-voting
```

**MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/e-voting
```

## 📖 Usage

### For Voters

1. **Register**: Create an account with your college email (@nmamit.in) and roll number
2. **Login**: Use your credentials to login
3. **Verify OTP**: Enter the 6-digit code from your email (expires in 5 minutes)
4. **Cast Vote**: Select your preferred candidate and confirm
5. **View Results**: Check the live voting results

### For Administrators

1. **Admin Login**: Use admin credentials at `/admin-login`
2. **Dashboard**: View real-time voting statistics and manage elections
3. **Candidate Management**: Add, edit, or remove candidates
4. **Election Control**: Start or stop voting periods
5. **Security Monitoring**: Monitor system security and audit logs

### For Super Administrators

1. **Initial Setup**: Create the first admin user at `/setup`
2. **Admin Management**: Create additional admin users
3. **System Configuration**: Configure election settings and security parameters

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "rollNumber": "1NM20XX001",
  "email": "john@nmamit.in",
  "password": "securepassword"
}
```

#### Login (Get OTP)
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@nmamit.in",
  "password": "securepassword"
}
```

#### Verify OTP
```http
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "john@nmamit.in",
  "otp": "123456"
}

Response: {
  "token": "eyJhbGc...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@nmamit.in",
    "isAdmin": false,
    "hasVoted": false
  }
}
```

### Voting Endpoints

#### Get Candidates
```http
GET /candidates
Authorization: Bearer <token>
```

#### Cast Vote
```http
POST /candidates/vote
Authorization: Bearer <token>
Content-Type: application/json

{
  "candidateId": "65f4c8b9a2d3e4f5g6h7i8j9"
}
```

### Admin Endpoints

#### Get Dashboard Statistics
```http
GET /admin/dashboard
Authorization: Bearer <admin_token>
```

#### Get All Users
```http
GET /admin/users
Authorization: Bearer <admin_token>
```

#### Create Candidate
```http
POST /admin/candidates
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Candidate Name",
  "party": "Party Name",
  "description": "Candidate description",
  "photo": "https://example.com/photo.jpg"
}
```

### Super Admin Endpoints

#### Create Super Admin
```http
POST /super-admin/create
Content-Type: application/json

{
  "name": "Admin Name",
  "rollNumber": "1NM20XX001",
  "email": "admin@nmamit.in",
  "password": "securepassword",
  "secretKey": "admin123456"
}
```

## 🔒 Security

### Implemented Security Measures

- ✅ **Password Hashing**: Bcrypt with salt rounds
- ✅ **JWT Tokens**: Secure token-based authentication
- ✅ **CORS Protection**: Configured allowed origins
- ✅ **OTP Verification**: Email-based two-factor authentication
- ✅ **One-Vote Enforcement**: Database-level vote tracking
- ✅ **Input Validation**: Express-validator for data validation
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Rate Limiting**: Prevents brute force attacks
- ✅ **Email Domain Validation**: Restricted to @nmamit.in
- ✅ **Admin Role Verification**: Double-check admin status
- ✅ **Secure Headers**: Security middleware implementation

### Security Best Practices

- Never commit `.env` files
- Use strong JWT secrets (minimum 32 characters)
- Regularly update dependencies
- Enable HTTPS in production
- Implement rate limiting
- Use environment variables for sensitive data
- Regular security audits
- Monitor failed login attempts

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Server won't start
```bash
# Check if MongoDB is running
mongosh

# Check if port 5000 is available
netstat -ano | findstr :5000
```

**Problem**: MongoDB connection error
- Verify `MONGO_URI` in `.env`
- Check if MongoDB service is running
- Ensure MongoDB is accessible

### Frontend Issues

**Problem**: CORS errors
- Ensure backend is running
- Check CORS configuration in `server.js`
- Verify API URL in `api.jsx`

**Problem**: OTP not receiving
- Check email credentials in `.env`
- Verify app password is correct
- Check spam/junk folder
- Ensure 2FA is enabled on Gmail

### Common Solutions

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for port conflicts
lsof -i :5000
lsof -i :5173
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow ESLint configuration
- Use meaningful commit messages
- Add comments for complex logic
- Maintain consistent formatting
- Write tests for new features

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **NITHINKR06** - *Initial work* - [GitHub](https://github.com/NITHINKR06)

## 🙏 Acknowledgments

- React Team for the amazing framework
- Express.js for the robust backend
- MongoDB for the database solution
- All open-source contributors

---

<div align="center">

**Made with ❤️ by [NITHINKR06](https://github.com/NITHINKR06)**

⭐ Star this repo if you found it helpful!

</div>