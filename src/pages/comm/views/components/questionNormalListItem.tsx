import { QuestionCard } from "./questionCard";
import { QuestionType } from "../../types/question";

export default function QuestionNormalListItem({
  title,
  content,
  href,
  type,
}: {
  title: string;
  content: string;
  href?: string;
  type: QuestionType;
}) {
  return (
    <>
      <div className="mx-auto my-8 flex flex-col justify-center gap-4">
        <QuestionCard title={title} content={content} href={href} type={type} />
      </div>
    </>
  );
}
