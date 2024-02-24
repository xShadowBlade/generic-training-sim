/**
 * @file Tutorial / help component (using modal)
 */
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
// import Tooltip from "react-bootstrap/Tooltip";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import "../css/tutorial.css";

interface TutorialText {
    title: React.ReactNode | React.ReactElement,
    text: React.ReactNode | React.ReactElement,
}

// TODO
const tutorialTextList: TutorialText[] = [
    {
        title: "(%i) Welcome to the tutorial!",
        text: <>
            Welcome! This game is a simple incremental game for me to test <a href="https://github.com/xShadowBlade/emath.js" target="_blank" rel="noreferrer">my library</a>.
            The goal is to increase your power as much as possible.
            <br />
            Press the &quot;Next&quot; or &quot;Previous&quot; buttons to navigate through the tutorial.
        </>,
    },
    {
        title: "(%i) Stats",
        text: <>
            Your stats are displayed in the <strong>stats menu</strong>.
            <br />
            <strong>Power</strong> is the primary stat, use to advance in the game.
            <br />
            <strong>Body</strong> is a secondary stat, used for combat (coming soon), but recieves a ^0.75 penalty. It also boosts <strong>Power</strong> by a small multiplier.
            <br />
            <strong>Mind</strong> is a secondary stat, used for combat (coming soon), but recieves a ^0.9 penalty. It also boosts <strong>Body</strong> by a small multiplier.
            <br />
            <strong>Credits</strong> are used to buy upgrades.
        </>,
    },
    {
        title: "(%i) Training",
        text: <>
            You can train in different areas in the <strong>training menu</strong> to increase the rate at which you gain stats.
            <br />
            Training areas require a certain amount of a specific stat to train in, and give a multiplier to the rate at which you gain stats.
            <br />
        </>,
    },
    {
        title: "(%i) Augments",
        text: <>
            Once you have enough power, you can do augments. Augments will <strong>reset your power</strong> (not any secondary stats)
            and give you a <strong>permanent boost</strong> to your stats.
            <br />
            You should do augments as soon as you can, as they significantly increase your power, making it easy to recover.
        </>,
    },
    {
        title: "(%i) Combat",
        text: <>
            Combat is coming soon.
        </>,
    },
].map((x, i) => ({ ...x, title: x.title.toString().replace("%i", (i + 1).toString()) }));

/**
 * @returns Tutorial component
 */
function Tutorial () {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [tutorialIndex, setTutorialIndex] = useState(0);
    // useEffect(() => {
    //     // Add animation class when tutorialIndex changes
    //     // const modalContent = document.querySelector(".tutorialModal");
    //     // if (modalContent) {
    //     //     modalContent.classList.add("fade-in");
    //     //     setTimeout(() => {
    //     //         modalContent.classList.remove("fade-in");
    //     //     }, 500);
    //     // }
    //     if (show) {
    //         setShow(false);
    //         setTimeout(() => {
    //             setShow(true);
    //         }, 100);
    //     }
    // }, [tutorialIndex]);
    return (<>
        {/* Button to open the tutorial */}
        <Button
            variant="light"
            style={{
                position: "fixed",
                top: "10px",
                right: "70px",
                backgroundImage: "url(https://img.icons8.com/ios/50/help--v1.png)",
                backgroundSize: "cover",
                // background: "none",
                width: "50px",
                height: "50px",
                border: "solid 3px black",
                zIndex: 1000,
            }}
            onClick={handleShow}
        />
        {/* Modal for the tutorial */}
        <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            centered
            id="tutorialModal"
            dialogClassName="modal-30h"
            // backdrop={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {tutorialTextList[tutorialIndex].title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {tutorialTextList[tutorialIndex].text}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => setTutorialIndex(tutorialIndex - 1)}
                    disabled={tutorialIndex === 0}
                >
                    Previous
                </Button>
                <Button
                    variant="primary"
                    onClick={() => setTutorialIndex(tutorialIndex + 1)}
                    disabled={tutorialIndex === tutorialTextList.length - 1}
                >
                    Next
                </Button>
            </Modal.Footer>
        </Modal>
    </>);
}

export default Tutorial;