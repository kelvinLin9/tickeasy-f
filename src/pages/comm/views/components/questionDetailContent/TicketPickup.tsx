import { Icon } from "@iconify/react";
import { useImportImages } from "@/core/hooks/useImportImages";
export default function TicketPickup() {
  const steps = [
    {
      icon: "ph:number-circle-one",
      title: "登入會員後，點擊頁面上方的「查看票券」or 進入會員中心，點擊「我的票券」",
      description: "便可查看所有電子票券",
      images: ["questionDetailContent/checkAllTickets.jpg", "questionDetailContent/checkAllTickets-1.jpg"],
    },
    {
      icon: "ph:number-circle-two",
      title: "「參與的演唱會」分類中的票券皆有QC Code",
      description: "即可出示此QR Code，於演唱會入口處進行掃描入場",
      images: ["questionDetailContent/pickupTicket-1.jpg"],
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
      <p className="text-2xl font-bold">演唱會票券如何取票</p>
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
