import { createContext } from 'react';

interface ValidationContextValue {
  register: (id: string, isValid: boolean) => void;
  unregister: (id: string) => void;
}

export const ValidationContext = createContext<ValidationContextValue>({
  register: () => void 0,
  unregister: () => void 0,
});
