import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { authRoutes } from "./routes";
import { connectDB } from "./db";
import { userRoutes } from "./routes/user-routes";

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(cookieParser());

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

export default app;
