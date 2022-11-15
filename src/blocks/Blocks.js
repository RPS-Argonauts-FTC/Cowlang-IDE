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
import { MDBDraggable } from "mdb-react-drag-and-drop";

const blockBackgroundURL =
    "url('https://media.discordapp.net/attachments/1018552807508410409/1041781682317033532/Rectangle_9-3.png')";
const commentBlockBackgroundURL =
    "url('https://media.discordapp.net/attachments/1018552807508410409/1041826366745759754/Puzzle_Comment.png')";
const sunnyBlockBackgroundURL =
    "url('https://media.discordapp.net/attachments/829319361843036200/1041920773687889920/DontQuestion.png')";
const clawBlockBackgroundURL =
    "url('https://media.discordapp.net/attachments/1018552807508410409/1041923863182852127/Rectangle_12.png')";
const viperBlockBackgroundURL =
    "url('https://media.discordapp.net/attachments/1018552807508410409/1041926786105217124/Rectangle_13.png')";

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
        <div
            onMouseUp={() => {

            }}
            onMouseDown={() => {
                // console.log("down")
            }}
        >
            <MDBDraggable
                container={container}
                style={{
                    fontSize: 12,
                    backgroundImage: url,
                    color: "#404040",
                    width: 300,
                    height: 94,
                    borderRadius: "5px",
                    // backgroundColor: "rgba(255, 255, 255, 0.25)",
                    overflow: "show"
                }}
            >
                 <a style={{color: "#404040", position: "absolute", left: 5, top: 40, width: 5, height: 5}} onClick={() => {
                    setClosed(true);
                 }}><MDBIcon icon="trash" size="sm"/></a>
                {props.children}
            </MDBDraggable>
        </div>
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
                        max={50}
                        defaultValue={data.param1}
                        onChange={(e) => {
                            data.param1 = e.target.value;
                            onChange(data);
                        }}
                        style={{
                            border: "none",
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            width: 40,
                            height: 40,
                            marginTop: -10,
                            borderRadius: 5,
                            color: "#404040",
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
                            color: "#404040",
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
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
                <MDBRow>
                    <MDBIcon icon="parking" className="me-2"/>
                    <p style={{color: "#000"}}>Sunny Park</p>
                </MDBRow>
            </MDBCol>
                <MDBCol className="" size="md">
                    <p style={{color: "#fff"}}>% Speed</p>
                    <input
                        type="number"
                        min={1}
                        max={50}
                        onChange={(e) => {
                            data.speed = e.target.value;
                        }}
                        defaultValue={data.speed}
                        style={{
                            border: "none",
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            width: 40,
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
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            width: 40,
                            height: 40,
                            marginTop: -10,
                            borderRadius: 5,
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
                    <p style={{color: "#000"}}>Viper</p>
                </MDBRow>
            </MDBCol>
                <MDBCol className="" size="md">
                    <p style={{color: "#000"}}>Go To</p>
                    <input
                        defaultValue={data.pos}
                        onChange={(e) => {
                            data.pos = e.target.value;
                        }}
                        style={{
                            border: "none",
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            width: 100,
                            height: 40,
                            marginTop: -10,
                            borderRadius: 5,
                            color: "#404040",
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
                    <p style={{color: "#000"}}>Claw {label}</p>
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
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    color: "#000",
                }}
                defaultValue={data.comment}
            />
        </Drag>
    );
};
