import React, { useEffect } from "react";
import {
    MDBBtn,
    MDBBtnGroup,
    MDBCol,
    MDBContainer,
    MDBFile,
    MDBIcon,
    MDBInput,
    MDBModal,
    MDBModalBody,
    MDBModalContent,
    MDBModalDialog,
    MDBModalHeader,
    MDBModalTitle,
    MDBRow,
    MDBTabs,
    MDBTabsContent,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsPane,
} from "mdb-react-ui-kit";
import { MDBWysiwyg } from "mdb-react-wysiwyg";
import { MDBFileUpload } from "mdb-react-file-upload";
import { MDBDraggable } from "mdb-react-drag-and-drop";

import { Comment, MoveForwards } from "./blocks/Blocks";

function App() {
    const [openFileUploadDialog, setOpenFileUploadDialog] =
        React.useState(false);

    const [fileName, setFileName] = React.useState("Moo");

    const [blocks, setBlocks] = React.useState([]);

    const [editorDimentions, setEditorDimentions] = React.useState({ width: "98vw", height: "100vh", position: "absolute", top: "0", left: "0"});

    const [mode, setMode] = React.useState("Line Code");

    const [lastKeyDownInUnix, setLastKeyDownInUnix] = React.useState((new Date).getTime());

    const blockCodeContainer = React.useRef(null);

    const reformatTextbox = () => {
        var content = document.getElementById("editor").innerText;

        content = content.replaceAll("\n", "<br />");
        content = content.replaceAll(/.*\[FILETYPE\=COWLANG]/g, "<b style='color: #ff6347;'>[FILETYPE=COWLANG]</b>");

        content = content.replaceAll("Forwards", "Forward").replaceAll("Backwards", "Backward");

        var comments = content.match(/'''.*?'''/g);
        
        if (comments) {
            for (var comment of comments)
            {
                content = content.replaceAll(comment, "<i style='color: #bcf2a2;'>" + comment + "</i>");
            }
        }

        var parameters = content.match(/\(.*?\)/g);

        if (parameters)
        {
            for (var param of parameters)
            {
                // console.log(param);
                content = content.replaceAll(param, "<b style='color: #5cb8ff;'>" + param + "</b>");
            }
        }

        var functionNames = content.match(/(Drive|Claw|Viper|Delay).*?\(/g);
        if (functionNames)
        {
            for (var func of functionNames)
            {
                for (var actualFunctions of [
                    "Drive.Forward",
                    "Drive.Backward",
                    "Drive.Left",
                    "Drive.Right",

                    "Drive.TurnLeft",
                    "Drive.TurnRight",

                    "Drive.SunnyPark",

                    "Claw.Open",
                    "Claw.Close",

                    "Viper.GoTo",
                ])
                {
                    if (func.includes(actualFunctions))
                    {
                        content = content.replaceAll(func, "<span style='color: #fff4a1;'>" + func.split("(")[0] + "</span>(" + func.split("(")[1]);
                        break;
                    }
                }
                content = content.replaceAll(func, "<i><s style='color: #ffa196;'>" + func.split("(")[0] + "</s></i>(" + func.split("(")[1]);
            }
        }

        content = content.replaceAll("!", "<b style='color: #ff0000;'>!</b>");

        content = content.replaceAll("?", "<b style='color: #00ff00;'>?</b>");

        content = content.replaceAll("(", "<b style='color: #a834eb;'>(</b>").replaceAll(")", "<b style='color: #a834eb;'>)</b>");

        content = content.split("<br />").map((line, index) => { return "<span style='color: #404040;' class='me-0'>|||</span><span style='color: #666666; font-style: normal; ' class='me-3'>" + index + " </span><span style='color: #404040;' class='me-4'>|||</span>" + line.replace(/\|\|\|[0-9]*\s*\|\|\|?/g, "")}).join("<br />");

        document.getElementsByClassName(
            "wysiwyg-content"
        )[0].innerHTML = content;
    }

    useEffect(() => {
        reformatTextbox();
    }, []);

    useEffect(() => {
        if (mode === "Block Code")
        {
            var lines = document.getElementById("editor").innerText.replace(/\|\|\|[0-9]*\s*\|\|\|?/g, "").replace(" ", "").replace("[FILETYPE=COWLANG]", "")
            // var commentables = lines.replace("\n", "").split("'''");
            lines = lines.split("\n");
            var tobe = [];

            tobe.push(<Comment container={blockCodeContainer} data={{comment: "[FILETYPE=COWLANG]"}} />);

            // console.log(commentables);

            // for (var i = 1; i < commentables.length; i += 2)
            // {
            //     if (commentables[i] !== "")
            //     {
            //         tobe.push(<Comment container={blockCodeContainer} data={{comment: commentables[i]}} />);
            //     }
            // }

            var comment = "";

            var inComment = false;
            for (var i = 0; i < lines.length; i++)
            {
                var line = lines[i];

                if (line.includes("'''")){
                    if (inComment){
                        inComment = false;
                        tobe.push(<Comment container={blockCodeContainer} data={{comment: comment}} />);
                        comment = "";
                    }
                    else {
                        inComment = true;
                    }
                    continue;
                }

                if (inComment)
                {
                    comment += line;
                    continue;
                }

                if (line.includes("Drive.Forward"))
                {
                    const params = line.slice(line.indexOf("(") + 1, line.lastIndexOf(")")).split(",");
                    console.log(params);
                    tobe.push(<MoveForwards container={blockCodeContainer} data={{tiles: Number(params[0]), speed: Number(params[1])}}/>)
                }
                else {
                    if (line.replaceAll(" ", "").replaceAll(" ", "") == "")
                    {
                        continue;
                    }
                    tobe.push(<Comment container={blockCodeContainer} data={{comment: line}} />);
                }
            }

            setBlocks(tobe);
        }
    }, [mode])

    return (
        <div
            style={{ backgroundColor: "#232323", color: "#f5f7ff", width: "100%", height: "100%" }}
        >
            <div
                className="d-flex justify-content-center"
                style={{ height: "100vh" }}
            >
                <MDBModal
                    dark
                    show={openFileUploadDialog}
                    setShow={setOpenFileUploadDialog}
                >
                    <MDBModalDialog>
                        <MDBModalContent style={{ backgroundColor: "#292929" }}>
                            <MDBModalHeader>
                                <MDBModalTitle style={{ color: "white" }}>
                                    Upload Cowlang File
                                </MDBModalTitle>
                            </MDBModalHeader>
                            <MDBModalBody>
                                {openFileUploadDialog && (
                                    <MDBFileUpload
                                        getInputFiles={(files) => {
                                            if (files.length === 0) {
                                                return;
                                            }

                                            setFileName(
                                                files[0].name.replace(
                                                    ".cow",
                                                    ""
                                                )
                                            );

                                            var read = new FileReader();
                                            read.readAsBinaryString(files[0]);

                                            read.onloadend = function () {
                                                document.getElementsByClassName(
                                                    "wysiwyg-content"
                                                )[0].innerText = read.result;
                                                setOpenFileUploadDialog(false);
                                            };
                                        }}
                                        disabledRemoveButton
                                        className="rounded-5"
                                        style={{
                                            height: "400px",
                                            backgroundColor: "#404040",
                                        }}
                                        acceptedExtensions={[".cow"]}
                                        defaultMessage={
                                            "Got Milk? Upload a .cow file here."
                                        }
                                    />
                                )}
                            </MDBModalBody>
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>

                <div className="text-center">

                    <h3 className="mb-1 mt-5">Cowlang IDE</h3>
                    <p className="mb-0 pb-0">
                        A light-weight IDE made for FTC programming.
                    </p>
                    <MDBInput
                        className="mt-4"
                        label="Project Name"
                        contrast
                        value={fileName}
                        onChange={(e) => {
                            var newFileName = e.target.value;
                            setFileName(newFileName);
                        }}
                    />

                    <MDBContainer className="mt-4">
                        <MDBBtn
                            outline
                            className="me-2"
                            color="light"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 280,
                                height: 47,
                                border: "none",
                                backgroundColor: "#404040",
                                borderRadius: "0px",
                            }}
                            onClick={() => {
                                setOpenFileUploadDialog(true);
                            }}
                        >
                            <MDBIcon icon="upload" className="me-2" />
                            Upload Work
                        </MDBBtn>
                        <MDBBtn
                            outline
                            id="down-btn"
                            color="light"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 420,
                                height: 47,
                                border: "none",
                                backgroundColor: "#404040",
                                borderRadius: "0px",
                            }}
                            onClick={() => {
                                var newFileName = fileName;
                                if (!newFileName.endsWith(".cow")) {
                                    newFileName += ".cow";
                                }

                                var element = document.createElement("a");
                                element.setAttribute(
                                    "href",
                                    "data:text/plain;charset=utf-8, " +
                                        encodeURIComponent(
                                            document.getElementById("editor")
                                                .innerText.replace(/\|\|\|[0-9]*\s*\|\|\|?/g, "")
                                        )
                                );
                                element.setAttribute("download", newFileName);

                                document.body.appendChild(element);
                                element.click();
                                document.body.removeChild(element);
                            }}
                        >
                            <MDBIcon icon="download" className="me-2" />
                            Download "{fileName}.cow"
                        </MDBBtn>
                    </MDBContainer>

                    <MDBTabs style={{ position: "absolute", top: 0, left: 0 }}>
                        <MDBTabsItem>
                            <MDBTabsLink
                                onClick={() => setMode("Line Code")}
                                style={{
                                    color: "white",
                                    backgroundColor: "#404040",
                                }}
                                active={mode === "Line Code"}
                            >
                                <MDBIcon icon="code" className="me-2" />
                                Line Code
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem>
                            <MDBTabsLink
                                onClick={() => setMode("Block Code")}
                                style={{
                                    color: "white",
                                    backgroundColor: "#404040",
                                }}
                                active={mode === "Block Code"}
                            >
                                <MDBIcon icon="th-large" className="me-2" />
                                Block Code
                            </MDBTabsLink>
                        </MDBTabsItem>
                    </MDBTabs>

                    <MDBTabs>
                        <MDBTabsContent>
                            <MDBTabsPane show={true}>
                                <div 
                                style={{display: mode === "Line Code" ? "block" : "none"}}
                                onMouseLeave = {(event) => {
                                    reformatTextbox();
                                    // console.log(event.code.toLowerCase());
                                    // if (!event.code.toLowerCase().includes("semicolon")){return;}
                                    // global.lastKeyDown = (new Date).getTime();
                                    // const last = global.lastKeyDown;

                                    // setTimeout(() => {
                                    //     if (global.lastKeyDown != last){return;}
                                    //     // const beforePos = document.getElementsByClassName("wysiwyg-content")[0].selectionStart;
                                    //     // const beforePos2 = document.getElementsByClassName("wysiwyg-content")[0].selectionEnd;
                                    //     // console.log(beforePos);
                                    //     reformatTextbox();
                                    //     // document.getElementsByClassName("wysiwyg-content")[0].selectionStart = beforePos;
                                    //     // document.getElementsByClassName("wysiwyg-content")[0].selectionEnd = beforePos2;
                                    // }, 100);
                                }}
                                >
                                    <MDBWysiwyg
                                        id="editor"
                                        disableStyles
                                        disableFormatting
                                        disableLists
                                        disableLinks
                                        disableCode
                                        style={{
                                            height: "auto",
                                            width: "98vw",
                                            backgroundColor: "#404040",
                                            textAlign: "left",
                                        }}
                                        className="rounded-5"
                                    >
                                        <i style={{ color: "#bcf2a2" }}>
