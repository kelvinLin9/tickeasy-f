import { Icon } from "@iconify/react";
import { useImportImages } from "@/core/hooks/useImportImages";

export default function MemberChangePassword() {
  const steps = [
    {
      icon: "ph:number-circle-one",
      title: "登入會員後，前往會員中心",
      description: "點擊右上角登入按鈕，前往會員登入頁面",
      images: ["questionDetailContent/memberChangePassword-1.jpg"],
    },
    {
      icon: "ph:number-circle-two",
      title: "選擇「修改密碼」",
      description: "輸入新密碼，並確認新密碼後，點擊「修改密碼」按鈕",
      images: ["questionDetailContent/memberChangePassword-2.jpg"],
    },

    {
      icon: "ph:number-circle-three",
      title: "完成修改密碼",
      description: "完成修改密碼後，頁面會自動導向登入頁面，重新登入",
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
      <p className="text-2xl font-bold">如何修改密碼</p>
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
