export type QuestionType = "concert" | "ticket" | "member";
export const isValidQuestionType = (type: string): type is QuestionType => {
  return ["concert", "ticket", "member"].includes(type);
};
