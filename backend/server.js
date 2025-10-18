import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import commonRoutes from './routes/common.routes.js';
import mdRoutes from './routes/md.routes.js';

const server = express();

dotenv.config();

//server.use(express.json());
server.use(cookieParser());
server.use(express.json({ limit: '100mb' }));

// If you also use urlencoded middleware, update it too
server.use(express.urlencoded({ limit: '100mb', extended: true }));

server.use(cors({
    origin: 'http://127.0.0.1:5500', //Keep Citrix domain here
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

const PORT = process.env.PORT || 3000;
server.get("/", (req, res) => { res.send("working") });

// API Routes
server.use("/api/auth", authRoutes);
server.use("/api/employee", employeeRoutes);
server.use("/api/common", commonRoutes);
server.use("/api/md", mdRoutes);

server.listen(PORT, () => {
    console.log('Citrix is Live!', PORT);
});