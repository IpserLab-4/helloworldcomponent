import styled from "@emotion/styled"
import React from "react";



export const LoadingBar : React.FunctionComponent<ProgressBarProps> = (props) => {
  const { value, max, loadingBarColor, width } = props;
  const color = loadingBarColor || "#4e1d78";
  return (
    <Container color={loadingBarColor} width={width}>
      <progress value={value} max={max} />
      {/* <span>{(value / max) * 100}%</span> */}
    </Container>
  );
};

const Container = styled.div<Partial<ProgressBarProps>>`
 
  progress {
    margin-bottom: 0px;
  }

  progress[value] {
    width: ${props => props.width};

    -webkit-appearance: none;
    appearance: none;
  }

  progress[value]::-webkit-progress-bar {
    height: 2px;
    border-radius: 20px;
    background-color: #eee;
  }  

  progress[value]::-webkit-progress-value {
    height: 10px;
    border-radius: 20px;
    background-color: ${props => props.color};
  }
`;


export interface ProgressBarProps {
  value: number;
  max: number;
  width: string;
  loadingBarColor?: string;
}

 