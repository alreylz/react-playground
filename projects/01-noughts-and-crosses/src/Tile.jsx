import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client'
import "./Tile.css"

function Tile({row, col, callback, turn, initialFilledState}) {


    const gridStyle = {gridRow: `${row + 1}}`, gridColumn: `${col + 1}`}

    const [filled, setFilled] = useState(initialFilledState);

    let stateButtonLook = filled === "cross" ? "❌" : filled === "nought" ? "🟢" : "";


    function handleClick() {
        //Change status of Tile itself
        switch (filled) {
            case "empty" :
                setFilled("cross");
                break;
            case "cross":
                setFilled("nought")
                break;
            case "nought":
                setFilled("empty")
                break;
        }
    }

    function handleClick2() {

        if (filled == "empty")
            //Change status of Tile itself
            switch (turn) {
                case "crosses" :
                    setFilled("cross");
                    break;
                case "noughts":
                    setFilled("nought")
                    break;
            }
    }


    // This runs when the fill state of the cell has changed
    useEffect(() => {
        console.log(`use Effect (${col},${row})`);
        //This is supposed to update the state in the parent
        callback(row, col, turn);
    }, [filled])


    console.log(`Tile (${col},${row}) re-rendered`);

    return (<>
        <button className="tile-div" style={gridStyle} onClick={handleClick2}>
            {stateButtonLook}
        </button>

    </>)
}

export default Tile;