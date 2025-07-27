import { Icon } from "@iconify/react";
import { useImportImages } from "@/core/hooks/useImportImages";
export default function MemberOrganizeConcert() {
  const steps = [
    {
      icon: "ph:number-circle-one",
      title: "登入會員後，前往舉辦演唱會頁面",
      description: "點擊右上角登入按鈕，前往舉辦演唱會頁面",
      images: ["questionDetailContent/createConcert-1.jpg"],
    },
    {
      icon: "ph:number-circle-two",
      title: "點擊「建立舉辦方」or 點擊「XXX舉辦方」",
      description: "若尚未建立任何的舉辦方，請先點擊「建立舉辦方」，最多可以建立五個舉辦方",
      images: ["questionDetailContent/createConcert-2.jpg"],
    },

    {
      icon: "ph:number-circle-three",
      title: "建立演唱會",
      description: "進入舉辦方公司頁面後，點擊左側的「演唱會列表」，再點擊「建立演唱會」，即可建立演唱會",
      images: ["questionDetailContent/createConcert-3.jpg"],
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
      <p className="text-2xl font-bold">如何舉辦演唱會</p>
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
