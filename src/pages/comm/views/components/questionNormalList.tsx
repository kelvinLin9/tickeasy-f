import QuestionNormalListItem from "./questionNormalListItem";
import { QuestionType } from "../../types/question";

const faqs = [
  {
    title: "如何報名參加演唱會",
    content:
      "前往所有演唱會列表，點擊欲報名的演唱會的右下方的「→」，即可進入演唱會詳細資訊頁面，點擊「下一步」，便可填寫購票資訊與付款，即可完成報名。",
    link: "/question/detail?faqType=concert",
    type: "concert",
  },
  {
    title: "如何購票",
    content: "前往所有演唱會列表，點擊欲報名的演唱會的右下方的「→」，即可進入演唱會詳細資訊頁面，點擊「下一步」，便可進入購票流程",
    link: "/question/detail?faqType=ticket",
    type: "ticket",
  },
  {
    title: "如何取票",
    content:
      "登入會員後，點擊頁面上的「查看票券」，即可查看所有電子票券，「參與的演唱會」分類中的票券皆有QC Code，即可出示此QR Code，於演唱會入口處進行掃描入場",
    link: "/question/detail?faqType=ticket",
    type: "ticket",
  },
  {
    title: "我的電子票券在哪裡查看",
    content:
      "請於登入會員後，點擊右上方的帳號，即可看見「會員中心」的選項，點擊後即可看見「演唱會及票券」的選項，點擊後即可看見您的電子票券;或者登入會員後，點擊頁面上的「查看票券」，即可查看所有電子票券",
    link: "/question/detail?faqType=ticket",
    type: "ticket",
  },
  {
    title: "如何註冊會員",
    content:
      "請先至Tickeasy樂票網首頁，點選右上方的註冊，進入註冊頁面後，填寫相關表格內容，建立您的Tickeasy樂票網帳號，完成後即可至登入頁面進行會員登入。",
    link: "/question/detail?faqType=member",
    type: "member",
  },
  {
    title: "如何登入會員",
    content:
      "請先至Tickeasy樂票網首頁，點選右上方的登入，進入登入頁面後，輸入註冊時的電子郵件Email與密碼後進行登入，或者也可直接使用Google帳號登入。",
    link: "/question/detail?faqType=member",
    type: "member",
  },
  {
    title: "忘記密碼怎麼辦",
    content:
      "請至登入頁面點選頁面表格下方的「忘記密碼」，點擊後，會彈出視窗，請您輸入註冊時的電子郵件Email，系統則會寄出信件協助您更新密碼，您可使用新密碼登入後再自行至個人設定中修改密碼。",
    link: "/question/detail?faqType=member",
    type: "member",
  },
  {
    title: "如何舉辦演唱會",
    content: "請於登入會員後，點擊右上方的帳號，即可看見「舉辦演唱會」的選項，點擊後可進入「舉辦方頁面」，即可進行演唱會的舉辦。",
    link: "/question/detail?faqType=member",
    type: "member",
  },
];
export default function QuestionNormalList({ searchText }: { searchText: string }) {
  const filteredFaqs = faqs.filter((faq) => faq.title.toLowerCase().includes(searchText.toLowerCase()));
  return (
    <>
      <div className="flex w-full flex-col justify-center lg:my-4">
        <h3 className="hidden lg:block">常見問題列表</h3>
        <div>
          {filteredFaqs.length === 0 ? (
            <p className="mt-20 text-center text-lg">請點擊上方問題分類，查看相關問題</p>
          ) : (
            filteredFaqs.map((faq) => (
              <QuestionNormalListItem key={faq.title} title={faq.title} content={faq.content} href={faq.link} type={faq.type as QuestionType} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
