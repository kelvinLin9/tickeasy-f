import { useState, useEffect } from "react";
import { Button } from "@/core/components/ui/button";
import ProfileInfo from "../components/ProfileInfo";
import { T_Profile } from "../types/porfile";
import { UpdateProfileSchema } from "../schema/updateProfile";
import { ZodError } from "zod";
import { useRequest } from "@/core/hooks/useRequest";
import AlertError from "../components/AlertError";
import { UserResponse } from "../types/porfile";
import { useToast } from "@/core/hooks/useToast";
import LoadingSpin from "@/core/components/global/loadingSpin";
export default function Profile() {
  const [isEdit, setIsEdit] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState<string>("");
  const [showError, setShowError] = useState(false);
  const [profileData, setProfileData] = useState<T_Profile>({});
  const { data, isLoading, refetch } = useRequest<UserResponse>({
    url: "/api/v1/users/profile",
    queryKey: ["userInfo"],
  }).useGet();

  const { useUpdate: putProfile } = useRequest({
    url: "/api/v1/users/profile",
    queryKey: ["userInfo"],
  });
  const putProfileMutation = putProfile({
    onSuccess: () => {
      toast({
        title: "更新成功",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error.message || "更新失敗，請稍後再試",
      });
    },
  });

  useEffect(() => {
    if (isLoading || !data) return;
    const userData = Array.isArray(data) ? data[0] : data;
    if (userData.user) {
      setProfileData(userData.user);
    }
  }, [data, isLoading]);

  const handleSubmit = async (updatedData: T_Profile) => {
    try {
      // 使用 schema 驗證數據
      const validatedData = UpdateProfileSchema.parse(updatedData);
      await putProfileMutation.mutateAsync({ id: "", data: validatedData });
      // // 驗證通過後才執行更新
      setProfileData(validatedData);
      setIsEdit(false);
      window.scrollTo(0, 0);
    } catch (error: unknown) {
      // 處理 Zod 驗證錯誤
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => err.message).join("\n");
        setError(errorMessages);
        setShowError(true);
        return;
      }

      // 處理其他類型錯誤
      if (error instanceof Error) {
        setError(error.message);
        setShowError(true);
        return;
      }
    }
  };
  // 驗證碼驗證
  const [isVerifyingEmailCode, setIsVerifyingEmailCode] = useState(false);
  const [insertCode, setInsertCode] = useState("");
  const [isInertVerifyCode, setIsInertVerifyCode] = useState(false);
  const { useCreate: sendVerifyEmailCode } = useRequest({
    queryKey: ["auth", "verify-email"],
    url: "/api/v1/auth/verify-email",
  });
  const sendVerifyEmailCodeMutation = sendVerifyEmailCode({
    onSuccess: () => {
      toast({
        title: "成功",
        description: "信箱驗證成功",
      });
      setIsVerifyingEmailCode(false);
      setIsInertVerifyCode(false);
      setInsertCode("");
      setIsEdit(false);
      alert("信箱驗證成功");
      window.scrollTo(0, 0);
      refetch();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error.message || "驗證碼驗證失敗，請稍後再試",
      });
      setIsVerifyingEmailCode(false);
    },
  });
  const handleVerifyEmailCode = () => {
    setIsVerifyingEmailCode(true);
    sendVerifyEmailCodeMutation.mutate({ email: profileData.email, code: insertCode });
  };
  // 寄送驗證碼
  const [isSendingVerifyCode, setIsSendingVerifyCode] = useState(false);
  const { useCreate: resendVerifyCode } = useRequest({
    queryKey: ["auth", "resend-verification"],
    url: "/api/v1/auth/resend-verification",
  });
  const resendVerifyCodeMutation = resendVerifyCode({
    onSuccess: () => {
      toast({
        title: "成功",
        description: "驗證碼已發送",
      });
      setIsSendingVerifyCode(false);
      alert(`驗證碼已發送, 請至信箱 ${profileData.email} 查看`);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error.message || "發送驗證碼失敗，請稍後再試",
      });
      setIsSendingVerifyCode(false);
    },
  });
  const handleSendVerifyCode = () => {
    setIsSendingVerifyCode(true);
    resendVerifyCodeMutation.mutate({ email: profileData.email });
  };
  return (
    <>
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          <div className="mx-auto mt-10 flex h-[50px] w-full items-center justify-around gap-4 lg:mt-0 lg:w-[70%] lg:justify-start">
            <h4 className="text-2xl font-bold">基本資料</h4>
            {!isEdit && (
              <Button variant="outline" onClick={() => setIsEdit(true)} disabled={putProfileMutation.isPending}>
                修改會員資料
              </Button>
            )}
          </div>
          <ProfileInfo
            isEdit={isEdit}
            data={profileData}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsEdit(false);
              window.scrollTo(0, 0);
            }}
            isPending={putProfileMutation.isPending}
            handleSendVerifyCode={handleSendVerifyCode}
            isSendingVerifyCode={isSendingVerifyCode}
            isVerifyingEmailCode={isVerifyingEmailCode}
            insertCode={insertCode}
            setInsertCode={setInsertCode}
            handleVerifyEmailCode={handleVerifyEmailCode}
            isInertVerifyCode={isInertVerifyCode}
            setIsInertVerifyCode={setIsInertVerifyCode}
          />
          {/* 錯誤提示 */}
          <AlertError error={error} isOpen={showError} onClose={() => setShowError(false)} />
        </>
      )}
    </>
  );
}
