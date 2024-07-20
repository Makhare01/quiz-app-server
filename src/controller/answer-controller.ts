import { Request, Response } from "express";
import { Answer, Question, Quiz, User } from "../models";
import { ObjectId } from "mongodb";

export const startQuizController = async (req: Request, res: Response) => {
  const { questionsId } = req.params;
  const { quizId, userId, email, username } = req.body;

  try {
    const answer = await Answer.find({ "user.email": email, questionsId });

    if (answer.length > 0) {
      return res.status(200).json({
        answerId: answer[0]._id,
      });
    }

    const newAnswer = await Answer.create({
      quizId,
      questionsId,
      user: {
        userId,
        email,
        username,
      },
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
  const { answerId, email, questionsId } = req.query;

  try {
    let answer = null;
    if (answerId) {
      answer = await Answer.findOne({
        _id: new ObjectId(answerId as string),
        "user.email": email,
      });
    } else {
      answer = await Answer.findOne({
        "user.email": email,
        questionsId,
      });
    }

    if (!answer) {
      return res.status(400).json({
        name: "Bad Request",
        message: "Failed to find user question",
      });
    }

    const quiz = await Quiz.findById(answer.quizId);

    const publicAnswer = {
      ...answer.toJSON(),
      questionsCount: quiz?.questionsCount,
    };

    res.status(200).json(publicAnswer);
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
  const { lastQuestionId, email } = req.query;

  try {
    const answer = await Answer.findOne({ email, questionsId });

    if (answer) {
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
          options: nextQuestion.answers.map((item) => item.answer),
          dropdownOptions: nextQuestion.dropdownAnswers?.options,
        });
      }

      return res.status(400).json({
        name: "Bad Request",
        message: "Failed to get next question",
      });
    }

    res.status(403).json({
      name: "Bad Request",
      message: "You don't have access to this question",
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
  const { answers, email, questionId, quizId, answerType, order, isLast } =
    req.body;

  try {
    const answer = await Answer.findOne({ _id: answerId, "user.email": email });

    const question = await Question.findById(answer?.questionsId);

    const currentQuestion = question?.questions.find(
      (item) => item._id?.toString() === questionId
    );

    let updatedAnswer: any = {
      order,
      questionId,
      question: currentQuestion?.question,
      answerType,
      questionAnswer: {
        answer: answers,
      },
    };

    if (
      answerType === "RADIO" ||
      answerType === "CHECKBOX" ||
      answerType === "DATE"
    ) {
      const correctAnswers = currentQuestion?.answers
        .filter((item) => item.isCorrect === true)
        .map((corrects) => corrects.answer);

      const isCorrect: boolean = answers.every((item: string) =>
        correctAnswers?.includes(item)
      );

      updatedAnswer.questionAnswer["isCorrect"] = isCorrect === true;
    }

    if (answerType === "DROPDOWN") {
      let isCorrect = false;
      if (currentQuestion?.dropdownAnswers?.answer === answers[0])
        isCorrect = true;
      updatedAnswer.questionAnswer["isCorrect"] = isCorrect;
    }

    const newAnswer = await Answer.findByIdAndUpdate(answerId, {
      $push: {
        answers: updatedAnswer,
      },
    });

    if (isLast) {
      await Quiz.updateOne(
        { _id: new ObjectId(quizId), "users.email": newAnswer?.user?.email },
        { $set: { "users.$.isFinished": true, quizEndDate: new Date() } }
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
