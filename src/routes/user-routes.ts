import { Router } from "express";
import { authMiddleware } from "../middleware";
import {
  userCredentialsController,
  userUpdatePasswordController,
} from "../controller";

export const userRoutes = Router();

userRoutes.patch(
  "/api/user/credentials",
  authMiddleware,
  userCredentialsController
);

userRoutes.patch(
  "/api/user/change-password",
  authMiddleware,
  userUpdatePasswordController
);
