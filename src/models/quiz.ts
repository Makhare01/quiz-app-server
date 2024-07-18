import { Schema, model } from "mongoose";
import { isEmail } from "validator";

const quizUserSchema = new Schema({
  userId: String,
  email: {
    type: String,
    required: [true, "Email field is required"],
    validate: [isEmail, "Please enter a valid email"],
  },
  username: {
    type: String,
    required: [true, "username field is required"],
  },
  answerId: { type: String, required: [true, "Answer id is required"] },
  isFinished: Boolean,
});

const QuizSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name field is required"],
    },
    description: String,
    visibility: {
      type: String,
      required: [true, "Quiz visibility field is required"],
    },
    category: {
      type: String,
      required: [true, "Quiz Quiz field is required"],
    },
    userId: {
      type: String,
      required: [true, "User id field is required"],
    },
    users: [quizUserSchema],
    questionsId: {
      type: String,
      required: [true, "Questions id is required"],
    },
    questionsCount: {
      type: Number,
      required: [true, "QuestionsCount field is required"],
    },
    status: {
      type: String,
      default: "DRAFT",
    },
  },
  {
    timestamps: true,
  }
);

export const Quiz = model("quiz", QuizSchema);
