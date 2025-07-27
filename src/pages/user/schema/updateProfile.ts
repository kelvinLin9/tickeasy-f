import { z } from "zod";

// 定義性別的可選值
const GenderEnum = z.enum(["男", "女", "其他"]);

export const UpdateProfileSchema = z.object({
  email: z.string().email("請輸入有效的電子信箱"),
  name: z.string().min(0).max(20, "姓名不能超過20個字符").nullable().optional(),
  nickname: z.string().min(0).max(20, "暱稱不能超過20個字符").nullable().optional(),
  phone: z
    .union([
      z.string().length(0, "請輸入有效的手機號碼（格式：09xxxxxxxx）"),
      z.string().regex(/^09\d{8}$/, "請輸入有效的手機號碼（格式：09xxxxxxxx）"),
    ])
    .nullable()
    .optional(),
  birthday: z.string().nullable().optional(),
  gender: GenderEnum.nullable().optional(),
  preferredRegions: z.array(z.string()).optional(),
  preferredEventTypes: z.array(z.string()).optional(),
  country: z.string().nullable().optional(),
  address: z.string().max(50, "地址不能超過50個字符").nullable().optional(),
  avatar: z
    .union([z.string().url("請輸入有效的圖片URL"), z.string().max(0)])
    .nullable()
    .optional(),
});

// 定義TypeScript類型
export type T_UpdateProfileSchema = z.infer<typeof UpdateProfileSchema>;
