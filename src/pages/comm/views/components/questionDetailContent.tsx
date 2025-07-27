import { useQuestionDetail } from "@/pages/comm/hook/useQuestionDetailContext";
import {
  ConcertAllInfo,
  ConcertSingleInfo,
  ConcertSignup,
  TicketCheck,
  TicketPickup,
  TicketTransfer,
  TicketPayment,
  TicketRefund,
  MemberSignup,
  MemberLogin,
  MemberForgotPassword,
  MemberChangePassword,
  MemberChangePersonalInfo,
  MemberOrganizeConcert,
} from "./questionDetailContent/index";
import TicketPurchase from "./questionDetailContent/TicketPurchase";

type QuestionComponentType = {
  [key: string]: React.ComponentType;
};

const questionComponents: QuestionComponentType = {
  如何查看所有演唱會資訊: ConcertAllInfo,
  如何查看單一演唱會詳細資訊: ConcertSingleInfo,
  如何報名參加演唱會: ConcertSignup,
  我的電子票券在哪裡查看: TicketCheck,
  如何購票: TicketPurchase,
  如何取票: TicketPickup,
  票券可以轉讓嗎: TicketTransfer,
  支援那些付款方式: TicketPayment,
  如何退票: TicketRefund,
  如何註冊會員: MemberSignup,
  如何登入會員: MemberLogin,
  忘記密碼怎麼辦: MemberForgotPassword,
  如何修改密碼: MemberChangePassword,
  如何修改個人資料: MemberChangePersonalInfo,
  如何舉辦演唱會: MemberOrganizeConcert,
};

export default function QuestionDetailContent() {
  const { activeQuestion } = useQuestionDetail();
  const DynamicComponent = questionComponents[activeQuestion];

  return <div className="px-3">{DynamicComponent ? <DynamicComponent /> : <div>請選擇問題</div>}</div>;
}
