
const mongoose = require('mongoose');
const uri = "mongodb+srv://sugus7215_db_user:KtEEsDgYPEpM7We3@cluster0.e33zwms.mongodb.net/travelogue?retryWrites=true&w=majority";

async function testConnection() {
    try {
        console.log("Attempting to connect...");
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log("Connected successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Connection failed:", err.message);
        process.exit(1);
    }
}

testConnection();
