import { Icon } from "@iconify/react";
import { useImportImages } from "@/core/hooks/useImportImages";

export default function MemberLogin() {
  const steps = [
    {
      icon: "ph:number-circle-one",
      title: "前往會員登入頁面",
      description: "點擊右上角登入按鈕，前往會員登入頁面",
      images: ["questionDetailContent/memberLogin-1.jpg"],
    },
    {
      icon: "ph:number-circle-two",
      title: "填寫登入資訊 或 使用Google登入",
      description: "依照欄位要求填寫登入資訊 或 使用Google登入",
      images: ["questionDetailContent/memberLogin-2.jpg", "questionDetailContent/memberLogin-3.jpg"],
    },

    {
      icon: "ph:number-circle-three",
      title: "完成登入",
      description: "完成登入後，頁面會自動導向首頁",
    },
  ];
  // 預處理圖片：取得所有 image paths 對應的真實 src
  // 先獲取所有圖片路徑
  const allImagePaths = steps.flatMap((step) => step.images || []);
  const importedImages = useImportImages(allImagePaths);

  // 然後在 map 中使用
  const stepsWithImages = steps.map((step) => ({
    ...step,
    resolvedImages: step.images?.map((imgPath) => importedImages[imgPath]) ?? [],
  }));

  return (
    <div>
      <p className="text-2xl font-bold">如何登入會員</p>
      <div className="my-8">
        <ul className="text-start text-lg">
          {stepsWithImages.map((step, index) => (
            <li key={index} className="my-10">
              <div className="my-2 flex items-center gap-2">
                <Icon icon={step.icon} className="h-6 w-6 text-blue-500" />
                {step.title}
              </div>
              <p>{step.description}</p>
              <div className="my-2 flex flex-col gap-2">
                {step.resolvedImages.map((src, index) => (src ? <img key={index} src={src} alt={step.title} /> : null))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
