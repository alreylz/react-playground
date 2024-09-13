import './Board.css'
import Tile from "./Tile.jsx";
import {useEffect, useState} from "react";

function Board() {


    const BOARD_DIMENSIONS = {
        ROWS: 3,
        COLS: 3
    }

    const TURNS = {
        o: "noughts",
        x: "crosses"
    }

    function checkWinner(currentBoardState, typeOfMove /* cross or nought */) {
        function searchAdjacentRecursive(board, winnerType, nextCell, straightAdjacentCount = 0, track = []) {

            const WinnerTypesAllowed = {
                o: "nought",
                x: "cross"
            };
            const adjacentObjective = 3;
            const rows = board.length;
            const columns = board[0].length;


            if (winnerType !== WinnerTypesAllowed.o && winnerType !== WinnerTypesAllowed.x) {
                return new Error("Provided wrong winner type to searchAdjacentRecursive function");
            }


            //if out of board -> stop the search
            if (nextCell.r >= rows || nextCell.c >= columns || nextCell.r < 0 || nextCell.c < 0) {
                console.log("Out of board, discarding solution...")
                return;
            }


            //cell being analyzed in this execution (row, column and value)
            const cell = {
                r: nextCell.r,
                c: nextCell.c,
                v: board[nextCell.r][nextCell.c]
            };


            console.group(`EXECUTION LOOKING FOR WINNER OF TYPE: ${winnerType}`)
            console.log("Cell under analysis:", cell)
            console.log("adjacent count:", straightAdjacentCount)
            console.log("track so far:", track)
            console.groupEnd()

            // UP
            const nextCellCoordsUp = {r: cell.r - 1, c: cell.c}
            // DOWN
            const nextCellCoordsDown = {r: cell.r + 1, c: cell.c}
            // RIGHT
            const nextCellCoordsRight = {r: cell.r, c: cell.c + 1}
            // LEFT
            const nextCellCoordsLeft = {r: cell.r, c: cell.c - 1}
            //DIAGONALS
            const nextCellCoordsDiagonalUpLeft = {r: cell.r - 1, c: cell.c - 1}
            const nextCellCoordsDiagonalUpRight = {r: cell.r - 1, c: cell.c + 1}
            const nextCellCoordsDiagonalDownRight = {r: cell.r + 1, c: cell.c + 1}
            const nextCellCoordsDiagonalDownLeft = {r: cell.r + 1, c: cell.c - 1}

            // Si la celda está vacía, parar la búsqueda para continuar con otra celda
            if (cell.v === "empty" /*&& straightAdjacentCount !== 0*/) {
                console.log("Encountered empty cell, discarding solution...")
                return;
            }

            if (cell.v === "explored") {
                console.log("This cell was already checked by branching in the algorithm, discarding solution...")
                return;
            }


            if (cell.v === winnerType) {
                console.log("new cell of same type found")
                const trackedBoard = structuredClone(board);
                trackedBoard[cell.r][cell.c] = "explored";
                console.log("trackedBoard", trackedBoard);
                straightAdjacentCount++;
                track.push(cell); // We found the same value in adjacent rows

                if (straightAdjacentCount >= adjacentObjective) {
                    console.log("@alreylz Solution found", {
                        winner: winnerType,
                        connectedNum: straightAdjacentCount,
                        combination: track
                    })
                    return {winner: winnerType, connectedNum: straightAdjacentCount, combination: track};
                }

                //All exploration possibilities (up,down,left,right,diagonals), at one point one should return something
                console.log("Trying adjacent ⬆️ cell ");
                let resultUp = searchAdjacentRecursive(trackedBoard, winnerType, nextCellCoordsUp, straightAdjacentCount, track);
                console.log("Trying adjacent ⬇️ cell ");

                let resultDown = searchAdjacentRecursive(trackedBoard, winnerType, nextCellCoordsDown, straightAdjacentCount, track);
                console.log("Trying adjacent ➡️ cell ");
                let resultR = searchAdjacentRecursive(trackedBoard, winnerType, nextCellCoordsRight, straightAdjacentCount, track);
                console.log("Trying adjacent ⬅️ cell ");

                let resultL = searchAdjacentRecursive(trackedBoard, winnerType, nextCellCoordsLeft, straightAdjacentCount, track);
                console.log("Trying adjacent ↖️ cell ");

                let resultDgUpLeft = searchAdjacentRecursive(trackedBoard, winnerType, nextCellCoordsDiagonalUpLeft, straightAdjacentCount, track);
                console.log("Trying adjacent ↗️ cell ");
                let resultDgUpRight = searchAdjacentRecursive(trackedBoard, winnerType, nextCellCoordsDiagonalUpRight, straightAdjacentCount, track);
                console.log("Trying adjacent ↙️ cell ");
                let resultDgDownLeft = searchAdjacentRecursive(trackedBoard, winnerType, nextCellCoordsDiagonalDownLeft, straightAdjacentCount, track);
                console.log("Trying adjacent ↘️ cell ");
                let resultDgDownRight = searchAdjacentRecursive(trackedBoard, winnerType, nextCellCoordsDiagonalDownRight, straightAdjacentCount, track);
                const nonUndefinedResult = resultUp ?? resultDown ?? resultR ?? resultL ?? resultDgUpLeft ?? resultDgUpRight ?? resultDgDownLeft ?? resultDgDownRight
                if (nonUndefinedResult)
                    return nonUndefinedResult;

            }
            //Try with a brand new search in an adjacent cell
            // let separateResultUp = searchAdjacentRecursive(board, winnerType, nextCellCoordsUp);
            // let separateResultDown = searchAdjacentRecursive(board, winnerType, nextCellCoordsDown);
            // let separateResultR = searchAdjacentRecursive(board, winnerType, nextCellCoordsRight);
            // let separateResultL = searchAdjacentRecursive(board, winnerType, nextCellCoordsLeft);
            // let separateResultDgUpLeft = searchAdjacentRecursive(board, winnerType, nextCellCoordsDiagonalUpLeft);
            // let separateResultDgUpRight = searchAdjacentRecursive(board, winnerType, nextCellCoordsDiagonalUpRight);
            // let separateResultDgDownLeft = searchAdjacentRecursive(board, winnerType, nextCellCoordsDiagonalDownLeft);
            // let separateResultDgDownRight = searchAdjacentRecursive(board, winnerType, nextCellCoordsDiagonalDownRight);
            //
            // return separateResultUp ?? separateResultDown ?? separateResultR ?? separateResultL ?? separateResultDgUpLeft ?? separateResultDgUpRight ?? separateResultDgDownLeft ?? separateResultDgDownRight


        }

        const result = searchAdjacentRecursive(currentBoardState, typeOfMove, {r: 0, c: 0}) || undefined;
        if (result)
            console.log(`The winner is ${result.winner}`, result);
    }

    /**
     * Generates a 2D array with "empty" values that can be used to initialize our board state
     * @param rows
     * @param cols
     * @returns {*[][]}
     */
    function generateTilesInitialState(rows = 3, cols = 3) {
        const tilesState = [[]]; // Initializes the state of the game
        for (let r = 0; r < rows; r++) {
            tilesState[r] = [];
            for (let c = 0; c < cols; c++) {
                tilesState[r].push("empty");
            }
        }
        return tilesState;
    }


    function generateTiles(rows = 3, cols = 3, callback, turn) {

        const tiles = [[]]

        console.log("Board re-rendered")

        for (let r = 0; r < rows; r++) {
            tiles[r] = [];
            for (let c = 0; c < cols; c++) {

                tiles[r].push(
                    <Tile key={`${r},${c}`}
                          label={`${r}-${c}`}
                          row={r} col={c}
                          callback={callback}
                          initialFilledState="empty"
                          turn={turn}>
                    </Tile>
                )
            }

        }
        return tiles;
    }

    const emptyBoard = generateTilesInitialState(BOARD_DIMENSIONS.ROWS, BOARD_DIMENSIONS.COLS);
    console.log(emptyBoard)
    // State of the board
    const [boardState, setBoardState] = useState(emptyBoard);
    // To keep track of the turn we're in
    const [turn, setTurn] = useState(TURNS.x)


    const onUserAction = (row, col, turnType) => {

        console.log("Executed on User Action")
        setBoardState((prevBoardState) => {
            const newBoardState = [...prevBoardState];
            console.log(newBoardState)
            newBoardState[row][col] = turnType;
            return newBoardState;
        })

        //Update Turn when the user performs an action
        setTurn((prevTurn) => prevTurn == TURNS.x ? TURNS.o : TURNS.x)


    }


    // Generating tiles
    const gameReactTiles = generateTiles(BOARD_DIMENSIONS.ROWS, BOARD_DIMENSIONS.COLS, onUserAction, turn);


    return (
        <>
            <h1>Noughts and crosses</h1>
            <section>
                <h3> Turn for {turn}</h3>
            </section>

            <div className="nc-board">
                {gameReactTiles}

                {/*<button onClick={onTileAction}> Change Turn</button>*/}
                <button style={{gridColumn: "1/span 3"}} onClick={() => {
                    checkWinner(boardState, "cross")
                }}> Check Winner
                </button>
            </div>


            {/* Showing board state in the terminal state */}
            <div>
                <header>
                    <strong> Board state</strong>
                </header>
                {boardState.map(row => {
                    return (<div style={{display: "flex", gap: "1em", justifyContent: "center"}}> {row.map(val => {
                        return (<p>{val}</p>)
                    })} < /div>)
                })}
            </div>

        </>
    )
}

export default Board
