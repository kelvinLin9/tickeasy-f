import { Icon } from "@iconify/react";
import { useImportImages } from "@/core/hooks/useImportImages";
export default function ConcertAllInfo() {
  const steps = [
    {
      icon: "ph:number-circle-one",
      title: "前往所有演唱會列表",
      description: "於頁面上方，點擊左上角「探索頁面」，即可進入所有演唱會列表",
      images: ["questionDetailContent/checkAllConcerts-1.jpg"],
    },
    {
      icon: "ph:number-circle-two",
      title: "便可查看所有演唱會資訊",
      description: "可使用上方各式分類，進行排序或搜尋",
      images: ["questionDetailContent/checkAllConcerts-2.jpg"],
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
      <h2>如何查看所有演唱會資訊</h2>
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
