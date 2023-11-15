import React from 'react';
import styled, { keyframes } from 'styled-components';

interface Props {
  size?: string;
  color?: string;
  strokeWidth?: string;
  className?: string;
}
export const LoadingSpinner: React.FC<Props> = ({
  size = '1em',
  color = '#000',
  strokeWidth = '3px',
  className,
}) => {
  return (
    <Svg
      viewBox="0 0 24 24"
      style={{ width: size, height: size }}
      className={className}
    >
      <Circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        strokeMiterlimit="10"
        style={{
          stroke: color,
          strokeWidth: strokeWidth,
        }}
      />
    </Svg>
  );
};

const RotateKeyframes = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const DashKeyframes = keyframes`
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 45, 200;
    stroke-dashoffset: -17px;
  }
  100% {
    stroke-dasharray: 45, 200;
    stroke-dashoffset: -62px;
  }
`;

const Svg = styled.svg`
  display: block;
  width: 1em;
  height: 1em;
  animation: ${RotateKeyframes} 2s linear 0s infinite forwards;
`;

const Circle = styled.circle`
  animation: ${DashKeyframes} 1.5s ease-in-out 0s infinite forwards;
`;
