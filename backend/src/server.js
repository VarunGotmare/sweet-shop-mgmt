require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {prisma} = require('./lib/prisma');

const authRoutes = require('./routes/auth.routes');
const sweetsRoutes = require('./routes/sweets.routes');

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, curl)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:5173",
        "https://sweet-mgmt-frontend-production.up.railway.app",
      ];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get('/health', async (req, res) => {
  return res.status(200).json({ ok: true });
});

//my api routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);



module.exports = app;

//only running if not testing
if (require.main === module) {
  const PORT = process.env.PORT || 4000; //me using 3000 for frotnend
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
