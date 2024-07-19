import { Router } from "express";
import { authMiddleware } from "../middleware";
import {
  getQuestionControllerController,
  getUserAnswerController,
  saveAnswerController,
  startQuizController,
} from "../controller";

export const answerRoutes = Router();

answerRoutes.post(
  "/api/answer/:questionsId/start",
  authMiddleware,
  startQuizController
);

answerRoutes.get(
  "/api/answer/details",
  authMiddleware,
  getUserAnswerController
);

answerRoutes.get(
  "/api/answer/:questionsId/next",
  authMiddleware,
  getQuestionControllerController
);

answerRoutes.post(
  "/api/answer/:answerId/save",
  authMiddleware,
  saveAnswerController
);
