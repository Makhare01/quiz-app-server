import { Request, Response } from "express";
import { AuthUser, Question, Quiz } from "../models";
import { RequestError, handleAuthRequestErrors } from "../utils";
import { jwtDecode } from "jwt-decode";
import { getPublicQuiz } from "../utils/quizzes";

export const createQuizController = async (req: Request, res: Response) => {
  const { name, description, visibility, category } = req.body;
  const userId = res.locals.userId as string;

  try {
    const question = await Question.create({
      questions: [],
      quizName: name,
    });

    try {
      const quiz = await Quiz.create({
        name,
        description,
        visibility,
        category,
        questionsId: question._id.toString(),
        status: "DRAFT",
        users: [],
        questionsCount: 0,
        userId,
      });
      res.status(201).json(quiz);
    } catch (error) {
      // If there is an error during quiz creation we are deleting already created questions document
      await Question.findByIdAndDelete(question._id);

      const errors = handleAuthRequestErrors(error as RequestError);
      res.status(400).json({
        name: "Bad Request",
        message: "Quiz creation error",
        errors,
      });
    }
  } catch (error: any) {
    const errors = handleAuthRequestErrors(error as RequestError);
    res.status(400).json({
      name: "Bad Request",
      message: "Questions creation error",
      errors,
    });
  }
};

export const getQuizDetailsController = async (req: Request, res: Response) => {
  const { quizId } = req.params;

  const userId = res.locals.userId as string;

  try {
    const quiz = await Quiz.findById(quizId);

    if (quiz?.userId === userId) {
      return res.status(200).json(quiz);
    }

    res.status(403).json({
      name: "Forbidden",
      message: "You don't have access to this quiz",
    });
  } catch (error: any) {
    res.status(400).json({
      name: "Bad Request",
      message: error.message,
      error: error.message,
    });
  }
};

export const getPublicQuizzesController = async (
  req: Request,
  res: Response
) => {
  const { category, search } = req.query;

  try {
    const quizzes = await Quiz.find({
      visibility: {
        $ne: "PRIVATE",
      },
      status: "READY",
      ...(category && {
        category,
      }),
      ...(search && {
        name: new RegExp(search as string, "i"),
      }),
    });

    const publicQuizzes = quizzes.map((quiz) => getPublicQuiz(quiz));

    res.status(200).json(publicQuizzes);
  } catch (error: any) {
    res.status(400).json({
      name: "Bad Request",
      message: error.message,
    });
  }
};

export const getPublicQuizDetailsController = async (
  req: Request,
  res: Response
) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId);

    if (quiz?.status === "READY") {
      const publicQuizzes = getPublicQuiz(quiz);

      return res.status(200).json(publicQuizzes);
    }

    res.status(403).json({
      name: "Forbidden",
      message: "You don't have access to this resource",
    });
  } catch (error: any) {
    res.status(400).json({
      name: "Bad Request",
      message: error.message,
    });
  }
};

export const getMyQuizzesController = async (_req: Request, res: Response) => {
  const userId = res.locals.userId as string;

  try {
    const quizzes = await Quiz.find({ userId });

    res.status(200).json(quizzes);
  } catch (error: any) {
    res.status(400).json({
      name: "Bad Request",
      message: error.message,
    });
  }
};

export const editQuizController = async (req: Request, res: Response) => {
  const { quizId } = req.params;
  const { name, description, visibility, category } = req.body;

  try {
    const quiz = await Quiz.findByIdAndUpdate(
      quizId,
      {
        name,
        description,
        visibility,
        category,
      },
      {
        new: true,
      }
    );

    if (quiz) {
      await Question.findByIdAndUpdate(quiz.questionsId, {
        quizName: quiz.name,
      });
    }

    res.status(201).json(quiz);
  } catch (error: any) {
    res.status(400).json({
      name: "Bad Request",
      message: "Failed to update quiz",
      error: error.message,
    });
  }
};

export const deleteQuizController = async (req: Request, res: Response) => {
  const { quizId } = req.params;

  try {
    await Quiz.findByIdAndDelete(quizId);

    res.status(200).json({
      name: "No Content",
      message: "Resource deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      name: "Bad Request",
      message: "Failed to delete quiz",
      error: error.message,
    });
  }
};

export const changeQuizStatusController = async (
  req: Request,
  res: Response
) => {
  const { quizId } = req.params;
  const { status } = req.body;

  try {
    const quiz = await Quiz.findByIdAndUpdate(
      quizId,
      {
        status,
      },
      {
        new: true,
      }
    );

    res.status(200).json(quiz);
  } catch (error: any) {
    res.status(400).json({
      name: "Bad Request",
      message: "Failed to update quiz status",
      error: error.message,
    });
  }
};
