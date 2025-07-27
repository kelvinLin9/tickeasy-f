import { Button } from "@/core/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useCreateOrganizer } from "../hook/useCreateOrganizerContext";

export default function BannerSection({ companyCount }: { companyCount: number }) {
  const { isCreateOrganize, setIsCreateOrganize } = useCreateOrganizer();
  return (
    <div className="h-[150px] w-full bg-neutral-200/80 lg:h-[100px]">
      <div
        className={`align-self-center flex h-full w-full flex-col items-center py-4 lg:mx-auto lg:w-[70%] lg:flex-row ${
          isCreateOrganize ? "justify-center" : "justify-between"
        }`}
      >
        <div className="text-2xl font-bold">{isCreateOrganize ? "建立主辦方" : "選擇主辦方"}</div>

        {!isCreateOrganize && companyCount < 5 && (
          <Button className="bg-primary my-2 rounded-full text-white" onClick={() => setIsCreateOrganize(true)}>
            建立主辦方
            <PlusIcon />
          </Button>
        )}
      </div>
    </div>
  );
}
