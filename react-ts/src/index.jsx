import React from "react";
import ReactDOM from "react-dom/client";
import { setPrefix, ProfileComponent } from "./Bandung";
import { CategoryEntityComponent } from "./UncoverGemCommand";
import { BrowserRouter } from "react-router-dom";
import "./Bandung.css";
import { UploadComponent } from "./Bandung-ext/UploadComponent";
import { Completed } from "./Bandung-ext/Completed";

// setPrefix("http://localhost:8989");
// setPrefix("http://localhost:5000/https://www.uncovergem.com") ;
//setPrefix("http://localhost:5000/http://localhost:8080'") ;

const defaultFileList = [
    {
        fid: "001",
        size: 20000,
        name: "log_2092834235_20...",
        status: "uploading",
        precentage: 10,
    },
    {
        fid: "002",
        size: 30000,
        name: "0.png",
        status: "error",
        precentage: 100,
    },
    {
        fid: "003",
        size: 99999999,
        name: "ipserlab.pdf",
        status: "success",
        precentage: 100,
    },
];

const onProgress = (p, f) => {
    // console.log(p, f);
};
const onSuccess = (resp, f) => {
    // console.log(resp, f);
};
const onError = (e, f) => {
    // console.log(e, f);
};
const onChange = (f) => {};
const checkSize = (file) => {
    if (file && file instanceof File) {
        if (file.size / 1024 > 1000) {
            alert("file size is too large");
            return false;
        }
        return true;
    }
};
const renameFile = (file) => {
    if (file && file instanceof File) {
        let newFile;
        if (file.name.length > 20) {
            const newFileName = file.name.substring(0, 20);
            newFile = new File([file], newFileName + "...", {
                type: file.type,
            });
        } else {
            newFile = file;
        }
        const p = new Promise((res, rej) => {
            res(newFile);
        });
        return p;
    }
};

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <div className="App">
                <header className="App-header">
                    {/* <CategoryEntityComponent id='category'/> */}
                    {/* <ProfileComponent id='profile'/> */}
                    <UploadComponent
                        action="http://localhost:8989/upload"
                        headers={{
                            Authorization: "jwt",
                            token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoieGl4aTMiLCJpZCI6IjM3IiwiZXhwIjoxNjc3Mjc5NjExfQ.q9SeNNFqpmkwky-M-OeMW9QU2WaViFxvUcbQcHeMTQw",
                        }}
                        defaultFileList={defaultFileList}
                        beforeUpload={renameFile}
                        onError={onError}
                        onProgress={onProgress}
                        onSuccess={onSuccess}
                        onChange={onChange}
                        multiple={true}
                        accept={".png"}
                        drag={true}
                        originalBorderColor={"white"}
                        dragOverBorderColor={"#4e1d78"}
                        loadingBarColor={"#4e1d78"}
                        dragOverBgColor={"#90909042"}
                        dropBoxWidth={"200px"}
                    >
                        {/* pass your own icon or content here */}
                        <p>Click or Drag file over to upload</p>
                    </UploadComponent>
                </header>
            </div>
        </BrowserRouter>
    </React.StrictMode>
);
