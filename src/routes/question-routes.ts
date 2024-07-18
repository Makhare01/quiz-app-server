import { Router } from "express";
import { authMiddleware } from "../middleware";
import {
  getQuizQuestionController,
  updateQuestionsController,
} from "../controller";

export const questionRoutes = Router();

questionRoutes.patch(
  "/api/question/:quizId/:questionsId/update",
  authMiddleware,
  updateQuestionsController
);

questionRoutes.get(
  "/api/question/:questionsId",
  authMiddleware,
  getQuizQuestionController
);
