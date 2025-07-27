import Separator from "@/core/components/ui/separator";

export const ContactCustomerService = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">聯絡資訊</h1>
      <Separator className="my-4" />
      <div className="mx-auto w-[80%]">
        <p className="text-center text-lg leading-8">
          若您有任何需要我們服務的地方，請將問題寄至 tickeasy@email.com 我們收到您的來信後，將儘速於3～5 日內回覆（不含週六例假日）。
        </p>
      </div>
    </div>
  );
};
