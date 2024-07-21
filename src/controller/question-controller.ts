import { Request, Response } from "express";
import { Answer, Question, Quiz } from "../models";
import { handleAuthRequestErrors, RequestError } from "../utils";

export const updateQuestionsController = async (
  req: Request,
  res: Response
) => {
  const { questionsId, quizId } = req.params;
  const { questions } = req.body;

  try {
    const question = await Question.findByIdAndUpdate(
      questionsId,
      {
        questions,
      },
      { new: true }
    );

    await Quiz.findByIdAndUpdate(quizId, {
      questionsCount: questions.length,
    });

    await Answer.updateMany({ quizId }, { questionsCount: questions.length });

    res.status(201).json(question);
  } catch (error: any) {
    const errors = handleAuthRequestErrors(error as RequestError);
    res.status(400).json({
      name: "Bad Request",
      message: "Questions creation error",
      errors,
    });
  }
};

export const getQuizQuestionController = async (
  req: Request,
  res: Response
) => {
  const { questionsId } = req.params;

  try {
    const question = await Question.findById(questionsId);

    res.status(200).json(question);
  } catch (error: any) {
    res.status(400).json({
      name: "Bad Request",
      message: "Failed to get question",
      error: error.message,
    });
  }
};
