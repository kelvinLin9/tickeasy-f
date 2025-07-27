import { Input } from "@/core/components/ui/input";
import { useContext } from "react";
import { ModalStatusContext } from "@/context/modalStatusContext";

import { usePasswordValidation } from "@/core/hooks/usePasswordValidation";

interface ResetPasswordProps {
  passwordError?: string;
}

export function ResetPassword({ passwordError }: ResetPasswordProps) {
  const { resetPasswordData, setResetPasswordData } = useContext(ModalStatusContext)!;
  const { setPassword, setConfirmPassword, passwordErrorMessage, confirmPasswordErrorMessage, checkPasswordFormat } = usePasswordValidation();

  const handleSetItems = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "newPassword") {
      setPassword(value.trim());
      checkPasswordFormat(value.trim());
    } else if (id === "reNewPassword") {
      setConfirmPassword(value.trim());
    }
    setResetPasswordData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleValidatePassword = () => {
    setPassword(resetPasswordData.newPassword);
    setConfirmPassword(resetPasswordData.reNewPassword);
  };

  return (
    <>
      <div className="w-full px-5">
        <Input type="text" label="" id="verifiedCode" value={resetPasswordData.verifiedCode} placeholder="請輸入驗證碼" onChange={handleSetItems} />
        <div className="relative">
          <Input
            type="password"
            label=""
            id="newPassword"
            value={resetPasswordData.newPassword}
            placeholder="請輸入新密碼"
            onChange={handleSetItems}
            onBlur={handleValidatePassword}
            error={!!passwordErrorMessage}
          />
          {passwordErrorMessage && <p className="absolute -bottom-5 left-0 text-sm text-red-500">{passwordErrorMessage}</p>}
        </div>
        <div className="relative">
          <Input
            type="password"
            label=""
            id="reNewPassword"
            value={resetPasswordData.reNewPassword}
            placeholder="請再次輸入新密碼"
            onChange={handleSetItems}
            onBlur={handleValidatePassword}
            error={!!confirmPasswordErrorMessage || !!passwordError}
          />
          {(confirmPasswordErrorMessage || passwordError) && (
            <p className="absolute -bottom-5 left-0 text-sm text-red-500">{confirmPasswordErrorMessage || passwordError}</p>
          )}
        </div>
      </div>
    </>
  );
}
