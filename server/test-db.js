require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB Connection...');
console.log('URI:', process.env.MONGODB_URI?.split('@')[1]); // Log only the host part for safety

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:');
        console.error(error.message);
        if (error.cause) console.error('Cause:', error.cause);
        process.exit(1);
    }
}

connect();
