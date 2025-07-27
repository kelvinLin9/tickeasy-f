import { Icon } from "@iconify/react";
import { useImportImages } from "@/core/hooks/useImportImages";
export default function TicketRefund() {
  const steps = [
    {
      icon: "ph:number-circle-one",
      title: "登入會員後，點擊頁面上方的「查看票券」or 進入會員中心，點擊「我的票券」",
      description: "便可查看所有電子票券",
      images: ["questionDetailContent/checkAllTickets.jpg", "questionDetailContent/checkAllTickets-1.jpg"],
    },
    {
      icon: "ph:number-circle-two",
      title: "點擊「參與的演唱會」分類中票券左方的「查看票券」",
      description: "即可查看票券詳細資訊",
      images: ["questionDetailContent/refundTicket-1.jpg"],
    },
    {
      icon: "ph:number-circle-three",
      title: "票券右方有「退票」按鈕",
      description: "點擊後即可進入退票流程",
      images: ["questionDetailContent/refundTicket-2.jpg"],
    },
    {
      icon: "ph:number-circle-four",
      title: "點擊後，會顯示「退票注意事項」與「退票確認」",
      description: "確認無誤後，點擊「確定」，便可完成退票",
      images: ["questionDetailContent/refundTicket-3.jpg", "questionDetailContent/refundTicket-4.jpg"],
    },
    {
      icon: "ph:number-circle-five",
      title: "退票完成後，可至「查看票券」查看票券狀態",
      description: "退票完成後，票券會分類為「已退票」",
      images: ["questionDetailContent/refundTicket-5.jpg"],
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
      <p className="text-2xl font-bold">如何退票</p>
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
