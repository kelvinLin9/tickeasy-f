import { Checkbox } from "@/core/components/ui/checkbox";
import { Input } from "@/core/components/ui/input";
import { useEffect, useState } from "react";
import PaymentSelector from "./PaymentSelector";
import { useBuyTicketContext } from "../hook/useBuyTicketContext";
import { BuyerInfo } from "../types/BuyTicket";
import { useRequest } from "@/core/hooks/useRequest";
import { T_Profile } from "@/pages/user/types/porfile";
import { useToast } from "@/core/hooks/useToast";
import LoadingSpin from "@/core/components/global/loadingSpin";
const insertItems = [
  { label: "購票人姓名", id: "name", type: "text" },
  { label: "購票人Email", id: "email", type: "email" },
  { label: "購票人手機號碼", id: "mobilePhone", type: "tel" },
  { label: "目前付款方式僅提供信用卡", id: "paymentMethod", type: "select" },
];
const paymentOptions = [
  { label: "信用卡", value: "creditCard", disabled: false },
  { label: "LinePay", value: "linePay", disabled: true },
  { label: "ATM", value: "atm", disabled: true },
];

export default function InsertCreditCardSection() {
  const { toast } = useToast();
  const { buyerInfo, setBuyerInfo, validateBuyerInfo } = useBuyTicketContext();

  const [buyerSameAsMember, setBuyerSameAsMember] = useState(false);
  // 勾選購票人資訊與會員相同時, 需要發出請求取得會員資訊
  // 取得 原始Convert 列表
  interface memberData {
    user: T_Profile;
  }
  const { data, error, isLoading } = useRequest<memberData>({
    queryKey: [],
    url: "/api/v1/users/profile",
  }).useGet(undefined, buyerSameAsMember);

  useEffect(() => {
    if (buyerSameAsMember && data && "user" in data) {
      setBuyerInfo({
        name: data.user.name || "",
        email: data.user.email || "",
        mobilePhone: data.user.phone || "",
        paymentMethod: buyerInfo.paymentMethod || "",
      });
    }
    if (!buyerSameAsMember) {
      setBuyerInfo(defaultBuyerInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyerSameAsMember, data]);

  // 處理錯誤
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error.message || "發生錯誤，請稍後再試",
      });
    }
  }, [error, toast]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (id: string, value: string) => {
    const newBuyerInfo = { ...buyerInfo, [id]: value };
    setBuyerInfo(newBuyerInfo);
  };
  const handleValidate = (id: string) => {
    // 驗證單一欄位
    const validation = validateBuyerInfo(id as keyof BuyerInfo);
    if (!validation.success && validation.errors) {
      setErrors(validation.errors);
    } else {
      setErrors({});
    }
  };

  const defaultBuyerInfo = {
    name: "",
    email: "",
    mobilePhone: "",
    paymentMethod: "",
  };

  return (
    <>
      <div className="flex w-full flex-col">
        <div className="relative rounded-lg border border-gray-300 p-8">
          <div className="absolute top-0 left-0 translate-x-1/4 -translate-y-1/2 bg-white px-2 text-2xl font-bold">請輸入購買資訊</div>

          <div>
            <Checkbox
              id="buyerSameAsMember"
              onChange={() => {
                setBuyerSameAsMember(!buyerSameAsMember);
                if (!buyerSameAsMember === false) {
                  // 當取消勾選時
                  setBuyerInfo(defaultBuyerInfo);
                }
              }}
              checked={buyerSameAsMember}
              label="購票人資訊與會員相同"
            />
          </div>

          <div>
            {isLoading && <LoadingSpin />}
            {!isLoading && (
              <div>
                {insertItems.map((item) => {
                  return (
                    <div key={item.id} className="flex flex-col">
                      {item.type === "select" ? (
                        <PaymentSelector
                          options={paymentOptions}
                          label={item.label}
                          placeholder="請選擇付款方式"
                          value={buyerInfo[item.id as keyof BuyerInfo]}
                          onChange={(value) => setBuyerInfo({ ...buyerInfo, [item.id]: value })}
                        />
                      ) : (
                        <Input
                          type={item.type}
                          value={buyerInfo[item.id as keyof BuyerInfo]}
                          id={item.id}
                          label={item.label}
                          onBlur={() => handleValidate(item.id)}
                          onChange={(e) => handleInputChange(item.id, e.target.value)}
                          error={!!errors[item.id]}
                          errorMessage={errors[item.id]}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
