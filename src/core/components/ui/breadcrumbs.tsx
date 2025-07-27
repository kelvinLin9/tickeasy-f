import { Text } from "@radix-ui/themes";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { QuestionType } from "@/pages/comm/types/question";
interface BreadcrumbItem {
  label: string;
  path: string;
}
const routeMap = {
  concert: "演唱會相關",
  ticket: "票務相關",
  member: "會員相關",
};
export function Breadcrumb({ faqType, activeQuestion }: { faqType: QuestionType; activeQuestion: string }) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const breadcrumbItems: BreadcrumbItem[] = pathnames.map((value, index) => {
    const path = `/${pathnames.slice(0, index + 1).join("/")}`;
    return {
      label: value === "question" ? "常見問題" : routeMap[faqType],
      path: path,
    };
  });
  return (
    <div className="flex items-center px-4">
      {breadcrumbItems.map((item, index) => (
        <div key={item.path} className="flex items-center">
          <Link to={item.path}>
            <Text className={index === breadcrumbItems.length - 1 ? "font-medium" : ""}>{item.label}</Text>
          </Link>
          <Icon icon="lucide:chevron-right" className="h-5 w-5 text-gray-500" />
        </div>
      ))}
      <div className="flex items-center">
        <Text size="3" color="gray">
          {activeQuestion}
        </Text>
      </div>
    </div>
  );
}
