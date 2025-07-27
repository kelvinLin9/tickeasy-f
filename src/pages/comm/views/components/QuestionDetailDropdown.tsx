import { QuestionType } from "../../types/question";
import { useQuestionDetail } from "../../hook/useQuestionDetailContext";
import { useEffect } from "react";
import { Icon } from "@iconify/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select";

const faqDetails = {
  concert: ["如何查看所有演唱會資訊", "如何查看單一演唱會詳細資訊", "如何報名參加演唱會"],
  ticket: ["我的電子票券在哪裡查看", "如何購票", "如何取票", "支援那些付款方式", "如何退票"],
  member: ["如何註冊會員", "如何登入會員", "忘記密碼怎麼辦", "如何修改個人資料", "如何修改密碼", "如何舉辦演唱會"],
};

export default function QuestionDetailDropdown({ faqType }: { faqType: QuestionType }) {
  const { activeQuestion, setActiveQuestion } = useQuestionDetail();

  const handleValueChange = (value: string) => {
    setActiveQuestion(value);
  };

  useEffect(() => {
    if (!activeQuestion) {
      setActiveQuestion(faqDetails[faqType][0]);
    }
  }, [faqType]);

  return (
    <div className="mx-auto my-8 flex max-w-[1075px] justify-center gap-4">
      <Select value={activeQuestion ?? faqDetails[faqType][0]} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="選擇問題" />
        </SelectTrigger>
        <SelectContent className="text-center">
          {faqDetails[faqType].map((faq, index) => (
            <SelectItem key={index} value={faq}>
              <div className="flex items-center justify-center gap-2">
                {faq}
                <Icon icon="line-md:question-circle" className="text-grey-500 h-6 w-6" />
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
