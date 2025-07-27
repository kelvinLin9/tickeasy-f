import { Layout } from "./layout";
import { Outlet, useLocation } from "react-router-dom";
import SearchSection from "./components/searchSection";
import { useState } from "react";
import { Separator } from "@radix-ui/react-separator";
import QuestionButtonGroup from "./components/questionButtonGroup";
import QuestionNormalList from "./components/questionNormalList";
import { QuestionDetailProvider } from "../hook/QuestionDetailProvider";
export default function Question() {
  const [searchText, setSearchText] = useState("");
  const location = useLocation();
  const isRootPath = location.pathname === "/question";
  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  return (
    <QuestionDetailProvider>
      <Layout>
        <div className="min-h-[calc(100vh-6rem)] w-full">
          {isRootPath ? (
            // 顯示問題列表頁面
            <>
              <div className="mx-auto flex w-full max-w-[1075px] flex-col justify-center text-center">
                <h3>常見問題</h3>
                <SearchSection searchText={searchText} setSearchText={setSearchText} handleSearch={handleSearch} />
              </div>
              <Separator className="bg-foreground my-3 h-[1px] w-full" />
              <div className="mx-auto flex w-full max-w-[1075px] flex-col justify-center text-center">
                <QuestionButtonGroup />
                <QuestionNormalList searchText={searchText} />
              </div>
            </>
          ) : (
            // 顯示子路由內容
            <div className="mx-auto flex w-full max-w-[1075px] flex-col justify-center text-center">
              <Outlet />
            </div>
          )}
        </div>
      </Layout>
    </QuestionDetailProvider>
  );
}
