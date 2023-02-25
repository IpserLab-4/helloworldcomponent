import styled from "@emotion/styled";
import React from "react";
import { UploadFile } from "./UploadComponent";

const StyledTrash = styled.i`
    & {
        box-sizing: border-box;
        position: relative;
        display: "block";
        transform: scale(var(--ggs, 1));
        width: 6px;
        height: 8px;
        border: 2px solid transparent;
        box-shadow: 0 0 0 2px, inset -2px 0 0, inset 2px 0 0;
        border-bottom-left-radius: 1px;
        border-bottom-right-radius: 1px;
        margin-top: 6px;
        margin-right: 2px;
    }
    &::after,
    &::before {
        content: "";
        display: block;
        box-sizing: border-box;
        position: absolute;
    }
    &::after {
        background: currentColor;
        border-radius: 3px;
        width: 12px;
        height: 0px;
        top: -4px;
        left: -5px;
    }
    &::before {
        width: 6px;
        height: 0px;
        border: 2px solid;
        border-bottom: transparent;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        top: -7px;
        left: -2px;
    }
    &:hover {
        color: #4e1d78;
        cursor: pointer;
    }
`;

interface RemoveProps {
    file: UploadFile;
    handleDelete : (file : UploadFile) => void;
}

export const Remove : React.FunctionComponent<RemoveProps> = (props) => {
    const {file, handleDelete} = props;
    return (
        <>
            <StyledTrash onClick={() => handleDelete(file)} icon-role="close" />
        </>
    );
};
