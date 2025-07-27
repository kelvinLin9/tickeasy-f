import { z } from "zod";

export const UpdatePasswordSchema = z
  .object({
    oldPassword: z.string().min(8, "舊密碼至少需要8個字符"),
    newPassword: z
      .string()
      .min(8, "新密碼至少需要8個字符")
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]/, "密碼需要英數混合"),
    confirmPassword: z.string().min(8, "確認密碼至少需要8個字符"),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "新密碼不能與舊密碼相同",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "新密碼與確認密碼不匹配",
    path: ["confirmPassword"],
  });

// 定義TypeScript類型
export type T_UpdatePasswordSchema = z.infer<typeof UpdatePasswordSchema>;
