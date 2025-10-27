# ��️ E-Voting System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.1.1-blue.svg)

**A secure, modern web-based electronic voting system with email OTP verification**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Architecture](#-architecture)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

The E-Voting System is a comprehensive, secure electronic voting platform designed for educational institutions, organizations, or any entity requiring transparent and fair digital voting processes. It features modern UI/UX, secure authentication, and real-time result tracking.

### Key Highlights

- 🔐 **Secure Authentication**: JWT-based authentication with email OTP verification
- 🎨 **Modern UI/UX**: Beautiful, responsive design with smooth animations
- ⚡ **Fast & Efficient**: Built with React and Node.js for optimal performance
- 📊 **Real-time Results**: Live voting statistics and result display
- 🛡️ **Secure Voting**: One-vote-per-user enforcement and encrypted data
- 📱 **Mobile Responsive**: Works seamlessly on all devices

## ✨ Features

### Authentication & Security
- ✅ User registration with college email validation
- ✅ Email-based OTP verification (6-digit code)
- ✅ JWT token-based session management
- ✅ Password hashing with bcrypt
- ✅ Protected routes and middleware
- ✅ CORS protection

### Voting System
- ✅ Candidate management and display
- ✅ Secure vote casting with confirmation
- ✅ One-vote-per-user enforcement
- ✅ Real-time vote counting
- ✅ Anonymous voting

### User Experience
- ✅ Beautiful, modern interface
- ✅ Smooth animations and transitions
- ✅ Toast notifications for all actions
- ✅ Loading states and error handling
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Intuitive navigation

### Admin Features
- ✅ View voting statistics
- ✅ Real-time result monitoring
- ✅ Candidate management

## 💻 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.1 | UI Framework |
| Vite | 7.1.14 | Build Tool |
| React Router | 7.9.4 | Routing |
| Axios | 1.12.2 | HTTP Client |
| Tailwind CSS | 4.1.15 | Styling |
| React Toastify | 11.0.5 | Notifications |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | ≥14.0.0 | Runtime |
| Express | 5.1.0 | Web Framework |
| MongoDB | Latest | Database |
| Mongoose | 8.19.2 | ODM |
| JWT | 9.0.2 | Authentication |
| Nodemailer | 7.0.10 | Email Service |
| Bcrypt | 3.0.2 | Password Hashing |

## 📸 Screenshots

> **Note**: Add your screenshots here

- Landing Page
- Login/Registration Forms
- OTP Verification
- Voting Dashboard
- Results Page

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

### Verification

- **Backend Health Check**: Visit http://localhost:5000/api/health
- **Frontend**: Visit http://localhost:5173

### Step 6: Create First Admin User

1. **Visit the Super Admin Setup Page**: Go to http://localhost:5173/setup
2. **Fill in the form** with your admin details:
   - Name: Your full name
   - Roll Number: Your roll number
   - Email: Your @nmamit.in email
   - Password: A strong password
   - Secret Key: `admin123456` (default from .env)
3. **Click "Create Super Admin"**
4. **Login** with your admin credentials at http://localhost:5173/login

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

### For Administrators

1. **Register/Login**: Create an account with your @nmamit.in email
2. **Verify Email**: Enter the OTP sent to your email
3. **Access Dashboard**: View voting dashboard
4. **Monitor Results**: Check real-time voting statistics

### For Voters

1. **Register**: Create an account with your college email and USN
2. **Login**: Use your credentials to login
3. **Verify OTP**: Enter the 6-digit code from your email
4. **Cast Vote**: Select your preferred candidate and confirm
5. **View Results**: Check the live voting results

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
  "token": "eyJhbGc..."
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

#### Get Statistics
```http
GET /admin/stats
Authorization: Bearer <admin_token>
```

## 🏗️ Architecture

```
┌─────────────────┐
│   React Frontend │
│   (Port 5173)    │
└────────┬─────────┘
         │ HTTP/REST
         │
┌────────▼─────────┐
│  Express Backend │
│   (Port 5000)    │
└────────┬─────────┘
         │
         ├─────────► MongoDB
         │           (Database)
         │
         └─────────► Nodemailer
                     (Email Service)
```

### Project Structure

```
E-Voting/
├── e-voting-backend/
│   ├── config/
│   │   ├── database.js      # MongoDB connection
│   │   └── email.js         # Email configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── candidateController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js          # JWT verification
│   │   └── admin.js         # Admin verification
│   ├── models/
│   │   ├── User.js
│   │   └── Candidate.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── candidates.js
│   │   └── admin.js
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── server.js            # Entry point
│
└── e-voting-frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── OtpVerificationPage.jsx
    │   │   ├── VotingDashboard.jsx
    │   │   └── ResultPage.jsx
    │   ├── services/
    │   │   └── api.jsx       # API service
    │   ├── utils/
    │   │   └── auth.jsx      # Auth utilities
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
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

### Best Practices

- Never commit `.env` files
- Use strong JWT secrets
- Regularly update dependencies
- Enable HTTPS in production
- Implement rate limiting
- Use environment variables for sensitive data

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

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [NITHINKR06](https://github.com/NITHINKR06)

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