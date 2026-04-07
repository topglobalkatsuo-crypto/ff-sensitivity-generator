const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const sensitivityRoutes = require('./routes/sensitivity');

app.use('/api/auth', authRoutes);
app.use('/api/sensitivity', sensitivityRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
