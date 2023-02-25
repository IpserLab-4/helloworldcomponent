import styled from "@emotion/styled";
import { UploadFile } from "./UploadComponent";
import { UploadItem } from "./UploadItem"

export interface UploadListProp {
  fileList: UploadFile[],
  handleDelete: (file : UploadFile) => void 
  loadingBarColor?: string
}

export const UploadList : React.FunctionComponent<UploadListProp> = ({fileList, handleDelete, loadingBarColor}) => {
  return (
    <FileUl>
      {
        fileList.map((e : UploadFile, fid : number) => {
          return (
            <UploadItem key={fid} file={e} handleDelete={handleDelete} loadingBarColor={loadingBarColor}/>
          )
        })
      }
    </FileUl>
  )
}

const FileUl = styled.ul`
  margin: 0;
  padding: 0;
`