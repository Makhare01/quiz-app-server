import { Router } from "express";
import { authMiddleware } from "../middleware";
import {
  changeQuizStatusController,
  createQuizController,
  deleteQuizController,
  editQuizController,
  getMyQuizzesController,
  getPublicQuizDetailsController,
  getPublicQuizzesController,
  getQuizDetailsController,
} from "../controller";

export const quizRoutes = Router();

quizRoutes.post("/api/quiz/create", authMiddleware, createQuizController);
quizRoutes.get("/api/quiz/:quizId", authMiddleware, getQuizDetailsController);
quizRoutes.get("/api/quizzes", authMiddleware, getPublicQuizzesController);
quizRoutes.get(
  "/api/quizzes/:quizId",
  authMiddleware,
  getPublicQuizDetailsController
);

quizRoutes.get("/api/my-quizzes", authMiddleware, getMyQuizzesController);
quizRoutes.patch(
  "/api/my-quizzes/:quizId/edit",
  authMiddleware,
  editQuizController
);
quizRoutes.delete(
  "/api/my-quizzes/:quizId/delete",
  authMiddleware,
  deleteQuizController
);
quizRoutes.put(
  "/api/my-quizzes/:quizId/change-status",
  authMiddleware,
  changeQuizStatusController
);
