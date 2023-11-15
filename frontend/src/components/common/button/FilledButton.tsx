import React from "react";
import Color from "color";
import Link from "next/link";
import styled, { css } from "styled-components";
import { colors } from "utils/theme";
import { LoadingSpinner } from "../LoadingSpinner";

interface ButtonColorProps {
  backgroundColor: string;
  textColor: string;
  disableColor: string;
}

type ColorTheme = "primary" | "secondary" | "error" | "de-emphasis";

const generateButtonStyleProps = (buttonColorProps: ButtonColorProps) => {
  const color = Color(buttonColorProps.backgroundColor);

  return {
    $buttonColor: buttonColorProps.backgroundColor,
    $textColor: buttonColorProps.textColor,
    $disabledColor: buttonColorProps.disableColor,
    $shadowColor: Color({ alpha: 0.3, ...color.object() })
      .rgb()
      .string(),
  };
};

const convertColorThemeToColorProps = (
  colorTheme: ColorTheme
): ButtonColorProps => {
  switch (colorTheme) {
    case "primary":
      return {
        backgroundColor: colors.primary[700],
        textColor: "#fff",
        disableColor: colors.primary[200],
      };
    case "secondary":
      return {
        backgroundColor: colors.secondary[600],
        textColor: "#fff",
        disableColor: colors.secondary[200],
      };
    case "error":
      return {
        backgroundColor: colors.error[500],
        textColor: "#fff",
        disableColor: colors.error[200],
      };
    case "de-emphasis":
      return {
        backgroundColor: colors.primary[200],
        textColor: colors.secondary[800],
        disableColor: colors.primary[200],
      };
  }
};

interface Props {
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  loading?: boolean;
  colorTheme?: ColorTheme;
  customColor?: ButtonColorProps;
  long?: boolean;
  children?: React.ReactNode;
  className?: string;
  filledButtonRef?:
    | ((instance: HTMLButtonElement | null) => void)
    | React.RefObject<HTMLButtonElement>
    | null
    | undefined;
}

export const FilledButton: React.FC<Props> = ({
  onClick,
  href,
  type,
  disabled,
  loading,
  colorTheme = "primary",
  customColor,
  long,
  children,
  className,
  filledButtonRef,
}) => {
  const buttonColorProps = generateButtonStyleProps(
    customColor || convertColorThemeToColorProps(colorTheme)
  );
  if (href !== undefined) {
    return (
      <Link href={href} passHref>
        <StyledAnchor
          className={className}
          $long={!!long}
          {...buttonColorProps}
        >
          {children}
        </StyledAnchor>
      </Link>
    );
  }

  return (
    <StyledButton
      ref={filledButtonRef}
      type={type || "button"}
      disabled={disabled || loading}
      onClick={onClick}
      className={className}
      $long={!!long}
      {...buttonColorProps}
    >
      {children}
      {loading && (
        <LoadingOverlay {...buttonColorProps}>
          <LoadingSpinner size="1rem" color="#fff" />
        </LoadingOverlay>
      )}
    </StyledButton>
  );
};

const ButtonStyle = css<{
  $buttonColor: string;
  $shadowColor: string;
  $textColor: string;
  $disabledColor: string;
  $long: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  height: fit-content;

  padding: 0.5rem ${(p) => (p.$long ? "1.5rem" : "1rem")};
  border-radius: 6px;
  background: ${(p) => p.$buttonColor};
  box-shadow: 0 1px 3px 0 ${(p) => p.$shadowColor},
    0 1px 2px -1px ${(p) => p.$shadowColor};

  transition: 0.1s ${(p) => p.theme.easings.easeOut};

  color: ${(p) => p.$textColor};
  font-weight: bold;
  text-decoration: none;

  &:not([disabled]):hover {
    box-shadow: 0 10px 15px -3px ${(p) => p.$shadowColor},
      0 4px 6px -4px ${(p) => p.$shadowColor};
  }

  &[disabled] {
    box-shadow: none;
    opacity: 0.5;
    cursor: default;
  }
`;

const StyledAnchor = styled.a`
  ${ButtonStyle}
`;

const StyledButton = styled.button`
  ${ButtonStyle}
`;

const LoadingOverlay = styled.div<{ $buttonColor: string }>`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  bottom: 0.5rem;
  left: 0.5rem;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${(p) => p.$buttonColor};
`;
