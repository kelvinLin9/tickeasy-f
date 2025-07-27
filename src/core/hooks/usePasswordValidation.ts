import { useState, useCallback } from "react";

interface UsePasswordValidationReturn {
  password: string;
  confirmPassword: string;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  isValid: boolean;
  passwordErrorMessage: string;
  confirmPasswordErrorMessage: string;
  checkPasswordFormat: (value: string) => boolean;
}

export const usePasswordValidation = (): UsePasswordValidationReturn => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");

  const validatePassword = useCallback((pass: string) => {
    if (pass === "") {
      return { isValid: true, message: "" };
    }

    // 檢查密碼是否包含英文字和數字
    const hasLetter = /[a-zA-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);

    if (!hasLetter || !hasNumber) {
      return { isValid: false, message: "密碼必須包含英文字和數字" };
    }

    return { isValid: true, message: "" };
  }, []);

  const validateConfirmPassword = useCallback((pass: string, confirm: string) => {
    if (confirm === "") {
      return { isValid: true, message: "" };
    }

    if (pass !== confirm) {
      return { isValid: false, message: "兩次輸入的密碼不相同" };
    }

    return { isValid: true, message: "" };
  }, []);

  const handlePasswordChange = useCallback(
    (value: string) => {
      setPassword(value);
      const { isValid: isPassValid, message } = validatePassword(value);
      setPasswordErrorMessage(message);

      // 同時驗證確認密碼
      const { isValid: isConfirmValid, message: confirmMessage } = validateConfirmPassword(value, confirmPassword);
      setConfirmPasswordErrorMessage(confirmMessage);

      setIsValid(isPassValid && isConfirmValid);
    },
    [confirmPassword, validatePassword, validateConfirmPassword]
  );

  const handleConfirmPasswordChange = useCallback(
    (value: string) => {
      setConfirmPassword(value);
      const { isValid: isConfirmValid, message } = validateConfirmPassword(password, value);
      setConfirmPasswordErrorMessage(message);
      setIsValid(isConfirmValid && passwordErrorMessage === "");
    },
    [password, passwordErrorMessage, validateConfirmPassword]
  );

  // 新增一個函數來檢查密碼格式
  const checkPasswordFormat = useCallback(
    (value: string) => {
      const { isValid: isPassValid, message } = validatePassword(value);
      setPasswordErrorMessage(message);
      return isPassValid;
    },
    [validatePassword]
  );

  return {
    password,
    confirmPassword,
    setPassword: handlePasswordChange,
    setConfirmPassword: handleConfirmPasswordChange,
    isValid,
    passwordErrorMessage,
    confirmPasswordErrorMessage,
    checkPasswordFormat,
  };
};
