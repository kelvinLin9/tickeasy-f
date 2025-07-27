import { Card as RadixCard, Text, Box } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { useQuestionDetail } from "@/pages/comm/hook/useQuestionDetailContext";
import { Icon } from "@iconify/react/dist/iconify.js";
import { QuestionType } from "../../types/question";
const borderColor = {
  concert: "border-chart-1",
  ticket: "border-chart-2",
  member: "border-chart-4",
};
export function QuestionCard({ title, content, href, type }: { title: string; content: string; href?: string; type: QuestionType }) {
  const { setActiveQuestion } = useQuestionDetail();
  const handleClick = () => {
    setActiveQuestion(title);
  };
  return (
    <RadixCard size="2">
      <Box>
        {href ? (
          <Link to={href} onClick={handleClick} className="inline-block">
            <Text
              as="p"
              size="5"
              weight="bold"
              mb="2"
              className={`text-decoration-line: border-chart-1 flex items-center gap-2 border-l-5 pl-2 ${borderColor[type]} `}
              style={{ cursor: "pointer" }}
            >
              {title}
              <Icon icon="line-md:question-circle" className="text-grey-500 h-6 w-6" />
            </Text>
          </Link>
        ) : (
          <Text as="p" size="5" weight="bold" mb="2">
            {title}
          </Text>
        )}
        <Text as="p" size="3">
          {content}
        </Text>
      </Box>
    </RadixCard>
  );
}
