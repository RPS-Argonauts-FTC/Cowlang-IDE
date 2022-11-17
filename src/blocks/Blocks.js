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
import { MDBSortableElement } from "mdb-react-drag-and-drop";

const blockBackgroundURL =
    "https://media.discordapp.net/attachments/829319361843036200/1042428135645388861/Rectangle_14.png";
const commentBlockBackgroundURL =
    "https://media.discordapp.net/attachments/829319361843036200/1042428453120659537/Rectangle_17.png";
const sunnyBlockBackgroundURL =
    "https://media.discordapp.net/attachments/829319361843036200/1042239852281864322/DontQuestion.png";
const clawBlockBackgroundURL =
    "https://media.discordapp.net/attachments/829319361843036200/1042428135372754974/Rectangle_15.png";
const viperBlockBackgroundURL =
    "https://media.discordapp.net/attachments/829319361843036200/1042428135020441721/Rectangle_16.png";

var uuid = require("uuid");

const getUniqueID = () => {
    const id = String(uuid.v4());

    for (var block of global.blocks)
    {
        if (block.props.data.id === id)
        {
            return getUniqueID();
        }
    }

    return id;
}

const Drag = ({container, url = blockBackgroundURL, data, ...props}) => {

    const [close, setClosed] = React.useState(false);
    const [hovered, setHovered] = React.useState(true);

    if (close)
    {
        const target = data.idx;

        const IDArray = global.blocks.map((block) => block.props.data.idx);

        const indexToRemove = IDArray.indexOf(target);
        let newBlocks = global.blocks;

        if (indexToRemove > -1)
        {
            newBlocks.splice(indexToRemove, 1);
        }

        global.setBlocks(newBlocks);

        return null;
    }

    return (
        // <div
            
        // >
            <div
                // container={container}
                style={{
                    fontSize: 12,
                    color: "#fff",
                    width: 300,
                    height: 94,
                    borderRadius: "5px",
                    overflow: "show"
                }}

                onMouseEnter={() => {
                    setHovered(true);
                }}
                onMouseLeave={() => {
                    // setHovered(false);
                }}
            >
                <img src={url} style={{width: "100%", height: 110, marginTop: 0, left: 0}} />
                <div style={{marginTop: -100}}>
                    {/* <div>
                        {hovered && <a style={{color: "#404040", right: 5}} onClick={() => {
                            setClosed(true);
                        }}><MDBIcon icon="trash" size="sm" /></a>}
                    </div> */}
                    {props.children}
                </div>
            </div>
        // </div>
    );
}

const MoveBlockTemplate = ({ direction, inputLabel = ["Tiles", "% Speed"], icon = null, container, data = { param1: 1, param2: 1 }, onChange = () => {} }) => {

    if (icon == null)
    {
        icon = "long-arrow-alt-" + (direction === "Forward" ? "up" : (direction === "Backward" ? "down" : String(direction).toLowerCase()));
    }

    return (
        <Drag
            data={data}
            container={container}
        >
            <MDBRow style={{ paddingTop: 6 }}>
                <MDBCol
                    className="ms-3 mt-1"
                    size="md"
                    style={{ paddingTop: 20 }}
                >
                    <MDBRow>
                        <MDBIcon icon={icon} />
                        <p>{direction}</p>
                    </MDBRow>
                </MDBCol>
                <MDBCol className="" size="md">
                    <p>{inputLabel[0]}</p>
                    <input
                        type="number"
                        min={1}
                        defaultValue={data.param1}
                        onChange={(e) => {
                            data.param1 = e.target.value;
                            onChange(data);
                        }}
                        style={{
                            border: "none",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            width: 40,
                            height: 40,
                            marginTop: -10,
                            borderRadius: 5,
                            color: "#fff",
                        }}
                    />
                </MDBCol>
                <MDBCol className="" size="md">
                    <p>{inputLabel[1]}</p>
                    <input
                        type="number"
                        min={0}
                        max={100}
                        defaultValue={data.param2}
                        onChange={(e) => {
                            data.param2 = e.target.value;
                            onChange(data);
                        }}
                        style={{
                            border: "none",
                            width: 40,
                            height: 40,
                            marginTop: -10,
                            borderRadius: 5,
                            color: "#fff",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                        }}
                    />
                </MDBCol>
            </MDBRow>
        </Drag>
    );
};

