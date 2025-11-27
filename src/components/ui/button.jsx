import styled, { css } from 'styled-components'
import { forwardRef } from 'react'

const variantStyles = {
  primary: css`
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    color: #fff;
    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.35);
    &:hover {
      filter: brightness(1.05);
    }
  `,
  secondary: css`
    background: rgba(148, 163, 184, 0.15);
    color: #e2e8f0;
    border: 1px solid rgba(148, 163, 184, 0.3);
    &:hover {
      background: rgba(148, 163, 184, 0.25);
    }
  `
}

const sizeStyles = {
  md: css`
    padding: 0.85rem 1.5rem;
    font-size: 1rem;
  `,
  lg: css`
    padding: 1.1rem 1.6rem;
    font-size: 1.05rem;
  `
}

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: transform 0.12s ease, filter 0.15s ease;
  ${({ $variant }) => variantStyles[$variant] || variantStyles.primary};
  ${({ $size }) => sizeStyles[$size] || sizeStyles.md};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &:active {
    transform: translateY(1px);
  }
`

export const Button = forwardRef(({ variant = 'primary', size = 'md', ...props }, ref) => (
  <StyledButton ref={ref} $variant={variant} $size={size} {...props} />
))

Button.displayName = 'Button'
