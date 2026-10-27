
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./config/db");
const leaveRoutes = require("./routes/leaveRoutes");

const app = express();

// Middleware
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api", leaveRoutes);

// Start the server
const PORT = process.env.PORT || 5050;

async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();
