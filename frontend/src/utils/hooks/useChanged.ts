import { useEffect, useRef, useState } from 'react';

export const useChanged = <T>(value: T): boolean => {
  const [isChanged, setIsChanged] = useState(false);
  const initialValue = useRef<T>();

  useEffect(() => {
    if (initialValue.current === undefined) {
      initialValue.current = value;
      return;
    }

    if (value !== initialValue.current) {
      setIsChanged(true);
    }
  }, [value]);

  return isChanged;
};
