import { Request, Response } from "express";
import { Answer, Question, Quiz, User } from "../models";

export const startQuizController = async (req: Request, res: Response) => {
  const { questionsId } = req.params;
  const { quizId, userId, email, username } = req.body;

  try {
    const answer = await Answer.find({ userId, questionsId });

    if (answer.length > 0) {
      return res.status(200).json({
        answerId: answer[0]._id,
      });
    }

    const newAnswer = await Answer.create({
      userId,
      quizId,
      email,
      username,
      questionsId,
      answers: [],
    });

    const quiz = await Quiz.findById(quizId);

    if (quiz) {
      await Quiz.findByIdAndUpdate(quizId, {
        $push: {
          users: {
            userId,
            email,
            username,
            answerId: newAnswer._id,
            isFinished: false,
          },
        },
      });
    }

    res.status(200).json({
      answerId: newAnswer._id,
    });
  } catch (error: any) {
    res.status(400).json({
      name: "Bad Request",
      message: "Failed to update answers",
      error: error.message,
    });
  }
};

export const getUserAnswerController = async (req: Request, res: Response) => {
  const { answerId } = req.params;

  try {
    const answer = await Answer.findById(answerId);

    res.status(200).json(answer);
  } catch (error: any) {
    res.status(400).json({
      name: "Bad Request",
      message: "Failed to get user answers",
      error: error.message,
    });
  }
};

export const getQuestionControllerController = async (
  req: Request,
  res: Response
) => {
  const { questionsId } = req.params;
  const { lastQuestionId } = req.query;

  try {
    const question = await Question.findById(questionsId);

    const currentQuestion = question?.questions.find(
      (question) => question._id?.toString() === lastQuestionId
    );

    const nextQuestionOrder = currentQuestion ? currentQuestion.order + 1 : 0;

    const nextQuestion = question?.questions.find(
      (question) => question.order === nextQuestionOrder
    );

    if (nextQuestion) {
      return res.status(200).send({
        questionId: nextQuestion._id,
        question: nextQuestion.question,
        type: nextQuestion.type,
        isRequired: nextQuestion.isRequired,
        order: nextQuestion.order,
        options: nextQuestion.answers.map((answer) => answer.answer),
        dropdownOptions: nextQuestion.dropdownAnswers?.options,
      });
    }

    res.status(400).json({
      name: "Bad Request",
      message: "Failed to get next question",
    });
  } catch (error: any) {
    res.status(400).json({
      name: "Bad Request",
      message: "Failed to get question, please try again",
      error: error.message,
    });
  }
};

export const saveAnswerController = async (req: Request, res: Response) => {
  const { answerId } = req.params;
  const { answers, questionId, quizId, answerType, order, isLast, userId } =
    req.body;

  try {
    const answer = await Answer.findById(answerId);

    const myAnswers = answer?.answers;

    if (answerType !== "TEXT" && answerType !== "TEXT_MULTILINE") {
      const question = await Question.findById(answer?.questionsId);

      const currentQuestion = question?.questions.find(
        (item) => item._id === questionId
      );

      const correctAnswers = currentQuestion?.answers
        .filter((item) => item.isCorrect === true)
        .map((corrects) => corrects.answer);

      const isCorrect: boolean = answers.every((item: string) =>
        correctAnswers?.includes(item)
      );

      myAnswers?.push({
        order,
        questionId,
        questionAnswer: {
          answer: answers,
          isCorrect: isCorrect === true,
        },
      });
    } else {
      myAnswers?.push({
        order,
        questionId,
        questionAnswer: {
          answer: answers,
        },
      });
    }

    const newAnswer = await Answer.findByIdAndUpdate(answerId, {
      answers: myAnswers,
    });

    if (isLast) {
      await Quiz.updateOne(
        { _id: quizId, "users.email": newAnswer?.email },
        { $set: { "users.$.isFinished": true } }
      );
    }

    res.status(201).json(newAnswer);
  } catch (error: any) {
    res.status(400).json({
      name: "Bad Request",
      message: "Failed to get question, please try again",
      error: error.message,
    });
  }
};
