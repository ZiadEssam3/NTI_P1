const mongoose = require('mongoose');
/**
 * @brief Connects to MongoDB using the URI from environment variables.
 * @async
 * @function connectDB
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database Connected Sucessfully!!`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;