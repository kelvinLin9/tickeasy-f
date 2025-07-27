import { useConcertStore } from "../store/useConcertStore";
import { useToast } from "@/core/hooks/useToast";

export function useSeattableUpload() {
  const { updateSession, uploadImage } = useConcertStore();
  const { toast } = useToast();

  const handleUploadSeattable = async (sessionId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/gif,image/webp";
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // 檢查格式
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "錯誤",
          description: "只支援 JPEG、PNG、GIF 或 WebP 格式",
          variant: "destructive",
        });
        return;
      }
      // 檢查大小
      if (file.size > 1024 * 1024) {
        toast({
          title: "錯誤",
          description: "檔案大小不能超過 1MB",
          variant: "destructive",
        });
        return;
      }

      // 上傳
      try {
        const url = await uploadImage(file, "CONCERT_SEATING_TABLE");
        updateSession({ sessionId, imgSeattable: url });
        toast({ title: "成功", description: "座位圖上傳成功" });
      } catch {
        toast({
          title: "錯誤",
          description: "座位圖上傳失敗",
          variant: "destructive",
        });
        // console.error(err);
      }
    };
    input.click();
  };

  return { handleUploadSeattable };
}
