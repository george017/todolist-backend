const mongoose = require('mongoose');
const mysql = require("mysql2/promise");



const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    }
};


const connectMySQL = async () => {
    try {
        const pool = mysql.createPool({
            host: "localhost",
            port: 3306,
            user: "app_user",
            password: "app_password",
            database: "app_db",
        });
        console.log('MySQL connected successfully');
        return pool;
    } catch (err) {
        console.error('MySQL connection error:', err);
        process.exit(1);
    }
};

module.exports = { connectDB, connectMySQL };   