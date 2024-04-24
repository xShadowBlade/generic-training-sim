/**
 * @file Menu to display info about stats
 */
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { power, body, mind, score } from "../features/stats";
import { credits } from "../features/credits";
import { GameCurrency } from "emath.js/game";
import { GameFormatClass } from "./global/format";
import { AreaType } from "../features/movement";
import { E } from "emath.js";

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The props for the stat info component
 */
function StatInfo ({ stat, gameFormat }: InfoProps & { stat: GameCurrency<AreaType | "credits"> }) {
    const statBoosts = stat.static.boost.boostArray.sort((a, b) => a.order - b.order);
    // console.log(statBoosts);'
    const capitalStat = stat.name.charAt(0).toUpperCase() + stat.name.slice(1);
    const { format } = gameFormat;
    return (<>
        <h2>{capitalStat}</h2>
        <ul>
            <li>Base: {format(E(1))}</li>
            <li>Boosts:
                <ul>
                    {statBoosts.map(boost => (
                        <li key={boost.id}>{boost.descriptionFn(gameFormat)}</li>
                    ))}
                </ul>
            </li>
            <li>Final boost: {format(stat.static.boost.calculate())}</li>
        </ul>
    </>);
}

interface InfoProps {
    gameFormat: GameFormatClass
}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The info modal
 */
