import React from "react";
import { Upload } from "lucide-react";
import { useImageUpload } from "../hook/useImageUpload";
import { Button } from "@/core/components/ui/button";

interface BannerUploadSectionProps {
  imgBanner: string;
  onBannerChange: (url: string) => void;
}

const BannerUploadSectionComponent = ({ imgBanner, onBannerChange }: BannerUploadSectionProps) => {
  const { triggerFileInput } = useImageUpload();

  const handleUploadClick = async () => {
    try {
      const url = await triggerFileInput("CONCERT_BANNER");
      if (url) onBannerChange(url);
    } catch {
      // console.error("上傳圖片失敗:", error);
    }
  };

  return (
    <div className="flex items-center justify-center py-4">
      <div
        className="flex h-[350px] w-[800px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
        onClick={handleUploadClick}
      >
        {imgBanner ? (
          <div className="relative h-full w-full">
            <img src={imgBanner} alt="banner" className="h-full w-full rounded-lg object-cover" />
            <Button
              type="button"
              variant="destructive"
              className="absolute top-1/2 left-1/2 rounded bg-white/80 px-3 py-1 text-sm text-red-600 shadow hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                onBannerChange("");
              }}
            >
              移除圖片
            </Button>
          </div>
        ) : (
          <>
            <Upload className="mb-4 h-12 w-12 text-blue-500" />
            <div className="mb-1 text-lg font-medium text-gray-700">上傳主視覺圖片</div>
            <div className="text-sm text-gray-500">(1080*540) 1MB</div>
          </>
        )}
      </div>
    </div>
  );
};

export const BannerUploadSection = React.memo(BannerUploadSectionComponent);
