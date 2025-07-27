import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import { CompanyDetailData } from "../types/company";
import { SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRequest } from "@/core/hooks/useRequest";
import { useToast } from "@/core/hooks/useToast";
import { CreateOrganizeData } from "../types/company";
import { ConfirmDialog } from "@/core/components/global/confirmDialog";
import { useNavigate } from "react-router-dom";
import LoadingSpin from "@/core/components/global/loadingSpin";
// 定義表單驗證 schema
const formSchema = z.object({
  orgName: z.string().trim().min(1, "公司名稱為必填"),
  orgContact: z.string().trim().min(1, "聯絡人姓名為必填"),
  orgAddress: z.string().trim().min(1, "公司地址為必填"),
  orgMobile: z.string().trim().min(1, "聯絡人電話為必填"),
  orgMail: z.string().email("請輸入有效的電子郵件"),
  orgPhone: z
    .string()
    .trim()
    .regex(/^0\d{8,9}$/, "必須為 0 開頭的 9 或 10 碼數字"),
  orgWebsite: z.string().trim().optional(),
});
type FormValues = z.infer<typeof formSchema>;

interface UpdateOrganizeResponse {
  organization: CreateOrganizeData;
}

export default function CompanyInfoSection({
  handleGoToConcertList,
  companyInfoData,
}: {
  handleGoToConcertList: (path: string) => void;
  companyInfoData?: CompanyDetailData;
}) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orgName: companyInfoData?.orgName || "",
      orgContact: companyInfoData?.orgContact || "",
      orgAddress: companyInfoData?.orgAddress || "",
      orgMobile: companyInfoData?.orgMobile || "",
      orgMail: companyInfoData?.orgMail || "",
      orgPhone: companyInfoData?.orgPhone || "",
      orgWebsite: companyInfoData?.orgWebsite || "",
    },
  });

  const formItems: { title: string; field: keyof FormValues }[] = [
    { title: "公司名稱", field: "orgName" },
    { title: "聯絡人姓名", field: "orgContact" },
    { title: "公司地址", field: "orgAddress" },
    { title: "聯絡人電話", field: "orgMobile" },
    { title: "公司電話", field: "orgPhone" },
    { title: "公司網址", field: "orgWebsite" },
  ];

  useEffect(() => {
    if (companyInfoData) {
      setIsLoading(false);
      // 當 companyInfoData 更新時，重置表單值
      reset({
        orgName: companyInfoData.orgName || "",
        orgContact: companyInfoData.orgContact || "",
        orgAddress: companyInfoData.orgAddress || "",
        orgMobile: companyInfoData.orgMobile || "",
        orgMail: companyInfoData.orgMail || "",
        orgPhone: companyInfoData.orgPhone || "",
        orgWebsite: companyInfoData.orgWebsite || "",
      });
    } else {
      setIsLoading(true);
    }
  }, [companyInfoData, reset]);

  // const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   let value = e.target.value.replace(/\D/g, ""); // 移除所有非數字字符
  //   if (value.length > 1) {
  //     value = value.slice(0, 2) + "-" + value.slice(2); // 在第二個字符後插入 '-'
  //   }
  //   e.target.value = value;
  // };

  //串接 更新公司的詳細資料
  const { useUpdate: requestUpdateCompany } = useRequest({
    queryKey: companyInfoData?.organizationId ? ["organizations", companyInfoData.organizationId] : ["organizations"],
    url: "/api/v1/organizations",
  });
  const requestUpdateCompanyMutation = requestUpdateCompany({
    onSuccess: (response) => {
      const res = response as UpdateOrganizeResponse;
      if (res.organization) {
        toast({
          title: "成功",
          description: "更新資料成功",
        });
        setIsEdit(false);
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error.message || "更新失敗，請稍後再試",
      });
    },
  });

  const handleSave = (data: FormValues) => {
    if (!companyInfoData?.organizationId) return;

    requestUpdateCompanyMutation.mutate({
      id: companyInfoData.organizationId,
      data: data,
    });
  };

  //串接 刪除公司資料
  const { useDelete: requestDeleteCompany } = useRequest({
    queryKey: companyInfoData?.organizationId ? ["organizations", companyInfoData.organizationId] : ["organizations"],
    url: "/api/v1/organizations",
  });
  const requestDeleteCompanyMutation = requestDeleteCompany({
    onSuccess: (response) => {
      const res = response;
      if (res) {
        toast({
          title: "成功",
          description: "刪除資料成功",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error.message || "刪除失敗，請稍後再試",
      });
    },
  });
  const handleCancel = () => {
    // 重置表單內容到原始狀態
    if (companyInfoData) {
      reset();
    }
    setIsEdit(false);
  };

  const handleConfirmDelete = () => {
    if (!companyInfoData?.organizationId) return;
    requestDeleteCompanyMutation.mutate(companyInfoData.organizationId);
    navigate("/company");
  };

  const goToConcertList = () => {
    handleGoToConcertList("concertList");
  };
  return (
    <div className="mx-auto h-full w-full">
      <div className="border-grey-500 rounded-xl border-2 p-8 lg:p-12">
        {isLoading ? (
          <LoadingSpin />
        ) : (
          <>
            <div className="flex justify-between">
              <div className="text-2xl font-bold">{companyInfoData?.orgName}</div>
              {!isEdit && (
                <div className="hidden justify-end gap-4 lg:flex">
                  <Button type="submit" variant="outline" className="my-2 flex rounded-full lg:w-[100px]" onClick={() => setIsEdit(true)}>
                    編輯
                  </Button>
                  <ConfirmDialog
                    trigger={
                      <Button
                        type="button"
                        variant="outline"
                        className="border-destructive hover:bg-destructive text-destructive my-2 rounded-full border lg:w-[80px]"
                      >
                        刪除
                      </Button>
                    }
                    title="確認刪除"
                    description="確定要刪除此公司資料嗎？此操作無法復原。"
                    onConfirm={handleConfirmDelete}
                    confirmText="刪除"
                    cancelText="取消"
                  />
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(handleSave)} className="my-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
                {formItems.map((item) => (
                  <div key={item.title} className="flex flex-col">
                    {isEdit ? (
                      <Input
                        labelClass="text-start"
                        type="text"
                        id={item.title}
                        label={item.title}
                        {...register(item.field)}
                        error={!!errors[item.field]}
                        errorMessage={errors[item.field]?.message}
                      />
                    ) : (
                      <div className="p-3 lg:p-5">
                        <p className="lg:text-md my-1 text-lg font-semibold">{item.title}</p>
                        <p className="text-primary text-md ml-3 lg:text-sm">{companyInfoData?.[item.field] || ""}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </form>
            {!isEdit && (
              <div className="block flex justify-end gap-4 lg:hidden">
                <Button type="submit" variant="outline" className="my-2 flex w-full rounded-full lg:w-[100px]" onClick={() => setIsEdit(true)}>
                  編輯
                </Button>
                <ConfirmDialog
                  trigger={
                    <Button
                      type="button"
                      variant="outline"
                      className="border-destructive hover:bg-destructive text-destructive my-2 rounded-full border lg:w-[80px]"
                    >
                      刪除
                    </Button>
                  }
                  title="確認刪除"
                  description="確定要刪除此公司資料嗎？此操作無法復原。"
                  onConfirm={handleConfirmDelete}
                  confirmText="刪除"
                  cancelText="取消"
                />
              </div>
            )}
            {isEdit ? (
              <div className="flex justify-between gap-4">
                <Button
                  type="button"
                  className="bg-primary/80 hover:bg-primary my-2 w-full rounded-full text-white lg:w-[100px]"
                  onClick={handleSubmit(handleSave)}
                >
                  <SaveIcon />
                  儲存
                </Button>
                <Button
                  type="button"
                  className="bg-destructive/70 hover:bg-destructive my-2 rounded-full text-white lg:w-[60px]"
                  onClick={handleCancel}
                >
                  取消
                </Button>
              </div>
            ) : (
              <Button type="button" className="my-3 flex w-full rounded-full lg:w-[120px]" onClick={goToConcertList}>
                演唱會列表
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
