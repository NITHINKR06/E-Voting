require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const candidateRoutes = require('./routes/candidates');
const adminRoutes = require('./routes/admin');
const electionRoutes = require('./routes/elections');
const auditRoutes = require('./routes/audit');
const superAdminRoutes = require('./routes/superAdmin');
const adminAuthRoutes = require('./routes/adminAuth');

const app = express();
connectDB();

app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true 
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/admin-auth', adminAuthRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
