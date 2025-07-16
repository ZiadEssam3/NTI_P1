const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/connection/db.connection');
dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB();


app.listen(PORT, () => {
    console.log(`Server running at PORT: http://localhost:${PORT}`);
});