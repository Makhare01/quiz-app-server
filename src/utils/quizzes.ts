export const getPublicQuiz = (quiz: any) => {
  return {
    quizId: quiz._id,
    name: quiz.name,
    description: quiz.description,
    category: quiz.category,
    questionsId: quiz.questionsId,
    questionsCount: quiz.questionsCount,
  };
};