export const MoveForwards = ({ container, data = { tiles: 1, speed: 100 } }) => {
    data.blockType = "Drive.Forward";
    data.idx = getUniqueID();

    return (
        <MoveBlockTemplate direction={"Forward"} container={container} data={{
            param1: data.tiles,
            param2: data.speed,
            idx: data.idx
        }} 
        onChange={(e) => {
            data.tiles = e.param1;
            data.speed = e.param2;
        }}
        />
    );
};

export const MoveBackwards = ({ container, data = { tiles: 1, speed: 100 } }) => {
    data.blockType= "Drive.Backward";
    data.idx = getUniqueID();

    return (
        <MoveBlockTemplate direction={"Backward"} container={container} data={{
            param1: data.tiles,
            param2: data.speed,
            idx: data.idx
        }}
        onChange={(e) => {
            data.tiles = e.param1;
            data.speed = e.param2;
        }} />
    );
};

export const MoveLeft = ({ container, data = { tiles: 1, speed: 100 } }) => {
    data.blockType= "Drive.Left";
    data.idx = getUniqueID();

    return (
        <MoveBlockTemplate direction={"Left"} container={container} data={{
            param1: data.tiles,
            param2: data.speed,
            idx: data.idx
        }} 
        onChange={(e) => {
            data.tiles = e.param1;
            data.speed = e.param2;
        }}/>
    );
};

export const MoveRight = ({ container, data = { tiles: 1, speed: 100 } }) => {
    data.blockType= "Drive.Right";
    data.idx = getUniqueID();

    return (
        <MoveBlockTemplate direction={"Right"} container={container} data={{
            param1: data.tiles,
            param2: data.speed,
            idx: data.idx
        }} 
        onChange={(e) => {
            data.tiles = e.param1;
            data.speed = e.param2;
        }}/>
    );
};

export const TurnLeft = ({ container, data = { degrees: 90, speed: 100 } }) => {
    data.blockType= "Drive.TurnLeft";
    data.idx = getUniqueID();

    return (
        <MoveBlockTemplate direction={"Turn Left"} container={container} data={{
            param1: data.degrees,
            param2: data.speed,
            idx: data.idx
        }} inputLabel={["Degrees", "% Speed"]} icon="undo" 
        onChange={(e) => {
            data.degrees = e.param1;
            data.speed = e.param2;
        }}/>
    );
};

export const TurnRight = ({ container, data = { degrees: 90, speed: 100 } }) => {
    data.blockType= "Drive.TurnRight";
    data.idx = getUniqueID();

    return (
        <MoveBlockTemplate direction={"Turn Right"} container={container} data={{
            param1: data.degrees,
            param2: data.speed,
            idx: data.idx
        }} inputLabel={["Degrees", "% Speed"]} icon="redo" 
        onChange={(e) => {
            data.degrees = e.param1;
            data.speed = e.param2;
        }}/>
    );
};

export const SunnyPark = ({ container, data = {speed: 100} }) => {
    data.blockType= "Drive.SunnyPark";
    data.idx = getUniqueID();

    return (
        <Drag
            data={data}
            container={container}
            url={sunnyBlockBackgroundURL}
        >
        <MDBRow style={{ paddingTop: 6 }}>
            <MDBCol
                className="ms-3 mt-1"
                size="md"
                style={{ paddingTop: 20 }}
            >
                <MDBRow style={{color: "#ff00d3"}}>
                    {/* <MDBIcon icon="parking" className="me-2"/> */}
                    <p>박순호</p>
                </MDBRow>
            </MDBCol>
                <MDBCol className="" size="md">
                    <p style={{color: "#ff00d3"}}>% Speed</p>
                    <input
                        type="number"
                        min={1}
                        max={100}
                        onChange={(e) => {
                            data.speed = e.target.value;
                        }}
                        defaultValue={data.speed}
                        style={{
                            border: "none",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            width: 40,
                            height: 40,
                            marginTop: -10,
                            borderRadius: 5,
                            color: "#ff00d3",
                        }}
                    />
                </MDBCol>
        </MDBRow>
    </Drag>
    );
};

