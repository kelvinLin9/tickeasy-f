import { Button } from "@/core/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
export function NotFoundSection() {
  const navigate = useNavigate();
  return (
    <section className="mx-3 flex flex-col items-center justify-center md:mx-8">
      <div className="w-full p-3 md:w-[80%] md:p-8">
        <div className="my-3 md:my-2">
          <p className="flex items-center text-xl leading-10 font-bold">
            <Icon icon="oui:ws-search" className="text-s mr-2" />
            找不到此頁面!
          </p>
          <div className="text-md">
            可能是演唱會資訊已更新或網址輸入錯誤。請返回
            <Button type="button" variant="link" className="text-md px-1 font-bold text-black" onClick={() => navigate("/")}>
              首頁
            </Button>
            或查看其他
            <Button type="button" variant="link" className="text-md px-1 font-bold text-black" onClick={() => navigate("/concert")}>
              演唱會資訊
            </Button>
            。
          </div>
        </div>
        <div className="my-3 md:my-2">
          <p className="flex items-center text-xl leading-10 font-bold">
            <Icon icon="oui:ws-search" className="text-s mr-2" />
            Page Not Found!
          </p>
          <div className="text-md">
            The concert information may have been updated or the URL may be incorrect. Please return to
            <Button type="button" variant="link" className="text-md px-1 font-bold text-black" onClick={() => navigate("/")}>
              Homepage
            </Button>
            or view other
            <Button type="button" variant="link" className="text-md px-1 font-bold text-black" onClick={() => navigate("/concert")}>
              concert information
            </Button>
            .
          </div>
        </div>
      </div>
      <Button onClick={() => navigate("/")} type="button" variant="gradient" className="my-5 p-6">
        Back to HomePage 回到首頁
      </Button>
    </section>
  );
}
