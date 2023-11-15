import React, { useCallback, useMemo, useRef } from "react";
import { ValidationContext } from "contexts/ValidationContext";

interface Props {
  onSubmit?: () => void;
  onValidated: (isValid: boolean) => void;
  autoComplete?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * バリデーション機能を持つフォームを提供するコンポーネント
 * このフォームの子孫要素にあるインプットコンポーネントのバリデーションを自動で行い、結果をonValidatedプロパティに渡す
 *
 * @example
 * ```
 * <ValidatableForm
 *   onSubmit={onSubmit}
 *   onValidated={setValid}
 * >
 *   <TextArea
 *      value={text}
 *      onChange={setText}
 *      rules={[stringNotEmpty()]}
 *   />
 * </ValidatableForm>
 * ```
 */
export const ValidatableForm: React.FC<Props> = ({
  onSubmit,
  onValidated,
  autoComplete,
  className,
  children,
}) => {
  const inputs = useRef(new Map<string, boolean>());

  const notifyValidation = useCallback(() => {
    onValidated(!Array.from(inputs.current.values()).includes(false));
  }, [onValidated]);

  const register = useCallback(
    (id: string, isValid: boolean) => {
      if (inputs.current.get(id) === isValid) {
        return;
      }
      inputs.current.set(id, isValid);
      notifyValidation();
    },
    [notifyValidation]
  );

  const unregister = useCallback(
    (id: string) => {
      if (!inputs.current.has(id)) {
        return;
      }
      inputs.current.delete(id);
      notifyValidation();
    },
    [notifyValidation]
  );

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      autoComplete={autoComplete ? "on" : "off"}
    >
      <ValidationContext.Provider
        value={useMemo(
          () => ({
            register,
            unregister,
          }),
          [register, unregister]
        )}
      >
        {children}
      </ValidationContext.Provider>
    </form>
  );
};
