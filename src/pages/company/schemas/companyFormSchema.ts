import * as z from "zod";

export const companyFormSchema = z.object({
  orgName: z.string().min(1, "公司名稱為必填"),
  orgContact: z.string().min(1, "聯絡人姓名為必填"),
  orgAddress: z.string().min(1, "公司地址為必填"),
  orgMobile: z.string().min(1, "聯絡人電話為必填"),
  orgMail: z.string().email("請輸入有效的電子郵件"),
  orgPhone: z.string().regex(/^0\d{1}-\d{7}$/, "公司電話必須為 0X-XXXXXXX 格式"),
  orgWebsite: z.string().optional(),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;
