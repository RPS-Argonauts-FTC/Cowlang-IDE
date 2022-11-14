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
    "url('https://media.discordapp.net/attachments/1018552807508410409/1041782459823566878/Rectangle_10-3.png')";

const Drag = ({container, url = blockBackgroundURL, ...props}) => {

    const [close, setClosed] = React.useState(false);

    if (close)
    {
        return null;
    }

    return (
        <div
            onMouseUp={() => {

            }}
            onMouseDown={() => {
                console.log("down")
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
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
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

export const MoveForwards = ({ container, data = { tiles: 1, speed: 100 } }) => {
    return (
        <Drag
            container={container}
        >
            <MDBRow style={{ paddingTop: 6 }}>
                <MDBCol
                    className="ms-3 mt-1"
                    size="md"
                    style={{ paddingTop: 20 }}
                >
                    <MDBRow>
                        <MDBIcon icon="long-arrow-alt-up" />
                        <p>Forward</p>
                    </MDBRow>
                </MDBCol>
                <MDBCol className="" size="md">
                    <p>Tiles</p>
                    <input
                        type="number"
                        min={1}
                        max={50}
                        value={data.tiles}
                        style={{
                            border: "1px solid #404040",
                            width: 40,
                            height: 40,
                            marginTop: -10,
                            borderRadius: 5,
                            color: "#404040",
                            backgroundColor: "transparent",
                        }}
                    />
                </MDBCol>
                <MDBCol className="" size="md">
                    <p>% Speed</p>
                    <input
                        type="number"
                        min={0}
                        max={100}
                        value={data.speed}
                        style={{
                            border: "1px solid #404040",
                            width: 40,
                            height: 40,
                            marginTop: -10,
                            borderRadius: 5,
                            color: "#404040",
                            backgroundColor: "transparent",
                        }}
                    />
                </MDBCol>
            </MDBRow>
        </Drag>
    );
};

export const Comment = ({ container, data = { comment: "" } }) => {
    return (
        <Drag
            container={container}
            url={commentBlockBackgroundURL}
        >
            <textarea
                contentEditable={true}
                style={{
                    fontSize: 9,
                    resize: "horizontal",
                    marginTop: 15,
                    border: "none",
                    overflow: "show",
                    minWidth: "90%",
                    height: 55,
                    borderRadius: 5,
                    backgroundColor: "transparent",
                    color: "#bcf2a2",
                }}
                value={data.comment}
            />
        </Drag>
    );
};
