import { useState } from "react";
import { UseCounterProps } from "../types/counter";

const useCounter = ({ initialValue = 0, min = -Infinity, max = Infinity }: UseCounterProps = {}) => {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    setCount((prev) => (prev < max ? prev + 1 : prev));
  };

  const decrement = () => {
    setCount((prev) => (prev > min ? prev - 1 : prev));
  };

  const reset = () => {
    setCount(initialValue);
  };

  return {
    count,
    increment,
    decrement,
    reset,
  };
};

export default useCounter;
