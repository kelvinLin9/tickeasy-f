import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import { GoogleButton } from "./googleButton";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { ModalStatusContext } from "@/context/modalStatusContext";
import { useRequest } from "@/core/hooks/useRequest";
import { useToast } from "@/core/hooks/useToast";
import { useEmailValidation } from "@/core/hooks/useEmailValidation";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface LoginResponse {
  token: string;
  user: {
    email: string;
    role: string;
  };
}
export function LoginSection() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setCookie = useAuthStore((state) => state.setCookie);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { loginData, setLoginData, setIsModalForgotPasswordActive } = useContext(ModalStatusContext)!; // 使用 context
  const { email, setEmail, isValid: isEmailValid, errorMessage: emailErrorMessage } = useEmailValidation(loginData.email);
  const [touched, setTouched] = useState(false);

  const { useCreate: requestLogin } = useRequest({
    queryKey: ["auth", "request-password-reset"],
    url: "/api/v1/auth/login",
  });

  const requestLoginMutation = requestLogin({
    onSuccess: (response) => {
      const res = response as LoginResponse;
      // 將 token 存在 cookie 中
      setCookie(res.token);

      // 只將非敏感資訊存在 localStorage
      setAuth(res.user.email, res.user.role); // ✅ 存進 authStore

      toast({
        title: "登入成功",
      });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error.message || "登入失敗，請稍後再試",
      });
    },
  });

  const handleLogin = () => {
    if (!isEmailValid) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: emailErrorMessage || "請輸入有效的電子郵件地址",
      });
      return;
    }
    requestLoginMutation.mutate({
      email: loginData.email,
      password: loginData.password,
    });
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setLoginData({ ...loginData, email: value });
  };
  return (
    <section className="flex w-full flex-col items-center justify-center p-8">
      <h2>會員登入</h2>
      <GoogleButton />
      <div className="flex-column flex min-h-[200px] w-full max-w-md flex-col items-center justify-center md:px-8">
        <Input
          type="text"
          label="帳號(Email)"
          id="account"
          placeholder="輸入帳號(Email)"
          value={email}
          onBlur={(e) => {
            // 在失去焦點時進行 trim
            handleEmailChange(e.target.value.trim());
            setTouched(true);
          }}
          onChange={(e) => {
            handleEmailChange(e.target.value);
            setTouched(true);
          }}
          error={touched && !isEmailValid}
          errorMessage={touched ? emailErrorMessage : ""}
        />

        <Input
          type="password"
          label="密碼"
          id="password"
          placeholder="輸入密碼"
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          className="mb-1 w-full"
        />
        <Button
          type="button"
          variant="link"
          className="block size-2 w-full p-0 pb-5 pl-2 text-left text-xs text-red-500"
          onClick={() => setIsModalForgotPasswordActive(true)} // 呼叫 context 中的 setter
        >
          忘記密碼?
        </Button>

        <Button type="button" variant="gradient" className="my-5 w-full md:w-[80%]" onClick={handleLogin}>
          {requestLoginMutation.isPending ? "處理中" : "登入"}
        </Button>
      </div>
      <div className="flex">
        <p className="mr-2">尚未註冊?</p>
        <Link to="/signup" className="text-primary hover:underline hover:underline-offset-5">
          進行註冊
        </Link>
      </div>
    </section>
  );
}
