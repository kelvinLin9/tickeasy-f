import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import { Checkbox } from "@/core/components/ui/checkbox";
import { TermsDialog } from "@/core/components/global/termsDialog";
import { useState, useEffect, useCallback } from "react";
import { useEmailValidation } from "@/core/hooks/useEmailValidation";
import { useRequest } from "@/core/hooks/useRequest";
import { useToast } from "@/core/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { SingleDatePicker } from "@/core/components/ui/singleDatePicker";

export function SignupSection() {
  const { toast } = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    password: "",
    confirmPassword: "",
    agreementService: false,
    agreementNewsletter: false,
  });
  // 檢查密碼是否一致
  const [isCheckedPassword, setIsCheckedPassword] = useState(false);
  const { setEmail, isValid, errorMessage: emailErrorMessage } = useEmailValidation();
  const [error, setError] = useState({
    name: {
      error: false,
      errorMessage: "",
    },
    phone: {
      error: false,
      errorMessage: "",
    },
    password: {
      error: false,
      errorMessage: "",
    },
    checkedPassword: {
      error: false,
      errorMessage: "",
    },
  });
  // 檢查手機號碼是否為10位數字 && 處理09XX-的-符號
  const checkPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedPhone = e.target.value.replace(/\D/g, "");
    setSignupData((prev) => ({ ...prev, phone: cleanedPhone }));
    if (cleanedPhone.length === 10) {
      setError((e) => ({ ...e, phone: { error: false, errorMessage: "" } }));
    } else {
      setError((e) => ({ ...e, phone: { error: true, errorMessage: "請輸入正確的手機號碼" } }));
    }
  };
  // 檢查密碼是否至少包含一個英文字母和一個數字，且長度至少為8個字符
  const isValidPassword = (pw: string) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pw);
  };
  const checkPassword = useCallback(() => {
    if (!signupData.password && !signupData.confirmPassword) {
      setError((e) => ({ ...e, checkedPassword: { error: false, errorMessage: "" } }));
      return;
    }
    if (!isValidPassword(signupData.password)) {
      setError((e) => ({ ...e, password: { error: true, errorMessage: "密碼必須包含至少一個英文字母和一個數字，且長度至少為8個字符" } }));
      return;
    } else {
      setError((e) => ({ ...e, password: { error: false, errorMessage: "" } }));
    }
    if (signupData.password && signupData.confirmPassword && signupData.password === signupData.confirmPassword) {
      setIsCheckedPassword(true);
      setError((e) => ({ ...e, checkedPassword: { error: false, errorMessage: "" } }));
    } else {
      setIsCheckedPassword(false);
      setError((e) => ({ ...e, checkedPassword: { error: true, errorMessage: "密碼不一致" } }));
    }
  }, [signupData.password, signupData.confirmPassword]);

  const { useCreate: requestSignup } = useRequest({
    queryKey: ["auth", "/api/v1/auth/register"],
    url: "/api/v1/auth/register",
  });
  const requestSignupMutation = requestSignup({
    onSuccess: (response) => {
      toast({
        title: "註冊成功",
        description: "請至您的信箱取得驗證碼",
      });
      // 將response的token和email設定到authStore
      const res = response as { token: string; user: { email: string } };
      setAuth(res.token, res.user.email);
      // 跳轉到會員中心進行信箱驗證
      navigate("/user/about/profile");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error.message || "註冊失敗，請稍後再試",
      });
    },
  });
  useEffect(() => {
    checkPassword();
  }, [checkPassword]);

  const handleSignup = () => {
    if (!signupData.name || !isValid || !isCheckedPassword || !signupData.agreementService) {
      return;
    }
    const data = {
      name: signupData.name,
      email: signupData.email,
      phone: signupData.phone,
      birthday: signupData.birthday,
      password: signupData.password,
    };
    requestSignupMutation.mutate(data);
  };

  return (
    <section className="flex w-full flex-col items-center justify-center p-8">
      <h2>會員註冊</h2>
      <div className="flex-column flex min-h-[450px] w-full max-w-md flex-col items-start">
        <Input
          type="text"
          label="姓名"
          id="username"
          required
          placeholder="請輸入您的全名"
          onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
        />
        {error["name"].error && <p className="text-sm text-red-500">{error["name"].errorMessage}</p>}
        <div className="relative w-full">
          <Input
            type="email"
            label="電子信箱"
            id="email"
            required
            placeholder="請輸入您的電子信箱"
            onChange={(e) => {
              setSignupData({ ...signupData, email: e.target.value });
              setEmail(e.target.value);
            }}
            error={emailErrorMessage ? true : false}
            errorMessage={emailErrorMessage}
          />
        </div>
        <div className="flex w-full flex-col items-center lg:flex-row">
          <Input
            type="tel"
            label="手機號碼"
            id="phone"
            placeholder="請輸入您的手機號碼"
            value={signupData.phone}
            onChange={(e) => {
              checkPhone(e);
            }}
          />
          <SingleDatePicker
            inputClassName="ml-1"
            date={signupData.birthday ? new Date(signupData.birthday) : null}
            setDate={(date) =>
              setSignupData((prev) => ({
                ...prev,
                birthday: date
                  ? date
                      .toLocaleDateString("zh-TW", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .split("/")
                      .join("-")
                  : "",
              }))
            }
            defaultMonth={new Date(new Date().setFullYear(new Date().getFullYear() - 20))}
            placeholder="請選擇出生年月日"
            disableFuture
          />
        </div>
        {error["phone"].error && <p className="text-sm text-red-500">{error["phone"].errorMessage}</p>}
        <Input
          type="password"
          label="密碼"
          id="password"
          required
          placeholder="請設定密碼"
          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
        />
        {error["password"].error && <p className="text-sm text-red-500">{error["password"].errorMessage}</p>}
        <Input
          type="password"
          label="確認密碼"
          id="rePassword"
          required
          placeholder="請再次輸入密碼"
          onChange={(e) => {
            setSignupData({ ...signupData, confirmPassword: e.target.value });
            checkPassword();
          }}
        />
        {error["checkedPassword"].error && <p className="text-sm text-red-500">{error["checkedPassword"].errorMessage}</p>}
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <Checkbox
          label={
            <>
              我已閱讀並同意
              <TermsDialog
                title="服務條款"
                trigger={
                  <Button variant="link" className="text-primary text-md h-auto p-0 hover:underline">
                    服務條款
                  </Button>
                }
                type="service"
              ></TermsDialog>
              及
              <TermsDialog
                title="隱私政策"
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
          checked={signupData.agreementService}
          onChange={(e) => setSignupData({ ...signupData, agreementService: e.target.checked })}
        />
        <Checkbox
          label="我願意接收最新演唱會資訊及優惠通知"
          id="agreementNewsletter"
          checked={signupData.agreementNewsletter}
          onChange={(e) => setSignupData({ ...signupData, agreementNewsletter: e.target.checked })}
        />
        <Button
          type="button"
          variant="gradient"
          className="my-5 w-full md:w-[50%]"
          onClick={handleSignup}
          disabled={!signupData.name || !isValid || !isCheckedPassword || !signupData.agreementService}
        >
          {requestSignupMutation.isPending ? "處理中..." : "立即註冊"}
        </Button>
      </div>
    </section>
  );
}
