import React, { useState, useEffect } from 'react'
import GamePart from './components/gamePart';
import cookie from './assets/cookie2.png'
import './App.css'

var cookieimg = document.createElement('img');
cookieimg.src = cookie;

function App() {
    const [gameState, setGameState] = useState(0);

    function handleStart() {
        setGameState(1);
    }

    return (
        <>
            { gameState === 0 ? (<StartUp onclick={handleStart}/>) : (<Game />)}
        </>
    )
}


function StartUp({ onclick }) {
    return (
        <>
            <div>
                <a href="https://react.dev">
                    <img src={cookie} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>React Test - Clicker Game</h1>
            <h3>This type of clicker is called an <i>incremental</i> clicker, where the second upgrade produces the first, the third produces the second, and so on. This results in numbers getting unnecessarily large very quickly.</h3>
            <div className="card">
                <button onClick={onclick}>
                    Start Game
                </button>
            </div>
            <p className="read-the-docs">
                Made by Konq, on January 10th, 2024 <br/>
                Inspired by the classic Cookie Clicker.
            </p>
        </>
    )
}


function Game(){
    // Basic currency for the game.
    const [cookies, setCookies] = useState(0);
    // Amount of cookies gained per click.
    const [clickAmt, setClickAmt] = useState(1);
    // Timer (in seconds)
    const [timer, setTimer] = useState(0);
    // Integer that is incremented whenever a milestone is reached
    const [progressState, setProgress] = useState(0);

    // Upgrade 1
    const [gramma, setGramma] = useState(0);
    const [grammaCost, setGrammaCost] = useState(20);
    // Upgrade 2
    const [factory, setFactory] = useState(0);
    const [factoryCost, setFactoryCost] = useState(150);
    // Upgrade 3
    const [wizardTower, setWizardTower] = useState(0);
    const [wizardTowerCost, setWizardTowerCost] = useState(5000);
    // Upgrade 4
    const [portal, setPortal] = useState(0);
    const [portalCost, setPortalCost] = useState(1000000);


    // Sorting variables in a way that allows for an array access based on which upgrade we want to reference.
    // Basically, making future upgrades easy as pi to add, and that's not irrational.
    const upgrades = [gramma, factory, wizardTower, portal];
    const upgradeSetters = [setGramma, setFactory, setWizardTower, setPortal];
    const costs = [grammaCost, factoryCost, wizardTowerCost, portalCost];
    const costSetters = [setGrammaCost, setFactoryCost, setWizardTowerCost, setPortalCost];

    // Hard-baked values for each upgrade.
    // Multiplier applied to cost when bought
    const curves = [1.1, 1.175, 1.2, 1.3];
    // Number of required "banked" cookies to show the next upgrade.
    const milestones = [20, 100, 3000, 750000, Infinity];

    // function handleClick(){
    //     setCookies(cookies + clickAmt);
    // }

    const handleClick = () => {
        setCookies((current) => current + clickAmt);
    } 

    function increment(id){
        // Can we afford it? Then...
        if(cookies > costs[id]){
            if(upgrades[id] === 0){
                setClickAmt(Math.pow(id+2, id+1));
            }
            // Give the upgrade
            upgradeSetters[id](upgrades[id] + 1);
            // Decrease the cookies from our bank
            setCookies((cookies) => cookies - costs[id]);
            // Update the price by multiplying it by the curve given
            costSetters[id](Math.floor(costs[id] * curves[id]));
        }
    }

    const tickSecond = () => {
        setTimer((timer) => timer + 1);
        // Repeatedly work up the chain and add the next to the current.
        setCookies((cookies) => cookies + gramma);
        setGramma((gramma) => gramma + factory);
        setFactory((factory) => factory + wizardTower);
        setWizardTower((wizardTower) => wizardTower + portal);

        // Have we passed a milestone? Upgrade the state.
        if(cookies > milestones[progressState]){
            setProgress((progressState) => progressState + 1)
        }
    }

    useEffect(() => {
        const interval = setInterval(() => tickSecond(), 1000);
        return () => {
          clearInterval(interval);
        };
    }, []);

    return (
        <>
            <tr>
                <td>
                    <div>
                        <img src={cookie} className="logo react" alt="Cookie of Great Yumminess" onClick={() => handleClick()}/>
                    </div>
                    <h2 className="cookies">You have {cookies.toLocaleString()} cookie{cookies === 1 ? "" : "s"}.</h2>
                    { clickAmt > 1 && <p className="read-the-docs clickamt">You now gain { clickAmt } cookies every click.</p>}
                    <p className="read-the-docs">You've been playing for {timer >= 3600 ? Math.floor(timer / 3600) + " hours," : ""} {timer >= 60 ? Math.floor((timer % 3600) / 60) + " minutes and" : ""} {timer % 60 + " seconds."}</p>
                    <table className="upgrades">
                        { progressState >= 1 && <GamePart val={gramma} name="Grandma 👵" cost={grammaCost} onclick={() => increment(0)}/>}
                        { progressState >= 2 && <GamePart val={factory} name="Factory 🏭" cost={factoryCost} onclick={() => increment(1)}/>}
                        { progressState >= 3 && <GamePart val={wizardTower} name="Wizard Tower 🧙‍♂️" cost={wizardTowerCost} onclick={() => increment(2)}/>}
                        { progressState >= 4 && <GamePart val={portal} name="Portal 🌀" cost={portalCost} onclick={() => increment(3)}/>}
                    </table>
                </td>
            </tr>
        </>
    )
}

export default App
