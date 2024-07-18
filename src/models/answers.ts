import { Schema, model } from "mongoose";
import isEmail from "validator/lib/isEmail";

const AnswerSchema = new Schema({
  questionId: {
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

const UserAnswerSchema = new Schema(
  {
    userId: String,
    quizId: String,
    email: {
      type: String,
      required: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    username: {
      type: String,
      required: true,
    },
    questionsId: {
      type: String,
      required: true,
    },
    answers: [AnswerSchema],
  },
  {
    timestamps: true,
  }
);

export const Answer = model("answer", UserAnswerSchema);
