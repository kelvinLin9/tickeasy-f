import { Icon } from "@iconify/react";
import { useImportImages } from "@/core/hooks/useImportImages";

export default function MemberChangePersonalInfo() {
  const steps = [
    {
      icon: "ph:number-circle-one",
      title: "登入會員後，前往會員中心",
      description: "點擊右上角登入按鈕，前往會員登入頁面",
      images: ["questionDetailContent/memberChangePersonalInfo-1.jpg"],
    },
    {
      icon: "ph:number-circle-two",
      title: "選擇「會員中心」",
      description: "點擊「修改會員資料」，便可進行資料編輯",
      images: ["questionDetailContent/memberChangePersonalInfo-2.jpg", "questionDetailContent/memberChangePersonalInfo-3.jpg"],
    },

    {
      icon: "ph:number-circle-three",
      title: "完成會員資料編輯",
      description: "完成資料編輯後，請記得「儲存會員資料」按鈕",
      images: ["questionDetailContent/memberChangePersonalInfo-4.jpg"],
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
      <p className="text-2xl font-bold">如何修改個人資料</p>
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
