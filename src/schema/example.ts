import { z } from "zod";

// 定義category的可選值
const CategoryEnum = z.enum(["social", "ticketing", "crowdfunding", "subscriptions"]);

export const ExampleSchema = z.object({
  id: z.string().uuid("ID必須是有效的UUID格式"),
  category: CategoryEnum.describe("網站分類"),
  name: z.string().min(1, "網站名稱不能為空").max(100, "網站名稱不能超過100個字符"),
  url: z.string().url("請輸入有效的URL地址").min(1, "URL不能為空"),
  description: z.string().min(10, "描述至少需要10個字符").max(500, "描述不能超過500個字符"),
});

// 用於創建新項目的Schema（不需要id）
export const CreateExampleSchema = ExampleSchema.omit({ id: true });

// 定義TypeScript類型
export type T_ExampleSchema = z.infer<typeof ExampleSchema>;
