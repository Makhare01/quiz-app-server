export const getPublicQuiz = (quiz: any, userFavorites?: Array<string>) => {
  const isFavorite = userFavorites?.includes(quiz._id);
  return {
    quizId: quiz._id,
    name: quiz.name,
    description: quiz.description,
    category: quiz.category,
    questionsId: quiz.questionsId,
    questionsCount: quiz.questionsCount,
    isFavorite,
  };
};
