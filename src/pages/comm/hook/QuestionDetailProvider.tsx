import { useState, ReactNode, useEffect } from "react";
import { QuestionDetailContext } from "@/context/questionDetailContext";
import { useSearchParams, useLocation } from "react-router-dom";

export function QuestionDetailProvider({ children }: { children: ReactNode }) {
  const [activeQuestion, setActiveQuestion] = useState<string>("");
  const [routeParam, setRouteParam] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // 1. 監聽路徑，清空 context
  useEffect(() => {
    if (location.pathname === "/question") {
      setActiveQuestion("");
      setRouteParam("");
    }
  }, [location.pathname]);

  // 2. 監聽 routeParam，處理網址參數
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (routeParam) {
      newParams.set("question", routeParam);
      setSearchParams(newParams);
    } else {
      newParams.delete("question");
      setSearchParams(newParams);
    }
  }, [routeParam, setSearchParams, searchParams]);

  return (
    <QuestionDetailContext.Provider value={{ activeQuestion, setActiveQuestion, routeParam, setRouteParam }}>
      {children}
    </QuestionDetailContext.Provider>
  );
}
