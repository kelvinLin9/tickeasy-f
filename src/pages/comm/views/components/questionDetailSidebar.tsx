import { Button } from "@/core/components/ui/button";
import { QuestionType } from "../../types/question";
import { useQuestionDetail } from "../../hook/useQuestionDetailContext";
import { useEffect } from "react";
import { Icon } from "@iconify/react";
const faqDetails = {
  concert: [
    { title: "如何查看所有演唱會資訊", param: "allConcert" },
    { title: "如何查看單一演唱會詳細資訊", param: "singleConcert" },
    { title: "如何報名參加演唱會", param: "registerConcert" },
  ],
  ticket: [
    { title: "我的電子票券在哪裡查看", param: "myTicket" },
    { title: "如何購票", param: "buyTicket" },
    { title: "如何取票", param: "pickupTicket" },
    { title: "支援那些付款方式", param: "paymentMethod" },
    { title: "如何退票", param: "refundTicket" },
  ],
  member: [
    { title: "如何註冊會員", param: "registerMember" },
    { title: "如何登入會員", param: "loginMember" },
    { title: "忘記密碼怎麼辦", param: "forgetPassword" },
    { title: "如何修改個人資料", param: "editMember" },
    { title: "如何修改密碼", param: "changePassword" },
    { title: "如何舉辦演唱會", param: "hostConcert" },
  ],
};

export default function QuestionDetailSidebar({ faqType }: { faqType: QuestionType }) {
  const { activeQuestion, setActiveQuestion, setRouteParam } = useQuestionDetail();
  const handleClick = (question: { title: string; param: string }) => {
    setActiveQuestion(question.title);
    setRouteParam(question.param);
  };
  useEffect(() => {
    if (!activeQuestion) {
      setActiveQuestion(faqDetails[faqType][0].title);
      setRouteParam(faqDetails[faqType][0].param);
    }
  }, [faqType]);
  return (
    <>
      <div className="mx-auto my-8 flex max-w-[1075px] justify-center gap-4">
        <ul>
          {faqDetails[faqType].map((faq, index) => (
            <li key={index} className="text-start">
              <Button
                variant="ghost"
                onClick={() => handleClick(faq)}
                className={`hover:border-primary hover:border-1 ${activeQuestion === faq.title ? "bg-primary/90 text-white" : ""}`}
              >
                {faq.title}
                <Icon icon="line-md:question-circle" className="text-grey-500 h-6 w-6" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
