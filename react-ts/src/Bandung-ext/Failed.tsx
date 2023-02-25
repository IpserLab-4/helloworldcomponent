import styled from "@emotion/styled"
import React from "react"

const StyledCloseO = styled.i`
  & {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs, 1));
    width: 22px;
    height: 22px;
  }
  &::after,
  &::before {
    content: '';
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 12px;
    height: 2px;
    background: currentColor;
    transform: rotate(45deg);
    border-radius: 5px;
    top: 8px;
    left: 3px;
  }
  &::after {
    transform: rotate(-45deg);
  }
`
export const Failed = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  (props, ref) => {
    return (
      <>
        <StyledCloseO {...props} ref={ref} icon-role="close-o" />
      </>
    )
  },
)