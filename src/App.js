import React, { useEffect } from "react";
import {
    MDBBtn,
    MDBBtnGroup,
    MDBCol,
    MDBContainer,
    MDBDropdown,
    MDBDropdownItem,
    MDBDropdownMenu,
    MDBDropdownToggle,
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
    MDBScrollbar,
    MDBTabs,
    MDBTabsContent,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsPane,
} from "mdb-react-ui-kit";
import { MDBWysiwyg } from "mdb-react-wysiwyg";
import { MDBFileUpload } from "mdb-react-file-upload";

import { ClawClose, ClawOpen, Comment, MoveBackwards, MoveForwards, MoveLeft, MoveRight, SunnyPark, TurnLeft, TurnRight, ViperGoTo, Delay } from "./blocks/Blocks";
import { MDBSortable, MDBSortableElement } from "mdb-react-drag-and-drop";

function App() {
    const [openFileUploadDialog, setOpenFileUploadDialog] =
        React.useState(false);

    const [fileName, setFileName] = React.useState("Moo");

    const [blocks, setBlocks] = React.useState([]);

    global.blocks = blocks;
    global.setBlocks = setBlocks;

    useEffect(() => {
        global.blocks = blocks;
    }, [blocks]);

    const [mode, setMode] = React.useState("Line Code");

    const [showLineCodeDocs, setShowLineCodeDocs] = React.useState(false);

    const blockCodeContainer = React.useRef(null);

    const [blockCodeEditor, setBlockCodeEditor] = React.useState(null);

    useEffect(() => {
        setBlockCodeEditor(
            <div id="editor-blocks" style={{height: 5000, width: "100vw", backgroundColor: "#191919", marginTop: 5, paddingLeft: 10}}>
                {blocks.map((block, index) => {
                    return <MDBSortableElement key={index}>{block}</MDBSortableElement>
                })}
            </div>
        );

        setTimeout(() => {
            setBlockCodeEditor(
                <MDBSortable id="editor-blocks" style={{height: 5000, width: "100vw", backgroundColor: "#191919", marginTop: 5, paddingLeft: 10}}
                    onMouseLeave={(e) => {
                        let currentOrderBlocksInID = Array.from(document.getElementById("editor-blocks").children).map((block) => {
                            return block.children[0].id;
                        });

                        let newBlocks = [];

                        for (var blockID of currentOrderBlocksInID) {
                            for (var block of blocks) {
                                if (block.props.data.idx === blockID) {
                                    newBlocks.push(block);
                                }
                            }
                        }

                        setBlocks(newBlocks);
                        
                    }}
                >
                    {blocks.map((block, index) => {
                        return <MDBSortableElement key={index}>{block}</MDBSortableElement>
                    })}
                </MDBSortable>
            );
        }, 50);
    }, [blocks]);

    const reformatBlocks = () => {
        var lines = document.getElementById("editor").innerText.replace(/   [0-9]*\s*   ?/g, "<br/>").replace(" ", "").split("<br/>");

        var tobe = [];

        var comment = "";

        var inComment = false;
        for (var i = 0; i < lines.length; i++)
        {
            var line = lines[i];

            if (line.includes("/*") || line.includes("*/")){
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

            const params = line.slice(line.indexOf("(") + 1, line.lastIndexOf(")")).split(",");
            if (line.includes("Drive.Forward"))
            {
                tobe.push(<MoveForwards container={blockCodeContainer} data={{tiles: Number(params[0]), speed: Number(params[1])}}/>)
            }
            else if (line.includes("Drive.Backward"))
            {
                tobe.push(<MoveBackwards container={blockCodeContainer} data={{tiles: Number(params[0]), speed: Number(params[1])}}/>)
            }
            else if (line.includes("Drive.Left"))
            {
                tobe.push(<MoveLeft container={blockCodeContainer} data={{tiles: Number(params[0]), speed: Number(params[1])}}/>)
            }
            else if (line.includes("Drive.Right"))
            {
                tobe.push(<MoveRight container={blockCodeContainer} data={{tiles: Number(params[0]), speed: Number(params[1])}}/>)
            }
            else if (line.includes("Drive.TurnLeft"))
            {
                tobe.push(<TurnLeft container={blockCodeContainer} data={{degrees: Number(params[0]), speed: Number(params[1])}}/>)
            }
            else if (line.includes("Drive.TurnRight"))
            {
                tobe.push(<TurnRight container={blockCodeContainer} data={{degrees: Number(params[0]), speed: Number(params[1])}}/>)
            }
            else if (line.includes("Drive.SunnyPark"))
            {
                tobe.push(<SunnyPark container={blockCodeContainer} data={{speed: params[0]}}/>)
            }
            else if (line.includes("Claw.Open"))
            {
                tobe.push(<ClawOpen container={blockCodeContainer} data={{}}/>)
            }
            else if (line.includes("Claw.Close"))
            {
                tobe.push(<ClawClose container={blockCodeContainer} data={{}}/>)
            }
            else if (line.includes("Viper.GoTo"))
            {
                tobe.push(<ViperGoTo container={blockCodeContainer} data={{pos: params[0]}}/>)
            }
            else if (line.includes("Delay"))
            {
                tobe.push(<Delay container={blockCodeContainer} data={{seconds: params[0]}}/>)
            }
            else {
                const unable = line.replace(" ", "").replace(" ", "").replace("\n", "").replace("↵", "").replace(" ", "");
                if (unable == "" || Number(unable) != NaN)
                {
                    continue;
                }
                tobe.push(<Comment container={blockCodeContainer} data={{comment: line}} />);
            }
        }

        setBlocks(tobe);
    };

    const recalculateTextbox = () => {
        var content = "";

        for (var block of blocks)
        {
            var data = block.props.data;

            if (data.blockType === "Comment")
            {
                content += "/*\n" + data.comment + "*/\n";
                continue;
            }

            if (data.blockType.includes("Drive.Turn")){
                content += data.blockType + "(" + data.degrees + ", " + data.speed + ");\n";
                continue;
            }

            if (data.blockType.includes("Drive.SunnyPark")){
                content += data.blockType + "(" + data.speed + ");\n";
                continue;
            }

            if (data.blockType.includes("Drive")){
                content += data.blockType + "(" + data.tiles + ", " + data.speed + ");\n";
                continue;
            }

            if (data.blockType.includes("Claw")){
                content += data.blockType + "();\n";
                continue;
            }

            if (data.blockType.includes("Viper")){
                content += data.blockType + "(" + data.pos + ");\n";
                continue;
            }

            if (data.blockType.includes("Delay")){
                content += data.blockType + "(" + data.seconds + ");\n";
                continue;
            }
        }

        document.getElementById("editor").innerText = content;
    };

    const reformatTextbox = (id = "editor") => {
        var content = document.getElementById(id).innerText;

        content = content.replaceAll("\n", "<br />");
        // content = content.replace(";", ";<br />");

        content = content.replace(/   [0-9]*\s*   ?/g, "")

        // content = content.replaceAll(/.*\[FILETYPE\=COWLANG]/g, "<b style='color: #ff6347;'>[FILETYPE=COWLANG]</b>");

        content = content.replaceAll("Forwards", "Forward").replaceAll("Backwards", "Backward");

        content = content.replace(/(<br \/>)*\/\*(<br \/>)*/g, "<br />/*<br />");
        content = content.replace(/(<br \/>)*\*\/(<br \/>)*/g, "<br />*/<br />");

        var comments = content.match(/\/\*.*?\*\//g);
        
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
                    "Delay",
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

        content = content.split("<br />").map((line, index) => { return "<span class='me-0'>   </span><span style='color: #666666; font-style: normal; ' class='me-3'>" + index + " </span><span class='me-4'>   </span>" + line}).join("<br />");

        if (id === "editor")
        {
            document.getElementById(
                "editor"
            ).innerHTML = content;
        }
        else {
            document.getElementById(id).innerHTML = content;
        }
    }

    useEffect(() => {
        setTimeout(() => {
            document.getElementById("editor").innerHTML = "/*<br/>On Autonomous Begin<br/>*/<br/>";
            reformatTextbox();
        }, 100);
    }, []);

    useEffect(() => {
        if (mode === "Block Code")
        {
            reformatBlocks();
        }
        else {
            recalculateTextbox();
            reformatTextbox();
        }
    }, [mode]);

    return (
        <div
            style={{ backgroundColor: "#121212", color: "#f5f7ff", width: "100%", height: "100%" }}
        >
            <div
                className="d-flex justify-content-center"
                style={{ height: "100vh" }}
            >
                <MDBModal
                    // dark
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
                                                document.getElementById(
                                                    "editor"
                                                ).innerText = read.result;

                                                reformatTextbox();
                                                reformatBlocks();

                                                setOpenFileUploadDialog(false);
                                            };
                                        }}
                                        disabledRemoveButton
                                        className="rounded-5"
                                        style={{
                                            height: "400px",
                                            backgroundColor: "#191919",
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

                <MDBModal show={showLineCodeDocs} setShow={setShowLineCodeDocs} onShow={() => {
                    reformatTextbox("docs");
                }}>
                    <MDBModalDialog size="lg" scrollable>
                        <MDBModalContent style={{ backgroundColor: "#292929" }}>
                            <MDBModalHeader>
                                <MDBModalTitle style={{ color: "white" }}>
                                    Cowlang Editor Documentation
                                </MDBModalTitle>
                            </MDBModalHeader>

                            <MDBModalBody>
                                <div id="docs" contentEditable={false} style={{ overflowY: "show" }}>
                                    /* The Cowlang programming language is a simple, instruction-based language with the following commands. */

Drive.Forward(tiles, speed);- tiles: tiles to go forward, speed: speed of robot [0, 1] <br/>
Drive.Backward(tiles, speed); - tiles: tiles to go backward, speed: speed of robot [0, 1]<br/>
Drive.Left(tiles, speed); - tiles: tiles to go left, speed: speed of robot [0, 1]<br/>
Drive.Right(tiles, speed); - tiles: tiles to go right, speed: speed of robot [0, 1]<br/>

Drive.TurnLeft(degrees, speed); - degrees: degrees to turn left, speed: speed of robot [0, 1]<br/>
Drive.TurnRight(degrees, speed); - degrees: degrees to turn right, speed: speed of robot [0, 1]<br/>

Drive.SunnyPark(); - parks the robot according to scanned AprilTags at beginning of program<br/>

Claw.Open(); - opens the claw<br/>
Claw.Close(); - closes the claw<br/>

Viper.GoTo(pos); - position to go to <br/>

Delay(seconds); - seconds to delay<br/>
                                </div>
                            </MDBModalBody>
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>

                <div className="text-center mt-2">
                    <h3 className="mb-1 mt-5"><img width="32" height="32" src="https://media.discordapp.net/attachments/1038918930464518154/1042900942917476442/logo512.png" style={{display: 'inline'}}/> Cowlang IDE</h3>
                    <span>Editing </span>
                    <input
                        className="mt-2"
                        style={{borderRadius: 5, backgroundColor: "#191919", color: "#fff", border: "none", paddingLeft: 5, width: "auto"}}
                        value={fileName}
                        onChange={(e) => {
                            var newFileName = e.target.value;
                            setFileName(newFileName);
                        }}
                    />
                    <span>.cow</span>

                    <MDBContainer style={{top: 50}}>
                        <MDBBtn
                            outline
                            className="me-2"
                            color="light"
                            style={{
                                // position: "absolute",
                                top: 10,
                                // left: 0,
                                height: 40,
                                border: "none",
                                backgroundColor: "#191919",
                                borderRadius: "25px",
                            }}
                            onClick={() => {
                                setOpenFileUploadDialog(true);
                            }}
                        >
                            <MDBIcon icon="upload" className="me-0" />
                        </MDBBtn>
                        <MDBBtn
                            outline
                            id="down-btn"
                            color="light"
                            style={{
                                // position: "absolute",
                                // top: 0,
                                // left: 60,
                                top: 10,
                                height: 40,
                                border: "none",
                                backgroundColor: "#191919",
                                borderRadius: "25px",
                            }}
                            onClick={() => {
                                var newFileName = fileName;
                                if (!newFileName.endsWith(".cow")) {
                                    newFileName += ".cow";
                                }

                                if (mode === "Block Code")
                                {
                                    recalculateTextbox();
                                }
                                reformatTextbox();

                                var text = document.getElementById("editor").innerText.replaceAll(/( |\s)+[0-9]*( |\s)+?/g, "\n").replaceAll(";", ";\n");

                                console.log(text);

                                var element = document.createElement("a");
                                element.setAttribute(
                                    "href",
                                    "data:text/plain;charset=utf-8, " +
                                        encodeURIComponent(
                                            text
                                        )
                                );
                                element.setAttribute("download", newFileName);

                                document.body.appendChild(element);
                                element.click();
                                document.body.removeChild(element);
                            }}
                        >
                            <MDBIcon icon="download" className="me-0" />
                            {/* Download "{fileName}.cow" */}
                        </MDBBtn>
                    </MDBContainer>

                    <MDBBtn
                            outline
                            className="me-2"
                            color="link"
                            id="clear-btn"
                            style={{
                                position: "fixed",
                                bottom: 15,
                                left: 15,
                                height: 50,
                                border: "none",
                                backgroundColor: "#fff",
                                color: "red",
                                borderRadius: "15px",
                                zIndex: 1000
                            }}
                            onClick={() => {
                                document.getElementById(
                                    "editor"
                                ).innerText = `/*\nOn Autonomous Begin\n\n*/`;
                                setBlocks([]);
                                reformatTextbox();
                                reformatBlocks();
                            }}
                        >
                            <MDBIcon icon="trash" className="me-2" />
                            Reset
                        </MDBBtn>

                    <MDBTabs style={{alignSelf: "center"}}>
                         {/* style={{ position: "absolute", top: 0, left: 0 }}> */}
                        <MDBTabsItem>
                            <MDBTabsLink
                                onClick={() => setMode("Line Code")}
                                style={{
                                    color: "white",
                                    backgroundColor: "#121212",
                                }}
                                active={mode === "Line Code"}
                            >
                                <MDBIcon icon="code" className="me-0" />
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem>
                            <MDBTabsLink
                                onClick={() => setMode("Block Code")}
                                style={{
                                    color: "white",
                                    backgroundColor: "#121212",
                                }}
                                active={mode === "Block Code"}
                            >
                                <MDBIcon icon="th-large" className="me-0" />
                            </MDBTabsLink>
                        </MDBTabsItem>

                        <MDBTabsContent>
                            <MDBTabsPane show={true}>
                                <div 
                                style={{display: mode === "Line Code" ? "block" : "none"}}
                                onMouseLeave = {(event) => {
                                    reformatTextbox();
                                }}
                                >
                                    <div
                                        id="editor"
                                        contentEditable
                                        style={{
                                            height: 5000,
                                            width: "100vw",
                                            marginTop: 5,
                                            backgroundColor: "#191919",
                                            textAlign: "left",
                                            paddingTop: 10,
                                            paddingBottom: 50,
                                            paddingLeft: 10,
                                            border: "none",
                                        }}
                                    >
                                    </div>
                                </div>
                                {mode === "Line Code" && <MDBDropdown dropup className='shadow-0' style={{position: "fixed", right: 115, top: 25, zIndex: 1000}}>
                                <MDBDropdownMenu alwaysOpen style={{borderRadius: 10, backgroundColor: "#404040",colors: "#fff", paddingTop: 5, paddingBottom: 5}}>
                                    <MDBDropdownItem header><b style={{color: "white"}}>References</b></MDBDropdownItem>
                                    <div style={{height: 1, backgroundColor: "#808080", width: "100%", marginTop: 5, marginBottom: 5}}/>
                                    <MDBDropdownItem style={{padding: 5, paddingLeft: 10}} onClick={() => {
                                        setShowLineCodeDocs(true);
                                    }}>
                                        <span style={{color: "white"}}>Documentation</span>
                                    </MDBDropdownItem>
                                    <MDBDropdownItem style={{padding: 5, paddingLeft: 10}} onClick={() => {
                                document.getElementById(
                                    "editor"
                                ).innerText = `
/*
On Autonomous Begin
*/
Drive.Forward(1, 100);
Drive.Backward(1, 100);

Drive.Right(1, 100);
Drive.Left(1, 100);

Drive.TurnRight(90, 100);
Drive.TurnLeft(90, 100);

Drive.SunnyPark(100);

Claw.Open();
Claw.Close();

Viper.GoTo(High);

Delay(1);`;
                                reformatTextbox();
}}>
    <span style={{color: "white"}}>
        Load Example
    </span>
</MDBDropdownItem>
                        {/* <i style={{ color: "#bcf2a2" }}>
-=-=-=-=-=-| Syntax |-=-=-=-=-=-  <br/>
The Cowlang programming language is a simple, instruction-based language with the following commands. <br/>
<br/>
Drive.Forward(tiles, speed); - drive forwards by tiles [1, 50] @ speed [0, 100] %  <br/>
Drive.Backward(tiles, speed); - drive backwards by tiles [1, 50]  @ speed [0, 100] %  <br/>
Drive.Left(tiles, speed); - drive left by tiles [1, 50]  @ speed [0, 100] %  <br/>
Drive.Right(tiles, speed); - drive right by tiles [1, 50]  @ speed [0, 100] %  <br/>
<br/>
Drive.TurnLeft(degrees, speed); - turns left by degrees  @ speed [0, 100] %  <br/>
Drive.TurnRight(degrees, speed); - turns right by degrees  @ speed [0, 100] %  <br/>
<br/>
Drive.SunnyPark(speed); - parks to designated zone scanned OnInit from where robot is on field rn   @ speed [0, 100] %  <br/>
<br/>
Claw.Open(); - set claw to open; if already open, ignored <br/>
Claw.Close(); - set claw to open; if already open, ignored  <br/>
<br/>
Viper.GoTo(position); - set viper to position, can be a string from [Ground, Low, Medium, High] or an integer value <br/>
<br/>
-=-=-=-=-=-| Advanced |-=-=-=-=-=-   <br/>
Adding a ! before a function, eg !Drive.Right(tiles, speed); will make it flagged, and will not be transpiled with right-to-left. <br/>
Adding a ? before a function, eg ?Drive.Right(tiles, speed); will make it run in a separate thread. (will run next command with current) <br/>
                        </i> */}
                        </MDBDropdownMenu>
                    </MDBDropdown>}
                            </MDBTabsPane>
                            <MDBTabsPane
                                show={mode === "Block Code"}
                            >
                                {mode === "Block Code" && blockCodeEditor}
                              {mode === "Block Code" && <MDBDropdown dropup className='shadow-0' style={{position: "fixed", right: 115, top: 25, zIndex: 1000}}>
                                <MDBDropdownMenu alwaysOpen style={{borderRadius: 10, backgroundColor: "#404040",colors: "#fff", paddingTop: 5, paddingBottom: 5}}>
                                    <MDBDropdownItem header>
                                        <b style={{color: "white"}}>Add Blocks</b>
                                    </MDBDropdownItem>
                                    <div style={{height: 1, backgroundColor: "#808080", width: "100%", marginTop: 5, marginBottom: 5}}/>
                                    <MDBDropdownItem style={{padding: 5, paddingLeft: 10}} onClick={
                                        () => {
                                            const newBlocks = [...blocks];
                                            newBlocks.push(<Comment container={blockCodeContainer} data={{comment: ""}} />);
                                            setBlocks(newBlocks);
                                        }
                                    }>
                                        <span style={{color: "white"}}>Comment</span>
                                    </MDBDropdownItem>
                                    <MDBDropdownItem style={{padding: 5, paddingLeft: 10}} onClick={
                                        () => {
                                            const newBlocks = [...blocks];
                                            newBlocks.push(<Delay container={blockCodeContainer} data={{seconds: 1}}/>);
                                            setBlocks(newBlocks);
                                        }
                                    }>
                                        <span style={{color: "white"}}>Delay</span>
                                    </MDBDropdownItem>
                                    <div style={{height: 1, backgroundColor: "#808080", width: "100%", marginTop: 5, marginBottom: 5}}/>
                                    <MDBDropdownItem style={{padding: 5, paddingLeft: 10}} onClick={
                                        () => {
                                            const newBlocks = [...blocks];
                                            newBlocks.push(<MoveForwards container={blockCodeContainer} data={{tiles: 1, speed: 100}}/>);
                                            setBlocks(newBlocks);
                                        }
                                    }>
                                        <span style={{color: "white"}}>Forward</span>
                                    </MDBDropdownItem>
                                    <MDBDropdownItem style={{padding: 5, paddingLeft: 10}} onClick={
                                        () => {
                                            const newBlocks = [...blocks];
                                            newBlocks.push(<MoveBackwards container={blockCodeContainer} data={{tiles: 1, speed: 100}}/>);
                                            setBlocks(newBlocks);
                                        }
                                    }>
                                        <span style={{color: "white"}}>Backward</span>
                                    </MDBDropdownItem> 
                                    <MDBDropdownItem style={{padding: 5, paddingLeft: 10}} onClick={
                                        () => {
                                            const newBlocks = [...blocks];
                                            newBlocks.push(<MoveLeft container={blockCodeContainer} data={{tiles: 1, speed: 100}}/>);
                                            setBlocks(newBlocks);
                                        }
                                    }>
                                        <span style={{color: "white"}}>Left</span>
                                    </MDBDropdownItem>
                                    <MDBDropdownItem style={{padding: 5, paddingLeft: 10}} onClick={
                                        () => {
                                            const newBlocks = [...blocks];
                                            newBlocks.push(<MoveRight container={blockCodeContainer} data={{tiles: 1, speed: 100}}/>);
                                            setBlocks(newBlocks);
                                        }
                                    }>
                                        <span style={{color: "white"}}>Right</span>
                                    </MDBDropdownItem>
                                    <div style={{height: 1, backgroundColor: "#808080", width: "100%", marginTop: 5, marginBottom: 5}}/>
                                    <MDBDropdownItem style={{padding: 5, paddingLeft: 10}} onClick={
                                        () => {
                                            const newBlocks = [...blocks];
                                            newBlocks.push(<TurnLeft container={blockCodeContainer} data={{degrees: 90, speed: 100}}/>);
                                            setBlocks(newBlocks);
                                        }
                                    }>
                                        <span style={{color: "white"}}>Turn Left</span>
                                    </MDBDropdownItem>
                                    <MDBDropdownItem style={{padding: 5, paddingLeft: 10}}  onClick={
                                        () => {
                                            const newBlocks = [...blocks];
                                            newBlocks.push(<TurnRight container={blockCodeContainer} data={{degrees: 90, speed: 100}}/>);
                                            setBlocks(newBlocks);
                                        }
                                    }>
                                        <span style={{color: "white"}}>Turn Right</span>
                                    </MDBDropdownItem>
                                    <div style={{height: 1, backgroundColor: "#808080", width: "100%", marginTop: 5, marginBottom: 5}}/>
                                    <MDBDropdownItem style={{padding: 5, paddingLeft: 10}}  onClick={
                                        () => {
                                            const newBlocks = [...blocks];
                                            newBlocks.push(<SunnyPark container={blockCodeContainer} data={{speed: 100}}/>);
                                            setBlocks(newBlocks);
                                        }
                                    }>
                                        <span style={{color: "white"}}>Sunny Park</span>
                                    </MDBDropdownItem>
                                    <div style={{height: 1, backgroundColor: "#808080", width: "100%", marginTop: 5, marginBottom: 5}}/>
                                    <MDBDropdownItem style={{padding: 5, paddingLeft: 10}} onClick={
                                        () => {
                                            const newBlocks = [...blocks];
                                            newBlocks.push(<ClawOpen container={blockCodeContainer} data={{}} />);
                                            setBlocks(newBlocks);
                                        }
                                    }>
                                        <span style={{color: "white"}}>Open Claw</span>
                                    </MDBDropdownItem>
                                    <MDBDropdownItem style={{padding: 5, paddingLeft: 10}} onClick={
                                        () => {
                                            const newBlocks = [...blocks];
                                            newBlocks.push(<ClawClose container={blockCodeContainer} data={{}} />);
                                            setBlocks(newBlocks);
                                        }
                                    }>
                                        <span style={{color: "white"}}>Close Claw</span>
                                    </MDBDropdownItem>
                                    <div style={{height: 1, backgroundColor: "#808080", width: "100%", marginTop: 5, marginBottom: 5}}/>
                                    <MDBDropdownItem style={{padding: 5, paddingLeft: 10}} onClick={
                                        () => {
                                            const newBlocks = [...blocks];
                                            newBlocks.push(<ViperGoTo container={blockCodeContainer} data={{pos: "High"}} />);
                                            setBlocks(newBlocks);
                                        }
                                    }>
                                        <span style={{color: "white"}}>Viper Go To</span>
                                    </MDBDropdownItem>
                                </MDBDropdownMenu>
                              </MDBDropdown>}
                            </MDBTabsPane>
                        </MDBTabsContent>
                    </MDBTabs>
                </div>
            </div>
        </div>
    );
}

export default App;
