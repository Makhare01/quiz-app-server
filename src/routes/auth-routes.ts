import { Request, Response, Router } from "express";
import {
  logoutController,
  refreshTokenController,
  signInController,
  signUpController,
} from "../controller";
import { authMiddleware } from "../middleware";

export const authRoutes = Router();

authRoutes.post("/api/auth/sign-in", signInController);
authRoutes.post("/api/auth/sign-up", signUpController);
authRoutes.post("/api/auth/refresh", refreshTokenController);
authRoutes.delete("/api/auth/logout", authMiddleware, logoutController);

// TEST ROUTE
authRoutes.get("/api/get-info", (req: Request, res: Response) => {
  res.status(200).send("API WORKS!!");
});
