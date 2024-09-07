import { useRef, useCallback } from "react";

type DebounceParams<TParams extends any[]> = {
  func: (...args: TParams) => void;
  delay?: number;
};

const useDebounce = <TParams extends any[]>({
  func,
  delay = 300,
}: DebounceParams<TParams>) => {
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = useCallback(
    (...args: TParams) => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      timeoutIdRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    },
    [func, delay]
  );

  return debouncedFunction;
};

export default useDebounce;
