const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');
const deezerRoutes = require('./routes/deezer.routes');

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173", 
        "https://sound-wave-frontend.vercel.app" // Update this once your frontend is deployed
    ],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Root route (Fixes the "Cannot GET /" message)
app.get("/", (req, res) => {
    res.json({ status: "Online", project: "SoundWave API" });
});

// Option B: No /api prefix
app.use('/auth', authRoutes);
app.use('/music', musicRoutes);
app.use('/album', musicRoutes); 
app.use('/deezer', deezerRoutes);

module.exports = app;