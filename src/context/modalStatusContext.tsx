import { createContext, useState, ReactNode } from "react";

interface ModalStatusContextType {
  isModalForgotPasswordActive: boolean;
  setIsModalForgotPasswordActive: (value: boolean) => void;
  isResetPassword: boolean;
  setIsResetPassword: (value: boolean) => void;
  loginData: {
    email: string;
    password: string;
  };
  setLoginData: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
  email: string;
  setEmail: (value: string) => void;
  resetPasswordData: {
    verifiedCode: string;
    newPassword: string;
    reNewPassword: string;
  };
  setResetPasswordData: React.Dispatch<
    React.SetStateAction<{
      verifiedCode: string;
      newPassword: string;
      reNewPassword: string;
    }>
  >;
  resetLoginData: () => void;
}

export const ModalStatusContext = createContext<ModalStatusContextType | null>(null);

export function ModalStatusProvider({ children }: { children: ReactNode }) {
  const [isModalForgotPasswordActive, setIsModalForgotPasswordActive] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [email, setEmail] = useState("");
  const [resetPasswordData, setResetPasswordData] = useState({
    verifiedCode: "",
    newPassword: "",
    reNewPassword: "",
  });
  const resetLoginData = () => {
    setLoginData({ email: "", password: "" });
    setEmail("");
  };
  return (
    <ModalStatusContext.Provider
      value={{
        isModalForgotPasswordActive,
        setIsModalForgotPasswordActive,
        isResetPassword,
        setIsResetPassword,
        loginData,
        setLoginData,
        email,
        setEmail,
        resetPasswordData,
        setResetPasswordData,
        resetLoginData,
      }}
    >
      {children}
    </ModalStatusContext.Provider>
  );
}
