import { useContext } from "react";
import { QuestionDetailContext } from "@/context/questionDetailContext";

export function useQuestionDetail() {
  const context = useContext(QuestionDetailContext);
  if (context === undefined) {
    throw new Error("useQuestionDetail must be used within a QuestionDetailProvider");
  }
  return context;
}
