import { Button } from "@/core/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/core/hooks/useToast";
import { useConcertStore } from "../store/useConcertStore";

interface BackToListButtonProps {
  companyId?: string | null;
  isEditMode?: boolean;
}

export function BackToListButton({ companyId, isEditMode = false }: BackToListButtonProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { info } = useConcertStore();

  const handleBack = () => {
    // 優先使用 props 中的 companyId，其次是 URL 參數，最後是 store 中的 organizationId
    const orgId = companyId || searchParams.get("companyId") || (isEditMode ? info.organizationId : null);

    if (!orgId) {
      toast({
        title: "錯誤",
        description: "無法取得組織ID",
        variant: "destructive",
      });
      return;
    }
    navigate(`/companyDetail?companyId=${orgId}&tab=concertList`);
  };

  return (
    <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
      <ArrowLeft className="h-5 w-5" />
      <span className="text-sm font-medium">返回演唱會列表</span>
    </Button>
  );
}
