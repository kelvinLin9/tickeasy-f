import { Button } from "@/core/components/ui/button";
import { Link } from "react-router-dom";
import { useQuestionDetail } from "../../hook/useQuestionDetailContext";
export default function QuestionButtonGroup() {
  const { setActiveQuestion } = useQuestionDetail();
  const handleClick = () => {
    setActiveQuestion("");
  };
  return (
    <>
      <div className="mx-auto my-4 flex justify-center gap-4 lg:my-8 lg:max-w-[1075px] lg:flex-row">
        <Link to="/question/detail?faqType=concert">
          <Button
            variant="secondary"
            className="bg-chart-1 text-md text-sidebar-primary hover:border-chart-1 hover:bg-chart-1/80 w-[120px] text-white hover:border-1 lg:w-[200px]"
            onClick={handleClick}
          >
            演唱會相關
          </Button>
        </Link>
        <Link to="/question/detail?faqType=ticket">
          <Button
            variant="secondary"
            className="bg-chart-2 text-md text-sidebar-primary hover:border-chart-2 hover:bg-chart-2/80 w-[120px] text-white hover:border-1 lg:w-[200px]"
            onClick={handleClick}
          >
            票務相關問題
          </Button>
        </Link>
        <Link to="/question/detail?faqType=member">
          <Button
            variant="secondary"
            className="bg-chart-4 text-md text-sidebar-primary hover:border-chart-4 hover:bg-chart-4/80 w-[120px] w-full text-white hover:border-1 lg:w-[200px]"
            onClick={handleClick}
          >
            會員相關
          </Button>
        </Link>
      </div>
    </>
  );
}
