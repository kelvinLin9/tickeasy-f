import { Breadcrumb } from "@/core/components/ui/breadcrumbs";
import { Navigate, useSearchParams } from "react-router-dom";
import { QuestionType, isValidQuestionType } from "../types/question";
import QuestionDetailSidebar from "./components/questionDetailSidebar";
import QuestionDetailContent from "./components/questionDetailContent";
import { useQuestionDetail } from "../hook/useQuestionDetailContext";
import QuestionDetailDropdown from "./components/QuestionDetailDropdown";

export default function QuestionDetail() {
  const [searchParams] = useSearchParams();
  const { activeQuestion } = useQuestionDetail();
  const faqType = searchParams.get("faqType") as QuestionType;
  if (!isValidQuestionType(faqType)) {
    return <Navigate to="/question" replace />;
  }
  return (
    <>
      <Breadcrumb faqType={faqType} activeQuestion={activeQuestion} />
      <div className="my-8 grid grid-cols-4">
        <div className="col-span-4 lg:col-span-1">
          <div className="hidden lg:block">
            <p className="text-lg font-bold">其他相關問題</p>
            <QuestionDetailSidebar faqType={faqType} />
          </div>
          <div className="block lg:hidden">
            <QuestionDetailDropdown faqType={faqType} />
          </div>
        </div>
        <div className="col-span-4 lg:col-span-3">
          <QuestionDetailContent />
        </div>
      </div>
    </>
  );
}
