require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/database');

const startServer = async () => {
    await connectDB();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server berjalan pada port ${PORT}`);
        console.log('Aplikasi berhasil terhubung ke MongoDB');
    });
};

startServer();