export const Delay = ({ container, data = {seconds: 1} }) => {
    data.blockType= "Delay";
    data.idx = getUniqueID();

    return (
        <Drag
            data={data}
            container={container}
            url={blockBackgroundURL}
        >
        <MDBRow style={{ paddingTop: 6 }}>
            <MDBCol
                className="ms-3 mt-1"
                size="md"
                style={{ paddingTop: 20 }}
            >
                <MDBRow>
                    <MDBIcon icon="clock" className="me-2"/>
                    <p>Delay</p>
                </MDBRow>
            </MDBCol>
                <MDBCol className="" size="md">
                    <p>Seconds</p>
                    <input
                        type="number"
                        min={1}
                        defaultValue={data.seconds}
                        onChange={(e) => {
                            data.seconds = e.target.value;
                        }}
                        style={{
                            border: "none",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            width: 40,
                            height: 40,
                            marginTop: -10,
                            borderRadius: 5,
                            color: "white"
                        }}
                    />
                </MDBCol>
        </MDBRow>
    </Drag>
    );
};

export const ViperGoTo = ({ container, data = {pos: "High" }}) => {
    data.blockType= "Viper.GoTo";
    data.idx = getUniqueID();

    return (
        <Drag
            data={data}
            container={container}
            url={viperBlockBackgroundURL}
        >
        <MDBRow style={{ paddingTop: 6 }}>
            <MDBCol
                className="ms-3 mt-1"
                size="md"
                style={{ paddingTop: 20 }}
            >
                <MDBRow>
                    <MDBIcon icon={"angle-double-up"} />
                    <p style={{color: "#fff"}}>Viper</p>
                </MDBRow>
            </MDBCol>
                <MDBCol className="" size="md">
                    <p style={{color: "#fff"}}>Go To</p>
                    <input
                        defaultValue={data.pos}
                        onChange={(e) => {
                            data.pos = e.target.value;
                        }}
                        style={{
                            border: "none",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            width: 100,
                            height: 40,
                            marginTop: -10,
                            borderRadius: 5,
                            color: "#fff",
                        }}
                    />
                </MDBCol>
        </MDBRow>
    </Drag>
    );
};

const ClawTemplate = ({label, container, data}) => {
    return (
        <Drag
            data={data}
            container={container}
            url={clawBlockBackgroundURL}
        >
        <MDBRow style={{ paddingTop: 6 }}>
            <MDBCol
                className="ms-3 mt-1"
                size="md"
                style={{ paddingTop: 20 }}
            >
                <MDBRow>
                    <MDBIcon icon={"door-" + String(label).replace("Close", "Closed").toLowerCase()} />
                    <p style={{color: "#fff"}}>Claw {label}</p>
                </MDBRow>
            </MDBCol>
        </MDBRow>
    </Drag>
    );
};

export const ClawClose = ({container, data = {}}) => {
    data.blockType= "Claw.Close";
    data.idx = getUniqueID();

    return (
        <ClawTemplate label={"Close"} container={container} data={data} />
    );
};

export const ClawOpen = ({container, data = {}}) => {
    data.blockType= "Claw.Open";
    data.idx = getUniqueID();

    return (
        <ClawTemplate label={"Open"} container={container} data={data} />
    );
};

export const Comment = ({ container, data = { comment: "" } }) => {
    data.blockType= "Comment";
    data.idx = getUniqueID();

    return (
        <Drag
            data={data}
            container={container}
            url={commentBlockBackgroundURL}
        >
            <textarea
                contentEditable={true}
                onChange={(e) => {
                    data.comment = e.target.value;
                }}
                style={{
                    fontSize: 9,
                    resize: "horizontal",
                    marginTop: 15,
                    border: "none",
                    overflow: "show",
                    minWidth: "90%",
                    height: 55,
                    borderRadius: 5,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "#fff",
                }}
                defaultValue={data.comment}
            />
        </Drag>
    );
};
