# E-Voting Frontend

This is the frontend React application for the E-Voting system.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API URL** (if needed)
   - Edit `src/services/api.jsx`
   - Update `API_BASE_URL` if your backend runs on a different port or domain
   - Default: `http://localhost:5000/api`

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open `http://localhost:5173` in your browser
   - The app should automatically connect to the backend

## Project Structure

- `src/pages/` - Page components (Login, Register, Voting, etc.)
- `src/components/` - Reusable components (Navbar, ProtectedRoute)
- `src/services/` - API service layer
- `src/utils/` - Utility functions (authentication helpers)

## Features

- User Registration
- Email-based OTP Verification
- Secure Voting
- Real-time Results Display
- Admin Dashboard

## Notes

- Make sure the backend is running before starting the frontend
- The API automatically handles JWT authentication
- Login sessions persist in browser localStorage
