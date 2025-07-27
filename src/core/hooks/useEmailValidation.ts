import { useState, useCallback } from "react";

interface UseEmailValidationReturn {
  email: string;
  setEmail: (value: string) => void;
  isValid: boolean;
  errorMessage: string;
}

export const useEmailValidation = (initialEmail = ""): UseEmailValidationReturn => {
  const [email, setEmail] = useState(initialEmail);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = useCallback((value: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(value);
  }, []);

  const handleEmailChange = useCallback(
    (value: string) => {
      setEmail(value);
      if (value === "") {
        setIsValid(true);
        setErrorMessage("");
        return;
      }
      const isValidEmail = validateEmail(value);
      setIsValid(isValidEmail);
      setErrorMessage(isValidEmail ? "" : "請輸入有效的電子郵件地址");
    },
    [validateEmail]
  );

  return {
    email,
    setEmail: handleEmailChange,
    isValid,
    errorMessage,
  };
};
