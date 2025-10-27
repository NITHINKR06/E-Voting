# E-Voting Backend

This is the backend server for the E-Voting application.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env` (if exists)
   - Update the following variables in `.env`:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secret key for JWT tokens
     - `EMAIL_USER`: Your email address for sending OTPs
     - `EMAIL_PASS`: Your email app password

3. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Default: `mongodb://localhost:27017`

4. **Run the Server**
   ```bash
   npm start
   ```
   or
   ```bash
   npm run dev
   ```

5. **Verify Server is Running**
   - Check `http://localhost:5000/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive OTP
- `POST /api/auth/verify-otp` - Verify OTP and get JWT token
- `GET /api/candidates` - Get list of candidates
- `POST /api/candidates/vote` - Cast a vote
- `GET /api/admin/stats` - Get voting statistics (admin only)

## Notes

- CORS is configured to allow requests from `http://localhost:5173` (Vite default port)
- Server runs on port 5000 by default
- JWT tokens expire after 1 hour
