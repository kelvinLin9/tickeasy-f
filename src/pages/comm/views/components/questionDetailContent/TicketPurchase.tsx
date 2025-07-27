import { Icon } from "@iconify/react";
import { useImportImages } from "@/core/hooks/useImportImages";
export default function TicketPickup() {
  const steps = [
    {
      icon: "ph:number-circle-one",
      title: "進入單一演唱會頁面",
      description: "點擊欲購票的演唱會右下方的「→」",
      images: ["questionDetailContent/checkSingleConcert-1.jpg"],
    },
    {
      icon: "ph:number-circle-two",
      title: "至單一演唱會詳細資訊頁面的下方，點擊「下一步」",
      description: "",
      images: ["questionDetailContent/buyTicket-1.jpg"],
    },

    {
      icon: "ph:number-circle-three",
      title: "便可進入購票流程",
      description: "選擇場次及票種與數量(目前限制單一訂單僅能購買一票種與一張票券)，點擊「下一步」",
      images: ["questionDetailContent/buyTicket-2.jpg"],
    },
    {
      icon: "ph:number-circle-four",
      title: "填寫購買資訊",
      description: "填寫購買人姓名、Email、手機號碼、付款方式(目前僅有信用卡付款)，點擊「下一步」",
      images: ["questionDetailContent/buyTicket-3.jpg"],
    },
    {
      icon: "ph:number-circle-five",
      title: "確認訂單資訊",
      description: "確認訂單資訊無誤後，點擊「立即付款」",
      images: ["questionDetailContent/buyTicket-4.jpg"],
    },
    {
      icon: "ph:number-circle-six",
      title: "頁面會導向至綠界金流進行付款",
      description: "依照頁面要求輸入資訊後，點擊「確認付款」，即可完成購票",
      images: ["questionDetailContent/buyTicket-5.jpg"],
    },
    {
      icon: "ph:number-circle-seven",
      title: "購票完成",
      description: "於綠界金流購票完成後，點擊「返回商店」，頁面會導向至付款結果",
      images: ["questionDetailContent/buyTicket-6.jpg"],
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
      <p className="text-2xl font-bold">如何購票</p>
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
