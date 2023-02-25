import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ReactNode, useRef, useState } from "react";

export interface DraggerProps {
    originalBorderColor?: string;
    dragOverBorderColor?: string;
    dragOverBgColor?: string;
    dropBoxWidth?: string;
    onFile: (files: FileList) => void;
    children: ReactNode;
}

export interface DivProps {
    width: string;
    color: string;
}

export const Dragger: React.FunctionComponent<DraggerProps> = (props) => {
    const { dropBoxWidth, originalBorderColor, dragOverBorderColor, dragOverBgColor, onFile, children } = props;
    const [isDragOver, setIsDragOver] = useState(false);
    const borderColor = isDragOver ? "purple" : "black";
    const divRef = useRef<HTMLDivElement>(null);
    const handleDragOver = (e: React.DragEvent<HTMLElement>, over: boolean) => {
        e.preventDefault();
        if (over) {
            divRef.current!.style.backgroundColor = dragOverBgColor || "#90909042";
        } else {
            divRef.current!.style.backgroundColor = "";
        }
        setIsDragOver(over);
    };
    const handleDragDrop = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        onFile(e.dataTransfer.files);
    }
    const color = isDragOver ? dragOverBorderColor : originalBorderColor;
    const width = dropBoxWidth || "200px";
    return  (
        <DragDropBox
            width = {width}
            color = {color}
            ref={divRef}
            onDragOver={(e) => {
                handleDragOver(e, true);
            }}
            onDragLeave={(e) => handleDragOver(e, false)}
            onDrop={handleDragDrop}
        >
            {children}
        </DragDropBox>
    ) ;
};

const DragDropBox = styled.div<Partial<DivProps>>`
    width: ${props => props.width};
    border: 2px dotted ${props => props.color};
    margin-bottom: 16px;
`