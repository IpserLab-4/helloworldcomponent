import styled from "@emotion/styled"
import React from "react"

const StyledCheckO = styled.i`
  & {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs, 1));
    width: 22px;
    height: 22px;
  }
  &::after {
    content: '';
    display: block;
    box-sizing: border-box;
    position: absolute;
    left: 3px;
    top: -1px;
    width: 6px;
    height: 10px;
    border-color: currentColor;
    border-width: 0 2px 2px 0;
    border-style: solid;
    transform-origin: bottom left;
    transform: rotate(45deg);
  }
`
export const Completed = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  (props, ref) => {
    return (
      <>
        <StyledCheckO {...props} ref={ref} icon-role="check-o" />
      </>
    )
  },
)
