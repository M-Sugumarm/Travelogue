const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travelogue';

        await mongoose.connect(mongoURI);

        console.log('✅ MongoDB Connected Successfully');
        console.log(`📍 Database: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        console.error('⚠️ Server will continue running without Database');
        console.log('\n💡 Make sure MongoDB is running locally or provide MONGODB_URI in .env');
        console.log('   For local MongoDB: mongod --dbpath <your-data-path>');
        console.log('   For Atlas: MONGODB_URI=mongodb+srv://...');
        // process.exit(1);
    }
};

module.exports = connectDB;
