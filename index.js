import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnection from "./database/dbConnection.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [process.env.CLIENT_URI_PRODUCTION, process.env.CLIENT_URI_LIVE], // Allow only this origin
    methods: "GET, POST, PUT, DELETE", // Allow these methods
    allowedHeaders: "Content-Type, Authorization", // Allow these headers
    credentials: true, // Allow credentials
  })
);

// ----------------------------------------Routes-------------------------------------------------------
import { errorMiddleware } from './middleware/error.js';
import userRoute from './routes/userRoute.js';
import candidateRoute from './routes/candidateRoute.js';
import createVoteRoute from './routes/voteRoute.js';
import refreshTokenRoute from './routes/refreshTokenRoute.js';
import authenticateRoute from './routes/authenticateRoute.js';
import stateRoute from './routes/statesRoute.js';
import voterRoute from './routes/voterRoute.js';

app.use('/authenticate', authenticateRoute);
app.use('/api/v1', refreshTokenRoute);
app.use('/api/v1', userRoute);
app.use('/api/v1/candidate', candidateRoute);
app.use('/api/v1', createVoteRoute);
app.use('/api/v1', stateRoute);
app.use('/api/v1', voterRoute);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await dbConnection();
  console.log(`Server Listning at http://localhost:${PORT}`);
});
