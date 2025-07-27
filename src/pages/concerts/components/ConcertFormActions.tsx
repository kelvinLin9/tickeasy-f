import { Button } from "@/core/components/ui/button";
import LoadingSpin from "@/core/components/global/loadingSpin";
import { useConcertStore } from "../store/useConcertStore";
import { useToast } from "@/core/hooks/useToast";
import { useState } from "react";

interface ConcertFormActionsProps {
  onSaveAndNext: () => void;
  isEditMode?: boolean;
}

export function ConcertFormActions({ onSaveAndNext, isEditMode = false }: ConcertFormActionsProps) {
  const { saveDraft, getConcert } = useConcertStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveDraft = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await saveDraft();
      if (result?.concertId) {
        await getConcert(result.concertId); // 重新抓最新資料
      }
      toast({
        title: "成功",
        description: "草稿儲存成功",
        variant: "default",
      });
    } catch {
      // console.error("草稿儲存失敗:", e);
      toast({
        title: "錯誤",
        description: "草稿儲存失敗",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await onSaveAndNext();
    } catch {
      // console.error("下一步操作失敗:", e);
      toast({
        title: "錯誤",
        description: "操作失敗，請重試",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpin fullPage={true} />}
      <div className="mt-8 flex items-center justify-between">
        <Button variant="outline" className="rounded border-[#2986cc] bg-[#2986cc] text-white" onClick={handleSaveDraft} disabled={isLoading}>
          {isEditMode ? "儲存變更" : "儲存草稿"}
        </Button>
        <Button variant="outline" className="rounded border border-black text-black" onClick={handleNextStep} disabled={isLoading}>
          下一步
        </Button>
      </div>
    </>
  );
}
