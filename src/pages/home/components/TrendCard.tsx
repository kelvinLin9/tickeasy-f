import { TrendCardProps } from "../types/TrendCard";
import { Button } from "@/core/components/ui/button";
import { Icon } from "@iconify-icon/react";
import { useNavigate } from "react-router-dom";

export default function TrendCard(data: TrendCardProps) {
  const navigate = useNavigate();

  return (
    <>
      {/* 手機板 */}
      <div className="flex justify-center lg:hidden">
        <div className="relative mx-4 flex max-w-[400px] flex-col overflow-hidden rounded-lg border-1 border-neutral-200">
          <img src={data.image} alt={data.title} className="h-[200px] w-full object-cover" />
          <div className="space-y-2 px-4 py-4">
            <h5 className="line-clamp-2 font-bold">{data.title}</h5>
            <p className="line-clamp-3 text-base text-gray-500">{data.description}</p>
            <Button
              onClick={() => navigate(`/concert/${data.link}`)}
              variant={"outline"}
              className="w-[66%] max-w-[200px] rounded-full px-3 pl-10 text-left"
            >
              <div className="flex w-full items-center justify-between">
                <p className="text-base">立刻訂票</p>
                <Icon icon="my-arrow-right" className="text-2xl" />
              </div>
            </Button>
          </div>
        </div>
      </div>
      {/* 電腦板 */}
      <div className="container mx-auto hidden px-4 lg:block">
        <div className="flex">
          <div className="h-[400px] w-1/2 overflow-hidden rounded-2xl">
            <img src={data.bgImage} alt={data.title} className="h-full w-full object-cover" />
          </div>
          <div className="flex w-1/2 flex-col gap-y-8 p-8">
            <h3 className="font-bold">{data.title}</h3>
            <p className="text-xl text-gray-500">{data.description}</p>
            <Button
              onClick={() => navigate(`/concert/${data.link}`)}
              variant={"outline"}
              className="w-[66%] max-w-[200px] rounded-full px-3 pl-10 text-left"
            >
              <div className="flex w-full items-center justify-between">
                <p className="text-xl">立刻訂票</p>
                <Icon icon="my-arrow-right" className="text-2xl" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
