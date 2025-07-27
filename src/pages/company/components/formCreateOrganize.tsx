import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import { Checkbox } from "@/core/components/ui/checkbox";
import documentAdd from "@/assets/images/documentAdd.jpg";
import { useCreateOrganizer } from "../hook/useCreateOrganizerContext";
import { TermsDialog } from "@/core/components/global/termsDialog";
import { useRequest } from "@/core/hooks/useRequest";
import { useToast } from "@/core/hooks/useToast";
import { CreateOrganizeData } from "../types/company";
import { useState } from "react";

// 定義表單驗證 schema
const formSchema = z.object({
  orgName: z.string().trim().min(1, "公司名稱為必填"),
  orgContact: z.string().trim().min(1, "聯絡人姓名為必填"),
  orgAddress: z.string().trim().min(1, "公司地址為必填"),
  orgMobile: z.string().trim().min(1, "聯絡人電話為必填"),
  orgMail: z.string().trim().email("請輸入有效的電子郵件"),
  orgPhone: z
    .string()
    .trim()
    .regex(/^0\d{8,9}$/, "必須為 0 開頭的 9 或 10 碼數字"),
  orgWebsite: z.string().trim().optional(),
  agreementService: z.boolean().refine((val) => val === true, {
    message: "請同意服務條款及隱私政策",
  }),
});
type FormValues = z.infer<typeof formSchema>;

interface CreateOrganizeResponse {
  organization: CreateOrganizeData;
}

type FormFieldName = keyof FormValues;

const formItems: {
  type: string;
  id: FormFieldName;
  label: string;
  placeholder: string;
  required?: boolean;
}[] = [
  {
    type: "text",
    id: "orgName",
    label: "公司名稱",
    placeholder: "想放假無限公司",
    required: true,
  },
  {
    type: "text",
    id: "orgContact",
    label: "聯絡人姓名",
    placeholder: "小明",
    required: true,
  },
  {
    type: "text",
    id: "orgAddress",
    label: "公司地址",
    placeholder: "台北市中山區XXXXX",
    required: true,
  },
  {
    type: "tel",
    id: "orgMobile",
    label: "聯絡人電話",
    placeholder: "請輸入聯絡人電話",
    required: true,
  },
  {
    type: "email",
    id: "orgMail",
    label: "電子郵件",
    placeholder: "abcdefg@xx.com",
    required: true,
  },
  {
    type: "tel",
    id: "orgPhone",
    label: "公司電話",
    placeholder: "02-12345678",
    required: true,
  },
  {
    type: "text",
    id: "orgWebsite",
    label: "公司網站",
    placeholder: "(選填)",
  },
];

export default function FormCreateOrganize() {
  const { toast } = useToast();
  const { setIsCreateOrganize } = useCreateOrganizer();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orgName: "",
      orgContact: "",
      orgAddress: "",
      orgMobile: "",
      orgMail: "",
      orgPhone: "",
      orgWebsite: "",
      agreementService: false,
    },
  });
  const [isHandlingCreateOrganizer, setIsHandlingCreateOrganizer] = useState(false);
  // 串接 建立舉辦者的API
  const { useCreate: requestCreateOrganize } = useRequest({
    queryKey: ["organizations"],
    url: "/api/v1/organizations",
  });

  const requestCreateOrganizeMutation = requestCreateOrganize({
    onSuccess: (response) => {
      setIsHandlingCreateOrganizer(false);
      const res = response as CreateOrganizeResponse;
      if (res.organization) {
        toast({
          title: "成功",
          description: "建立成功",
        });
        setIsCreateOrganize(false);
      }
    },
    onError: (error: Error) => {
      setIsHandlingCreateOrganizer(false);
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error.message || "建立失敗，請稍後再試",
      });
    },
  });
  const onSubmit = (data: FormValues) => {
    setIsHandlingCreateOrganizer(true);
    // 在這裡處理表單提交邏輯
    requestCreateOrganizeMutation.mutate(data);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumber = e.target.value.replace(/\D/g, ""); // 只保留數字
    e.target.value = onlyNumber;
  };
  return (
    <div className="mx-auto h-full w-full lg:w-[40%]">
      <div className="border-grey-500 rounded-sm border-2 px-8 py-4 lg:relative">
        <div className="flex justify-center lg:absolute lg:top-20 lg:-left-20">
          <img src={documentAdd} alt="Create Organizer" style={{ maxHeight: "200px" }} />
        </div>
        <div className="mt-5 lg:ml-30">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {formItems.map((item) => (
                <div key={item.id} className="flex flex-col">
                  <Input
                    labelClass="text-start"
                    type={item.type}
                    id={item.id}
                    label={item.label}
                    placeholder={item.placeholder}
                    required={item.required}
                    {...register(item.id, { required: item.required })}
                    error={!!errors[item.id as keyof FormValues]}
                    errorMessage={errors[item.id as keyof FormValues]?.message}
                    onChange={item.id === "orgPhone" ? handlePhoneChange : undefined}
                  />
                </div>
              ))}
            </div>
            <div>
              <Checkbox
                label={
                  <>
                    我已閱讀並同意
                    <TermsDialog
                      trigger={
                        <Button variant="link" className="text-primary text-md h-auto p-0 hover:underline">
                          服務條款
                        </Button>
                      }
                      type="service"
                    ></TermsDialog>
                    及
                    <TermsDialog
                      trigger={
                        <Button variant="link" className="text-primary text-md h-auto p-0 hover:underline">
                          隱私政策
                        </Button>
                      }
                      type="privacy"
                    ></TermsDialog>
                  </>
                }
                id="agreementService"
                required
                {...register("agreementService")}
                error={!!errors.agreementService}
                errorMessage={errors.agreementService?.message}
              />
              {/* {errors.agreementService && <p className="pl-2 text-sm text-red-500">{errors.agreementService.message}</p>} */}
            </div>
            <div className="flex justify-between gap-4">
              <Button
                type="submit"
                disabled={isHandlingCreateOrganizer}
                className="bg-primary flex-start my-2 flex w-full rounded-full text-white lg:w-[200px]"
              >
                建立
                {isHandlingCreateOrganizer ? "處理中" : "建立"}
              </Button>
              <Button
                type="button"
                className="bg-destructive/70 hover:bg-destructive my-2 rounded-full text-white"
                onClick={() => setIsCreateOrganize(false)}
              >
                取消
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
