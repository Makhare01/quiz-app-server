import { Router } from "express";
import { authMiddleware } from "../middleware";
import {
  getQuestionControllerController,
  getUserAnswerController,
  saveAnswerController,
  startQuizController,
} from "../controller";

export const answerRoutes = Router();

answerRoutes.post("/api/answer/:questionsId/start", startQuizController);

answerRoutes.get("/api/answer/details", getUserAnswerController);

answerRoutes.get(
  "/api/answer/:questionsId/next",
  getQuestionControllerController
);

answerRoutes.post("/api/answer/:answerId/save", saveAnswerController);
