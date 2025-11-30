import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import robotRoutes from './src/routes/robotRoutes.js';
import partsRoutes from './src/routes/partsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', robotRoutes);
app.use('/api', partsRoutes);

// Serve landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler for API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({
      success: false,
      error: 'API endpoint not found'
    });
  } else {
    next();
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🤖 RoboBuilder server running on http://localhost:${PORT}`);
  console.log(`   API available at http://localhost:${PORT}/api`);
});