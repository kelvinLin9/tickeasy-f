import { T_Password } from "../types/password";
import { useForm } from "react-hook-form";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
// import { ZodIssue } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdatePasswordSchema } from "../schema/updatePassword";

interface PasswordInfoProps {
  data: T_Password;
  onSubmit: (data: T_Password) => void;
  // errors: ZodIssue[];
  isSubmitting: boolean;
}
export default function PasswordInfo({ data, onSubmit, isSubmitting }: PasswordInfoProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors: formErrors },
  } = useForm({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: data,
  });

  return (
    <div className="">
      <form
        className="mx-auto w-full lg:w-[60%]"
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <div className="my-2 grid h-[60px] grid-cols-4 gap-2">
          <div className="col-span-1 flex h-full items-center justify-end">
            <p className="text-right font-bold">目前密碼</p>
          </div>
          <div className="col-span-3 flex">
            <Input
              height={60}
              type="password"
              id="oldPassword"
              {...register("oldPassword")}
              value={watch("oldPassword")}
              onChange={(e) => setValue("oldPassword", e.target.value, { shouldValidate: true })}
              className="max-w-[300px] disabled:cursor-not-allowed disabled:opacity-50"
              error={!!formErrors.oldPassword}
              errorMessage={formErrors.oldPassword?.message}
            />
          </div>
        </div>
        <div className="my-2 grid h-[60px] grid-cols-4 gap-2">
          <div className="col-span-1 flex h-full items-center justify-end">
            <p className="font-bold">新密碼</p>
          </div>
          <div className="col-span-3">
            <Input
              height={60}
              type="password"
              id="newPassword"
              {...register("newPassword")}
              value={watch("newPassword")}
              onChange={(e) => setValue("newPassword", e.target.value, { shouldValidate: true })}
              onBlur={() => trigger("newPassword")}
              className="max-w-[300px]"
              error={!!formErrors.newPassword}
              errorMessage={formErrors.newPassword?.message}
            />
          </div>
        </div>
        <div className="my-2 grid h-[60px] grid-cols-4 gap-2">
          <div className="col-span-1 flex h-full items-center justify-end">
            <p className="font-bold">確認新密碼</p>
          </div>
          <div className="col-span-3">
            <Input
              height={60}
              type="password"
              id="confirmPassword"
              {...register("confirmPassword")}
              value={watch("confirmPassword")}
              onChange={(e) => setValue("confirmPassword", e.target.value, { shouldValidate: true })}
              onBlur={() => trigger("confirmPassword")}
              className="max-w-[300px]"
              error={!!formErrors.confirmPassword}
              errorMessage={formErrors.confirmPassword?.message}
            />
          </div>
        </div>
        <div className="mt-10 flex justify-center gap-4 lg:mt-8">
          <Button type="submit" variant="default" disabled={isSubmitting} className="mx-auto w-full lg:w-[60%]">
            {isSubmitting ? "處理中..." : "修改密碼"}
          </Button>
        </div>
      </form>
    </div>
  );
}
