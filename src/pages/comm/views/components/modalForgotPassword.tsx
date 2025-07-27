import React from "react";
import { Button } from "@/core/components/ui/button";
import { X } from "lucide-react";
import { useContext } from "react";
import { ModalStatusContext } from "@/context/modalStatusContext"; // 引入 context
import { useRequest } from "@/core/hooks/useRequest";
import { useToast } from "@/core/hooks/useToast";

interface ModalForgotPasswordProps {
  children: React.ReactElement<{ passwordError?: string }>;
  active: boolean;
}

export function ModalForgotPassword({ children, active }: ModalForgotPasswordProps) {
  const { setIsModalForgotPasswordActive, email, isResetPassword, setIsResetPassword, resetPasswordData } = useContext(ModalStatusContext)!; // 使用自定義的 hook 來獲取 context

  const { toast } = useToast();
  const [passwordError, setPasswordError] = React.useState("");

  const { useCreate: requestPasswordReset } = useRequest({
    queryKey: ["auth", "request-password-reset"],
    url: "/api/v1/auth/request-password-reset",
  });

  const { useCreate: resetPassword } = useRequest({
    queryKey: ["auth", "reset-password"],
    url: "/api/v1/auth/reset-password",
  });

  const requestPasswordResetMutation = requestPasswordReset({
    onSuccess: () => {
      setIsResetPassword(true);
      toast({
        title: "成功",
        description: "已發送重設密碼驗證碼到您的信箱",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error.message || "請求重設密碼失敗，請稍後再試",
      });
    },
  });

  const resetPasswordMutation = resetPassword({
    onSuccess: () => {
      setIsModalForgotPasswordActive(false);
      setIsResetPassword(false);
      toast({
        title: "成功",
        description: "密碼已重設成功",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error.message || "重設密碼失敗，請確認驗證碼是否正確",
      });
    },
  });

  if (!active) return null;

  const handleConfirm = () => {
    if (isResetPassword) {
      // 檢查兩次輸入的密碼是否相同
      if (resetPasswordData.newPassword !== resetPasswordData.reNewPassword) {
        setPasswordError("兩次輸入的密碼不相同");
        return;
      }
      setPasswordError("");
      // 發送重設新密碼的請求
      resetPasswordMutation.mutate({
        email: email,
        code: resetPasswordData.verifiedCode,
        newPassword: resetPasswordData.newPassword,
      });
    } else {
      if (!email) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "請輸入註冊信箱",
        });
        return;
      }
      // 發送請求重設密碼的請求
      requestPasswordResetMutation.mutate({
        email: email,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 my-5 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-[80%] overflow-y-auto rounded-lg bg-white px-5 py-4 md:w-[30%] md:p-5">
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            className="p-0 transition-transform duration-500 hover:rotate-[360deg] [&_svg]:size-6"
            onClick={() => setIsModalForgotPasswordActive(false)} // 使用context來關閉Modal
          >
            <X />
          </Button>
        </div>
        <div className="mx-auto flex w-[60%] flex-col items-center justify-center md:w-[80%]">{React.cloneElement(children, { passwordError })}</div>

        <Button
          type="button"
          variant="gradientVertical"
          className="mx-auto mb-3 block w-[30%] md:w-[100px]"
          onClick={handleConfirm}
          disabled={requestPasswordResetMutation.isPending || resetPasswordMutation.isPending}
        >
          {requestPasswordResetMutation.isPending || resetPasswordMutation.isPending ? "處理中..." : "確認"}
        </Button>
      </div>
    </div>
  );
}