function FormulaInfo ({ showFormula, setShowFormula, setShow }: { showFormula: boolean; setShowFormula: (show: boolean) => void; setShow: (show: boolean) => void }) {
    // const [show, setShow] = useState(false);
    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);
    return (<Modal
        show={showFormula}
        onHide={() => setShowFormula(false)}
        size="lg"
    >
        <Modal.Header closeButton>
            <Modal.Title>Formulas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Here is a <a href="https://www.desmos.com/calculator/hq6xlnvqsp" target="_blank" rel="noreferrer">Desmos graph</a> of the formulas.
            <br />
            Most formulas are rounded to the nearest power of 10 via the formula:
            <br />
            <img
                src="https://latex.codecogs.com/svg.latex?r%5Cleft%28x%2Ca%2Cs%5Cright%29%3D%5Cfrac%7B%5Coperatorname%7Bround%7D%5Cleft%28%5Cfrac%7Bx%7D%7Ba%5E%7B%5Cleft%28%5Coperatorname%7Bfloor%7D%5Cleft%28%5Clog_%7Ba%7D%5Cleft%28x%5Cright%29%5Cright%29%5Cright%29%7D%7Da%5E%7Bs%7D%5Cright%29%7D%7Ba%5E%7Bs%7D%7Da%5E%7B%5Cleft%28%5Coperatorname%7Bfloor%7D%5Cleft%28%5Clog_%7Ba%7D%5Cleft%28x%5Cright%29%5Cright%29%5Cright%29%7D"
                alt="r\left(x,a,s\right)=\frac{\operatorname{round}\left(\frac{x}{a^{\left(\operatorname{floor}\left(\log_{a}\left(x\right)\right)\right)}}a^{s}\right)}{a^{s}}a^{\left(\operatorname{floor}\left(\log_{a}\left(x\right)\right)\right)}"
            />
            <br />
            where r(x, a, s) is the rounded number, x is the number to round, a is the accuracy to round to (power), and s is the significant figures to round to.
            See <a href="https://github.com/xShadowBlade/generic-training-sim/blob/main/src/features/training.ts#L27" target="_blank" rel="noreferrer">the source code</a>
            <hr />
            <h3>Basic Upgrade Formulas</h3>
            Let x = the upgrade level, a = 10, and s = 1
            <br />
            <ol>
                <li>
                    Cost: <img
                        src="https://latex.codecogs.com/svg.latex?10%5Ccdot1.2%5E%7B%5Cleft%28x%5E%7B1.2%7D%5Cright%29%7D"
                        alt="10\cdot1.2^{\left(x^{1.2}\right)}"
                    />
                </li>
                <li>
                    Effect: <img
                        src="https://latex.codecogs.com/svg.latex?2%5E%7Bx%7D"
                        alt="2^{x}"
                    />
                </li>
            </ol>
            <hr />
            <h3>Training area formulas</h3>
            Let x = the area number, a = 10, and s = 0
            <br />
            <ol>
                <li>
                    Requirement: <img
                        src="https://latex.codecogs.com/svg.latex?10%5Cleft%282n&plus;1.9%5E%7B%5Cfrac%7Bn%7D%7B2%7D%7D%5Cright%29%5E%7Bn%7D"
                        alt="10\left(2n+2^{\frac{n}{1.9}}\right)^{n}"
                    />
                </li>
                <li>
                    Multiplier: <img
                        src="https://latex.codecogs.com/svg.latex?3%5E%7B%5Cleft%28x&plus;%5Cleft%28%5Cfrac%7Bx%7D%7B10%7D%5Cright%29%5E%7B1.2%7D%5Cright%29%5E%7B1.4%7D%7D"
                        alt="3^{\left(x+\left(\frac{x}{10}\right)^{1.2}\right)^{1.4}}"
                    />
                </li>
            </ol>
            For body areas, the requirement is multiplied by 2 and the multiplier is divided by 2.
            <br />
            For mind areas, the requirement is multiplied by 3 and the multiplier is divided by 3.
            <hr />
            <h3>Augment formulas</h3>
            Let x = the number of augments, a = 10, and s = 0
            <br />
            <ol>
                <li>
                    Requirement: <img
                        src="https://latex.codecogs.com/svg.latex?%5Cleft%2830x&plus;2%5E%7Bx%7D%5Cright%29%5E%7B%5Cleft%285x%5Cright%29%7D%5Ccdot%5Cleft%28250%5Ccdot10%5E%7B12%7D%5Cright%29"
                        alt="\left(30x+2^{x}\right)^{\left(5x\right)}\cdot\left(250\cdot10^{12}\right)"
                    />
                </li>
                <li>
                    Power multiplier: <img
                        src="https://latex.codecogs.com/svg.latex?10%5Ccdot2%5E%7B%5Cleft%28%5Cleft%28x&plus;x%5E%7B1.4%7D%5Cright%29%5E%7B1.5%7D%5Cright%29%7D"
                        alt="10\cdot2^{\left(\left(x+x^{1.4}\right)^{1.5}\right)}"
                    />
                </li>
                <li>
                    Body & Mind multiplier: <img
                        src="https://latex.codecogs.com/svg.latex?5%5Ccdot2%5E%7B%5Cleft%28%5Cleft%28x&plus;x%5E%7B1.3%7D%5Cright%29%5E%7B1.4%7D%5Cright%29%7D"
                        alt="5\cdot2^{\left(\left(x+x^{1.3}\right)^{1.4}\right)}"
                    />
                </li>
                <li>
                    Credits multiplier: <img
                        src="https://latex.codecogs.com/svg.latex?10%5Ccdot2%5E%7B%5Cleft%282x%5E%7B1.275%7D%5Cright%29%7D"
                        alt="10\cdot2^{\left(2x^{1.275}\right)}"
                    />
                </li>
            </ol>
            <hr />
            <h3>Advanced Upgrade Formulas</h3>
            Let x = the upgrade level, a = 10, and s = 0
            <br />
            This upgrade increase the factor at which secondary stats boost the primary stats.
            <ol>
                <li>
                    Cost: <img
                        src="https://latex.codecogs.com/svg.latex?3%5E%7B%5Cleft%28x%5E%7B2%7D%5Cright%29%7D%5Ccdot10%5E%7B5%7D"
                        alt="3^{\left(x^{2}\right)}\cdot10^{5}"
                    />
                </li>
                <li>
                    Effect h(x): <img
                        src="https://latex.codecogs.com/svg.latex?h%5Cleft%28x%5Cright%29%3Dx%5E%7B0.075%7D-0.9"
                        alt="h\left(x\right)=x^{0.075}-0.9"
                    />
                </li>
                <li>
                    Secondary stat boost b(x, n), where x is the secondary stat, n is the level: <img
                        src="https://latex.codecogs.com/svg.latex?b%5Cleft%28x%2Cn%5Cright%29%3D%5Cleft%28%5Cfrac%7Bx&plus;1%7D%7B1000%7D%5Cright%29%5E%7Bh%5Cleft%28n%5Cright%29%7D&plus;.5"
                        alt="b\left(x,n\right)=\left(\frac{x+1}{1000}\right)^{h\left(n\right)}+.5"
                    />
                </li>
            </ol>
            <hr />
            <h3>Score formulas</h3>
            Let x = the stat value, n = the factor of the stat (1 for power, 0.9 for body, 0.75 for mind), and pbm = the product of the three stat scores.
            <br />
            <ol>
                <li>
                    Stat score: <img
                        src="https://latex.codecogs.com/svg.latex?s%5Cleft%28x%2Cn%5Cright%29%3D%5Cleft%28%5Cfrac%7B%5Clog_%7B1.1%7D%5Cleft%28%5Cleft%28%5Cfrac%7Bx%7D%7B10%7D&plus;1%5Cright%29%5E%7B%5Cleft%28n%5E%7B-1.5%7D%5Cright%29%7D%5Cright%29%7D%7Bn%7D%5Cright%29%5E%7B2%7D"
                        alt="s\left(x,n\right)=\left(\frac{\log_{1.1}\left(\left(\frac{x}{10}+1\right)^{\left(n^{-1.5}\right)}\right)}{n}\right)^{2}"
                    />
                </li>
                <li>
                    Total score: <img
                        src="https://latex.codecogs.com/svg.latex?%5Cleft%28pbm%5Cright%29%5E%7B0.4%7D"
                        alt="\left(pbm\right)^{0.4}"
                    />
                </li>
            </ol>
        </Modal.Body>
        <Modal.Footer>
            <Button
                variant="secondary"
                onClick={() => {
                    setShowFormula(false);
                    setShow(true);
                }}
            >Back</Button>
            <Button
                variant="secondary"
                onClick={() => setShowFormula(false)}
            >Close</Button>
        </Modal.Footer>
    </Modal>);
}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The info modal
 */
