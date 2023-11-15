import React, {
  CSSProperties,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { ValidateRule, useValidation } from "utils/hooks/useValidation";
import { useChanged } from "utils/hooks/useChanged";

export interface Props {
  value: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  placeholder?: string | ReactElement;
  rightIcon?: ReactElement;
  id?: string;
  type?: string;
  rules?: ValidateRule<string>[];
  error?: string;
  lazyError?: boolean;
  autoFocus?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  passIcon?: boolean;
  className?: string;
  style?: CSSProperties;
  autoComplete?: string;
}
export const TextField: React.FC<Props> = ({
  value,
  onChange,
  onFocus,
  placeholder,
  rightIcon,
  id,
  type,
  rules = [],
  error,
  lazyError = true,
  autoFocus,
  readOnly,
  disabled,
  className,
  style,
  autoComplete,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const { errorMessage, validate } = useValidation(value, rules);
  const isChanged = useChanged(value);
  const [didBlur, setDidBlur] = useState(false);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const shouldShowError = !lazyError || isChanged || didBlur;
  const mergedErrorMessage = shouldShowError
    ? error || errorMessage
    : undefined;

  return (
    <div style={style}>
      <Container>
        <Input
          className={className}
          id={id}
          type={type === "password" && !isPasswordHidden ? "text" : type}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => {
            onFocus?.();
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setDidBlur(true);
            validate();
          }}
          readOnly={readOnly}
          disabled={disabled}
          ref={inputRef}
        />
        {placeholder != null && !isFocused && !value && (
          <Placeholder>{placeholder}</Placeholder>
        )}
        {rightIcon != null && type !== "password" && (
          <RightIconWrapper>{rightIcon}</RightIconWrapper>
        )}
      </Container>
      {mergedErrorMessage && <ErrorMessage>{mergedErrorMessage}</ErrorMessage>}
    </div>
  );
};

const Container = styled.div`
  position: relative;
  border-radius: 6px;
  background: ${(p) => p.theme.colors.gray[100]};
  color: ${(p) => p.theme.colors.text.base};
`;

const Input = styled.input`
  display: block;

  width: 100%;
  padding: 0.5rem 0.75rem;

  &:focus {
    background: #fff;
  }
  &:disabled,
  &:read-only {
    color: ${(p) => p.theme.colors.text.light};
  }
  ::-ms-reveal,
  ::-ms-clear {
    display: none;
  }
`;

const Placeholder = styled.span`
  position: absolute;
  top: 0.5rem;
  left: 0.75rem;
  pointer-events: none;

  color: ${(p) => p.theme.colors.text.light};
`;

const ToggleVisibilityWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  color: ${(p) => p.theme.colors.text.light};
`;

const RightIconWrapper = styled(ToggleVisibilityWrapper)`
  display: flex;
  align-items: center;
  height: 100%;
  padding-right: 0.5rem;
`;

const ErrorMessage = styled.p`
  max-width: 100%;
  margin-top: 0.25rem;
  padding-left: 0.75rem;
  background: #fff;

  color: ${(p) => p.theme.colors.error[600]};
  font-size: 0.75rem;
  line-height: 1.5em;
  overflow: hidden;
  text-overflow: ellipsis;
`;
