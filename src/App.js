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

function App() {
    const [openFileUploadDialog, setOpenFileUploadDialog] =
        React.useState(false);

    const [fileName, setFileName] = React.useState("Moo");

    const [editorDimentions, setEditorDimentions] = React.useState({ width: "95vw", height: "75vh" });

    const [mode, setMode] = React.useState("Line Code");

    const blockCodeContainer = React.useRef(null);

    return (
        <MDBContainer
            fluid
            style={{ backgroundColor: "#232323", color: "#f5f7ff" }}
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
                    {/* <MDBBtn
                        outline
                        color="light"
                        style={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            height: 47,
                            width: 150,
                            border: "none",
                            backgroundColor: "#404040",
                            borderRadius: "0px",
                        }}
                        onClick={() => {
                            setEditorDimentions(
                                editorDimentions.width != "95vw"
                                    ? { width: "95vw", height: "70vh" }
                                    : {
                                          width: "60vw",
                                          height: "60vh",
                                      }
                            );
                        }}
                    >
                        <MDBIcon icon="expand" className="me-2" />
                        {editorDimentions.width == "95vw"
                            ? "Shrink"
                            : "Expand"}{" "}
                        IDE
                    </MDBBtn> */}

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
                                left: 240,
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
                                left: 380,
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
                                                .innerText
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
                                Block Code
                            </MDBTabsLink>
                        </MDBTabsItem>
                    </MDBTabs>

                    <MDBTabs>
                        <MDBTabsContent>
                            <MDBTabsPane show={mode === "Line Code"}>
                                <MDBWysiwyg
                                    id="editor"
                                    disableStyles
                                    disableFormatting
                                    disableLists
                                    disableLinks
                                    disableCode
                                    style={{
                                        height: editorDimentions.height,
                                        width: editorDimentions.width,
                                    }}
                                    className="rounded-5"
                                >
                                    <i style={{ color: "#bcf2a2" }}>
                                        '''<br/>
Welcome, this is a Cowlang file <br/>
-=-=-=-=-=-| Syntax |-=-=-=-=-=- <br/>
The Cowlang programming language is a simple, instruction-based language with the following commands.<br/>
<br/>
Drive.Forward(tiles, speed);<br/>
Drive.Backward(tiles, speed);<br/>
Drive.Left(tiles, speed);<br/>
Drive.Right(tiles, speed);<br/>
<br/>
Drive.TurnLeft(tiles, speed);<br/>
Drive.TurnRight(tiles, speed);<br/>
<br/>
Drive.SunnyPark(); - parks from where robot is on field rn<br/>
<br/>
Claw.Open();<br/>
Claw.Close();<br/>
<br/>
Viper.GoTo(position);<br/>
'''
                                    </i>
                                </MDBWysiwyg>
                            </MDBTabsPane>
                            <MDBTabsPane
                                show={mode === "Block Code"}
                            >
                              <div ref={blockCodeContainer} style={{width: "95vw", height: "75vh", backgroundColor: "#404040", borderRadius: "5px"}}>
                              <MDBDraggable container={blockCodeContainer} style={{backgroundImage: "url(Puzzle_Comment.png)", color: "#00F990", width: 200, height: 95, borderRadius: "5px"}} >
                                  <textarea style={{fontSize: 10, marginTop: 0, border: "1px solid", width: "100%", height: "90%", borderRadius: 5, backgroundColor: "transparent", color: "#fff"}} value={`
Welcome, this is a Cowlang file 
-=-=-=-=-=-| Syntax |-=-=-=-=-=-
The Cowlang programming language is a simple, instruction-based language with the following commands.<br/>

Drive.Forward(tiles, speed);
Drive.Backward(tiles, speed);
Drive.Left(tiles, speed);
Drive.Right(tiles, speed);

Drive.TurnLeft(tiles, speed);
Drive.TurnRight(tiles, speed);

Drive.SunnyPark(); - parks from where robot is on field rn

Claw.Open();
Claw.Close();

Viper.GoTo(position);`} />
                                </MDBDraggable>

                                <MDBDraggable container={blockCodeContainer} style={{backgroundImage: "url(Puzzle.png)", color: "#0056BF", width: 200, height: 95, borderRadius: "5px"}} >
                                  <MDBRow style={{paddingTop: 20}}>
                                    <MDBCol className="ms-3">
                                      <MDBRow>
                                        <MDBIcon icon="long-arrow-alt-up" />
                                        <p>Forward</p>
                                      </MDBRow>
                                    </MDBCol>
                                    <MDBCol className="me-5">
                                     <input type="number" style={{border: "none", width: 40, height: 40, marginTop: 0, borderRadius: 5, backgroundColor: "#0056BF", color: "#fff"}}/>
                                    </MDBCol>
                                  </MDBRow>
                                </MDBDraggable>
                              </div>
                            </MDBTabsPane>
                        </MDBTabsContent>
                    </MDBTabs>
                </div>
            </div>
        </MDBContainer>
    );
}

export default App;
