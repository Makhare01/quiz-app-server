import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import {
  authRoutes,
  userRoutes,
  quizRoutes,
  questionRoutes,
  answerRoutes,
} from "./routes";
import { connectDB } from "./db";

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(cookieParser());
app.disable("etag");

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch(() => {
    console.log("Error");
    console.dir();
  });

app.use(authRoutes);
app.use(userRoutes);
app.use(quizRoutes);
app.use(questionRoutes);
app.use(answerRoutes);

export default app;
