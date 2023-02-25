import { ReactJSXElementChildrenAttribute } from "@emotion/react/types/jsx-namespace";
import styled from "@emotion/styled";
import axios, { AxiosRequestHeaders } from "axios";
import React, {
    Children,
    ReactComponentElement,
    ReactNode,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";
import { Dragger } from "./Dragger";
import { UploadList } from "./UploadList";

export type UploadFileStatus = "ready" | "uploading" | "success" | "error";

export interface UploadFile {
    fid: string;
    size: number;
    name: string;
    status?: UploadFileStatus;
    precentage?: number;
    raw: File;
    resp?: any;
    err?: any;
}

export interface UploadProps {
    action: string;
    onProgress?: (precentage: number, file: File) => void;
    beforeUpload?: (file: File) => boolean | Promise<File>;
    onSuccess?: (data: any, file: File) => void;
    onError?: (error: any, file: File) => void;
    onChange?: (file: File) => void;
    onRemove?: (file: UploadFile) => void;
    defaultFileList?: UploadFile[];
    headers?: AxiosRequestHeaders;
    name?: string;
    data?: { [key: string]: any };
    withCredentials?: boolean;
    accept?: string;
    multiple?: boolean;
    drag?: boolean;
    children: ReactNode;
    originalBorderColor?: string;
    dragOverBorderColor?: string;
    loadingBarColor?: string;
    dragOverBgColor?: string;
    dropBoxWidth?: string;
}

export const UploadComponent: React.FunctionComponent<UploadProps> = (
    props
) => {
    const {
        action,
        onProgress,
        beforeUpload,
        onSuccess,
        onError,
        onChange,
        onRemove,
        name,
        data,
        headers,
        withCredentials,
        defaultFileList,
        accept,
        multiple,
        children,
        drag,
        originalBorderColor,
        dragOverBorderColor,
        loadingBarColor,
        dragOverBgColor,
        dropBoxWidth,
    } = props;
    const [fileList, setFileList] = useState<UploadFile[]>(
        defaultFileList || []
    );
    const fileInput = useRef<HTMLInputElement>(null);
    const handleClick = () => {
        if (fileInput.current) {
            fileInput.current.click();
        }
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) {
            return;
        }
        uploadFile(files);
        if (fileInput.current) {
            fileInput.current.value = "";
        }
    };
    const uploadFile = (files: FileList) => {
        Array.from(files).forEach((file) => {
            if (!beforeUpload) {
                post(file);
            } else {
                const result = beforeUpload(file);
                if (result && result instanceof Promise) {
                    result.then((processedFile) => post(processedFile));
                } else if (result === true) {
                    post(file);
                }
            }
        });
    };
    const updateFileInFileList = (
        currentFile: UploadFile,
        updateVal: Partial<UploadFile>
    ) => {
        setFileList((previousFileList) => {
            return previousFileList.map((e) => {
                if (e.fid === currentFile.fid) {
                    return { ...e, ...updateVal };
                } else {
                    return e;
                }
            });
        });
    };
    const post = (file: File) => {
        let _file: UploadFile = {
            fid: Date.now() + "_",
            size: file.size,
            name: file.name,
            raw: file,
            status: "ready",
            precentage: 0,
        };
        setFileList((previousList) => {
            return [_file, ...previousList];
        });
        const formData = new FormData();
        formData.append(name || "file", file);
        if (data) {
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });
        }
        axios
            .post(action, formData, {
                headers: {
                    ...headers,
                    "Content-Type": "multipart/form-data",
                },
                withCredentials,
                onUploadProgress: (e) => {
                    let precentage =
                        Math.round((e.loaded * 100) / e.total) || 0;
                    if (precentage < 100) {
                        updateFileInFileList(_file, {
                            precentage,
                            status: "uploading",
                        });
                    }
                },
            })
            .then((resp) => {
                updateFileInFileList(_file, {
                    precentage: 100,
                    status: "success",
                    resp,
                });
                if (onSuccess) {
                    onSuccess(resp.data, file);
                }
            })
            .catch((err) => {
                updateFileInFileList(_file, {
                    precentage: 100,
                    status: "error",
                    err,
                });
                if (onError) {
                    onError(err, file);
                }
            })
            .finally(() => {
                if (onChange) {
                    onChange(file);
                }
            });
    };
    const handleDelete = (file: UploadFile) => {
        setFileList((previousList) => {
            return fileList.filter((e) => {
                if (e.fid === file.fid) {
                    return false;
                } else {
                    return true;
                }
            });
        });
        if (onRemove) {
            onRemove(file);
        }
    };
    return (
        // <div>
        //   <UploadButton onClick={handleClick}>
        //     Upload File
        //     <Dragger/>
        //   </UploadButton>
        //   <input accept={accept} multiple={multiple} style={{display: "none"}} type="file" ref={fileInput} onChange={handleFileChange}/>
        //   <UploadList fileList={fileList} handleDelete={handleDelete}/>
        // </div>
        <>
            <div style={{ display: "inline-block" }} onClick={handleClick}>
                {drag ? (
                    <Dragger
                        originalBorderColor={originalBorderColor}
                        dragOverBorderColor={dragOverBorderColor}
                        dragOverBgColor={dragOverBgColor}
                        dropBoxWidth={dropBoxWidth}
                        onFile={(files) => uploadFile(files)}
                    >
                        {" "}
                        {children}{" "}
                    </Dragger>
                ) : (
                    children
                )}
                <input
                    accept={accept}
                    multiple={multiple}
                    style={{ display: "none" }}
                    type="file"
                    ref={fileInput}
                    onChange={handleFileChange}
                />
            </div>
            <UploadList
                loadingBarColor={loadingBarColor}
                fileList={fileList}
                handleDelete={handleDelete}
            />
        </>
    );
};

const UploadButton = styled.div`
    font-family: sans-serif;
    font-size: 24px;
    background-color: white;
    margin-bottom: 16px;
    color: black;
    width: 200px;
    border: 2px solid #4e1d78;
    transition-duration: 0.4s;
    &:hover {
        background-color: #4e1d78;
        color: white;
        cursor: pointer;
    }
`;
