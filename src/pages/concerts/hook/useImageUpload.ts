import { useToast } from "@/core/hooks/useToast";
import { useConcertStore } from "@/pages/concerts/store/useConcertStore";
// import axios from "axios";
// import { getAuthToken } from "@/pages/concerts/store/authToken";

// 圖片上傳類型：使用者頭像、場地照片、演唱會座位表、演唱會橫幅
type ImageType = "USER_AVATAR" | "VENUE_PHOTO" | "CONCERT_SEATING_TABLE" | "CONCERT_BANNER";

// 圖片上傳選項
interface UseImageUploadOptions {
  maxSizeInMB?: number; // 最大檔案大小（MB）
  allowedTypes?: string[]; // 允許的檔案類型
}

export const useImageUpload = (options: UseImageUploadOptions = {}) => {
  const { toast } = useToast();
  const { maxSizeInMB = 1, allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"] } = options;

  const handleFileChange = async (e: Event, imageType: ImageType): Promise<string | undefined> => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // 驗證檔案類型
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "錯誤",
        description: `只支援 ${allowedTypes.map((t) => t.split("/")[1].toUpperCase()).join("、")} 格式`,
        variant: "destructive",
      });
      return;
    }

    // 驗證檔案大小
    const maxSize = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "錯誤",
        description: `檔案大小不能超過 ${maxSizeInMB}MB`,
        variant: "destructive",
      });
      return;
    }

    try {
      const url = await useConcertStore.getState().uploadImage(file, imageType);
      toast({
        title: "成功",
        description: "圖片上傳成功",
      });
      return url;
    } catch (error: unknown) {
      let message = "圖片上傳失敗";
      if (error instanceof Error) message = error.message;
      toast({
        title: "錯誤",
        description: message,
        variant: "destructive",
      });
      return;
    }
  };

  const triggerFileInput = (imageType: ImageType): Promise<string | undefined> => {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = allowedTypes.join(",");
      input.onchange = async (e) => {
        const url = await handleFileChange(e, imageType);
        resolve(url);
      };
      input.click();
    });
  };

  return {
    handleFileChange,
    triggerFileInput,
  };
};
