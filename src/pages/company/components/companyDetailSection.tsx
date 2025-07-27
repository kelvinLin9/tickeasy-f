import { Button } from "@/core/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CompanyInfoSection from "./companyInfoSection";
import CompanyConcertSection from "./companyConcertSection";
import { useEffect, useState } from "react";
import { useRequest } from "@/core/hooks/useRequest";
import { useToast } from "@/core/hooks/useToast";
import { CompanyDetailData } from "../types/company";

interface CompanyDetailResponse {
  organization: CompanyDetailData;
}

export default function CompanyDetailSection({ companyId }: { companyId: string }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [companyInfoData, setCompanyInfoData] = useState<CompanyDetailData>();

  // 從 URL 參數讀取初始 tab
  const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") || "companyInfo");

  // 更新 tab 時同步更新 URL
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "concertList") {
      setSearchParams({ tab, page: "1", companyId });
    } else {
      setSearchParams({ tab, companyId });
    }
  };

  //串接 取得公司的詳細資料
  const { data, error, refetch } = useRequest<CompanyDetailResponse>({
    queryKey: ["organizations", companyId],
    url: `/api/v1/organizations/${companyId}`,
  }).useGet();

  useEffect(() => {
    if (!data) return;
    const responseData = "data" in data ? data.data.data : data;
    if (responseData?.organization) {
      setCompanyInfoData(responseData.organization);
    }
  }, [data]);

  // 處理錯誤
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error.message || "發生錯誤，請稍後再試",
      });
    }
  }, [error, toast]);
  useEffect(() => {
    refetch();
  }, [refetch]); // 加入 refetch 依賴

  const handleBackToCompanyList = () => {
    navigate("/company");
  };

  return (
    <div className="mx-auto h-full w-full lg:w-[70%]">
      <div className="grid grid-cols-3 lg:gap-4">
        <div className="hidden lg:col-span-1 lg:block">
          <ul className="flex w-[60%] flex-col gap-4">
            <li className="hover:text-primary flex justify-start rounded-xs">
              <Button variant="link" className="w-full text-gray-400 hover:font-bold hover:text-gray-500" onClick={handleBackToCompanyList}>
                <ArrowLeftIcon />
                返回主辦方清單
              </Button>
            </li>
            <li
              className={`hover:bg-primary/10 hover:text-primary rounded-xs ${activeTab === "companyInfo" ? "bg-primary/10 text-primary" : "bg-gray-100"}`}
              onClick={() => handleTabChange("companyInfo")}
            >
              <Button variant="link" className={`w-full ${activeTab === "companyInfo" ? "text-primary" : "text-grey-500"}`}>
                公司資訊
              </Button>
            </li>
            <li
              className={`hover:bg-primary/10 hover:text-primary rounded-xs ${activeTab === "concertList" ? "bg-primary/10 text-primary" : "bg-gray-100"}`}
              onClick={() => handleTabChange("concertList")}
            >
              <Button variant="link" className={`w-full ${activeTab === "concertList" ? "text-primary" : "text-grey-500"}`}>
                演唱會列表
              </Button>
            </li>
          </ul>
        </div>
        <div className="col-span-3 flex items-center justify-between lg:hidden">
          <Button
            variant="link"
            size="lg"
            className={`text-grey-500 h-full w-full rounded-none bg-gray-100 py-3 text-xl hover:font-bold hover:text-gray-500 ${activeTab === "companyInfo" ? "bg-primary text-white" : ""} `}
            onClick={() => handleTabChange("companyInfo")}
          >
            公司資訊
          </Button>
          <Button
            variant="link"
            size="lg"
            className={`text-grey-500 h-full w-full rounded-none bg-gray-100 py-3 text-xl hover:font-bold hover:text-gray-500 ${activeTab === "concertList" ? "bg-primary text-white" : ""} `}
            onClick={() => handleTabChange("concertList")}
          >
            演唱會列表
          </Button>
        </div>
        <div className="col-span-3 lg:col-span-2">
          {companyInfoData && (
            <>
              {activeTab === "companyInfo" && (
                <CompanyInfoSection companyInfoData={companyInfoData} handleGoToConcertList={(tab) => handleTabChange(tab)} />
              )}
              {activeTab === "concertList" && <CompanyConcertSection companyInfoData={companyInfoData} />}
            </>
          )}
        </div>
        <div className="col-span-3 mt-4 block lg:hidden">
          <Button
            variant="link"
            className="flex w-full items-center justify-center text-lg text-gray-400 hover:text-gray-500"
            onClick={handleBackToCompanyList}
          >
            <ArrowLeftIcon />
            返回主辦方清單
          </Button>
        </div>
      </div>
    </div>
  );
}
