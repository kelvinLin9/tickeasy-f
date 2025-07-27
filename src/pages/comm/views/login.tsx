import { Layout } from "./layout";
import { Input } from "@/core/components/ui/input";
import { ImageSection } from "./components/imageSection";
import { LoginSection } from "./components/loginSection";
import { ModalForgotPassword } from "./components/modalForgotPassword";
import { ResetPassword } from "./components/resetPassword";
import login from "@/assets/images/undraw_login_weas.svg";
import { ModalStatusContext } from "@/context/modalStatusContext";
import { useAuthStore } from "@/store/authStore";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/core/hooks/useToast";
import { useEmailValidation } from "@/core/hooks/useEmailValidation";

export default function Login() {
  const navigate = useNavigate();
  const context = useContext(ModalStatusContext);
  const isLogin = useAuthStore((state) => state.isLogin);
  const { email, setEmail, isValid: isEmailValid, errorMessage: emailErrorMessage } = useEmailValidation(context?.email ?? "");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (isLogin) {
      toast({
        title: "你已登入",
        description: "將回到首頁",
      });
      navigate("/");
    }
  }, []);

  return (
    <Layout>
      <ModalForgotPassword active={context?.isModalForgotPasswordActive ?? false}>
        {context?.isResetPassword ? (
          <ResetPassword />
        ) : (
          <Input
            type="email"
            label=""
            id="email"
            value={email}
            onBlur={(e) => {
              setEmail(e.target.value.trim());
              context?.setEmail?.(e.target.value.trim());
              setTouched(true);
            }}
            onChange={(e) => {
              setEmail(e.target.value.trim());
              context?.setEmail?.(e.target.value.trim());
              setTouched(true);
            }}
            placeholder="請輸入註冊信箱"
            error={touched && !isEmailValid}
            errorMessage={touched ? emailErrorMessage : ""}
          />
        )}
      </ModalForgotPassword>
      <div className="flex grid h-[calc(70vh-3rem)] w-full grid-cols-1 items-center md:h-[calc(90vh-4rem)] md:grid-cols-2">
        <ImageSection imageUrl={login} alt="logIn" />
        <LoginSection />
      </div>
    </Layout>
  );
}
