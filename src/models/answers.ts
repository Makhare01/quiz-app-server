import { Schema, model } from "mongoose";
import isEmail from "validator/lib/isEmail";

const AnswerSchema = new Schema({
  questionId: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answerType: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  questionAnswer: new Schema({
    answer: [String],
    isCorrect: Boolean,
  }),
});

const AnswerUserSchema = new Schema({
  userId: String,
  email: {
    type: String,
    required: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  username: {
    type: String,
    required: true,
  },
});

const UserAnswerSchema = new Schema(
  {
    quizId: String,
    questionsId: {
      type: String,
      required: true,
    },
    user: AnswerUserSchema,
    answers: [AnswerSchema],
    quizName: {
      type: String,
      required: true,
    },
    questionsCount: {
      type: Number,
      required: true,
    },
    quizCategory: {
      type: String,
      required: true,
    },
    quizEndDate: Date,
  },
  {
    timestamps: true,
  }
);

export const Answer = model("answer", UserAnswerSchema);