function Info (props: InfoProps) {
    const { format } = props.gameFormat;
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showFormulas, setShowFormulas] = useState(false);
    const handleShowFormulas = () => setShowFormulas(true);
    // const handleCloseFormulas = () => setShowFormulas(false);
    return (<>
        {/* Button to open the info menu */}
        <Button
            variant="light"
            style={{
                position: "fixed",
                top: "10px",
                right: "130px",
                backgroundImage: "url(https://img.icons8.com/ios/50/info--v1.png)",
                backgroundSize: "cover",
                // background: "none",
                width: "50px",
                height: "50px",
                border: "solid 3px black",
                zIndex: 1000,
            }}
            onClick={handleShow}
            aria-label="Open info"
        />
        {/* Modal for the info */}
        <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            centered
            id="infoModal"
            dialogClassName="modal-30h"
            // backdrop={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Info
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{`🏆 | Power Score: ${format(score.power)}`}</p>
                <p>{`🏆 | Body Score: ${format(score.body)}`}</p>
                <p>{`🏆 | Mind Score: ${format(score.mind)}`}</p>
                <p>{`🏆 | Total Score: ${format(score.total)}`}</p>
                <hr />
                <StatInfo {...props} stat={power} />
                <hr />
                <StatInfo {...props} stat={body} />
                <hr />
                <StatInfo {...props} stat={mind} />
                <hr />
                <StatInfo {...props} stat={credits} />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    onClick={() => {
                        handleClose();
                        handleShowFormulas();
                    }}
                >
                    Formulas
                </Button>
                <Button
                    variant="secondary"
                    onClick={handleClose}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
        {/* Modal for the formulas */}
        <FormulaInfo
            showFormula={showFormulas}
            setShowFormula={setShowFormulas}
            setShow={setShow}
        />
    </>);
}

export default Info;
export { StatInfo, InfoProps };