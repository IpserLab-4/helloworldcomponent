/** @jsxImportSource @emotion/react */

import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { UploadFile } from "./UploadComponent";
import { Remove } from "./Remove";
import { LoadingBar } from "./LoadingBar";
import { Completed } from "./Completed";
import { Failed } from "./Failed";


export interface UploadItemProp {
  file: UploadFile;
  handleDelete: (file : UploadFile) => void;
  loadingBarColor?: string;
}

export const UploadItem : React.FunctionComponent<UploadItemProp> = (props) => {
  const {file, handleDelete, loadingBarColor} = props;
  // console.log(file.precentage + loadingBarColor);
  // console.log(loadingBarColor);
  return (
    <FileRow>
      {file.precentage === 100 ? file.status === "success" ? <Completed/> : <Failed/> : <Loading/>}
      <RightPart>
        <InnerUpperPart>
          <FileName>{file.name}</FileName>
          <Remove handleDelete={handleDelete} file={file}/>
        </InnerUpperPart>
        <LoadingBar loadingBarColor={loadingBarColor} width={"100%"} value={file.precentage || 0} max={100}/>
      </RightPart>
    </FileRow>
  )
}

const RightPart = styled.div`
  width: 200px;
`

const InnerUpperPart = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  &:hover {
    cursor: pointer;
    background-color: #90909042;
    transition-duration: 0.6s;
  }
`

const FileRow = styled.div`
  display: flex;
  width: 200px;
`

const FileName = styled.span`
  margin: 0;
  font-size: 14px;
`
 
const load = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const Loading = styled.div`
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-top: 2px;
  &:after {
    content: " ";
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid white;
    border-color: white transparent white transparent;
    animation: ${load} 1.2s linear infinite; 
  }
`

 