[FILETYPE=COWLANG] <br/>
''' <br/>
Welcome, this is a Cowlang file  <br/>
-=-=-=-=-=-| Syntax |-=-=-=-=-=-  <br/>
The Cowlang programming language is a simple, instruction-based language with the following commands. <br/>
<br/>
Drive.Forward(tiles, speed); - drive forwards by tiles [1, 50] @ speed [0, 100] % <br/>
Drive.Backward(tiles, speed); - drive backwards by tiles [1, 50]  @ speed [0, 100] % <br/>
Drive.Left(tiles, speed); - drive left by tiles [1, 50]  @ speed [0, 100] % <br/>
Drive.Right(tiles, speed); - drive right by tiles [1, 50]  @ speed [0, 100] % <br/>
<br/>
Drive.TurnLeft(degrees, speed); - turns left by degrees  @ speed [0, 100] % <br/>
Drive.TurnRight(degrees, speed); - turns right by degrees  @ speed [0, 100] % <br/>
<br/>
Drive.SunnyPark(speed); - parks to designated zone scanned OnInit from where robot is on field rn   @ speed [0, 100] % <br/>
<br/>
Claw.Open(); - set claw to open; if already open, ignored <br/>
Claw.Close(); - set claw to open; if already open, ignored <br/>
<br/>
Viper.GoTo(position); - set viper to position, can be a string from [Ground, Low, Medium, High] or an integer value <br/>
<br/>
-=-=-=-=-=-| Advanced |-=-=-=-=-=-  <br/>
Adding a ! before a function, eg !Drive.Right(tiles, speed); will make it flagged, and will not be transpiled with right-to-left. <br/>
Adding a ? before a function, eg ?Drive.Right(tiles, speed); will make it run in a separate thread. (will run next command with current) <br/>
'''
                                        </i>
                                    </MDBWysiwyg>
                                </div>
                            </MDBTabsPane>
                            <MDBTabsPane
                                show={mode === "Block Code"}
                            >
                                {mode === "Block Code" && <section ref={blockCodeContainer} style={{height: "100vh", width: "98vw", backgroundColor: "#404040", borderRadius: "5px"}}>
                                    {blocks}
                              </section>}
                            </MDBTabsPane>
                        </MDBTabsContent>
                    </MDBTabs>
                </div>
            </div>
        </div>
    );
}

export default App;
