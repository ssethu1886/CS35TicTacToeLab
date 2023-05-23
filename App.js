import React from 'react';
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, previousSquare, currentMove }) {
  function handleClick(i) {
    if (calculateWinner(squares) ) {
      return;
    }
    const nextSquares = squares.slice();

    let xIsNextBoard;
    let expectedSquareValue;
    let complMoveFlag;

    if (currentMove < 6) { //Tic-Tac-Toe logic
      if (squares[i]) return;
      if (xIsNext) {
        nextSquares[i] = "X";
     } else {
       nextSquares[i] = "O";
     }
     xIsNextBoard = !xIsNext;
     complMoveFlag = true;
     onPlay(nextSquares, i, xIsNextBoard, complMoveFlag);
    } else  { //CL logic
      if (xIsNext) {
        expectedSquareValue = "X";
      } else {
        expectedSquareValue = "O";
      }
      if (squares[previousSquare] != null) { //previous was not null, 1st click selection
       if (!squares[i]) return; // if current square is empty return      
       if (squares[i] !== expectedSquareValue ) return;  //if not clicked on player's square
       nextSquares[i] = null;
       xIsNextBoard = xIsNext;
       complMoveFlag = false;
       onPlay(nextSquares, i, xIsNextBoard, complMoveFlag);
      } else { //second click selection, previous was forced null
        if (i === previousSquare) { //current and prev are the same square, same player retains his chance
          if (xIsNext) {
            nextSquares[i] = "X";
         } else {
           nextSquares[i] = "O";
         }
         xIsNextBoard = xIsNext;
         complMoveFlag = true;
         onPlay(nextSquares, i, xIsNextBoard, complMoveFlag);
        }
        if (squares[i]) return;
        if (!isAdjacentSquare(i, previousSquare)) return;
        if (squares[4] === expectedSquareValue) { //center square 
          if (xIsNext) {
            nextSquares[i] = "X";
         } else {
           nextSquares[i] = "O";
         }
         
          if (!calculateWinner(nextSquares)) { // if center square move is not a winning move force vacate  
            nextSquares[i] = null;
            return;
          }
        }
        if (xIsNext) {
          nextSquares[i] = "X";
       } else {
         nextSquares[i] = "O";
       }
       xIsNextBoard = !xIsNext;
       complMoveFlag = true;
       onPlay(nextSquares, i, xIsNextBoard, complMoveFlag);
      }
    }
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status =
      "Next player: " + (xIsNext ? "X" : "O") + " Prev:" + previousSquare;
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </div>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [previousSquare, setPreviousSquare] = useState(-1);
  const currentSquares = history[currentMove];
  const [complCurrMove, setComplCurrMove] = useState(true);

  function handlePlay(nextSquares, i, xIsNextBoard, complMoveFlag) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(xIsNextBoard);
    setPreviousSquare(i);
    setComplCurrMove(complMoveFlag)
  }

  function jumpTo(lkey, nextMove) {
    let nextMoveSquares;
    if (lkey != null && complCurrMove ){
     setCurrentMove(nextMove);
     nextMoveSquares = history[nextMove];
     for (let k = 0; k < 9; k++) {
       if (nextMoveSquares[k] != null) {
        setPreviousSquare(k);
        break;
       }
     }
    setXIsNext(lkey % 2 === 0);
   }
  }

  const moves = history.map((squares, move) => {
    let description;
    let lkey;
    if (move > 0 && move <= 6) {    
      lkey = move;
      description = "Go to move #" + move;
    } else if (move > 6 && move % 2 === 0) {
      lkey = (move / 2) + 3 ;
      description = "Go to move #" + lkey ;
    } else if (move > 6 && move % 2 !== 0) {
      //lkey = move + 1 ;
      description =  "" ;
    } else {
      description = "Go to game start";
    }
    return (
      
      <li key={lkey}>
         <button onClick={() => jumpTo(lkey, move)}>{description}</button>
      </li>
      
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          previousSquare={previousSquare}
          currentMove={currentMove}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function isAdjacentSquare(currSq, prevSq)
{
 if ((currSq === 0) && (prevSq === 1 || prevSq === 3 || prevSq === 4)) return true;
 else if ((currSq === 1) && (prevSq === 0 || prevSq === 2 || prevSq === 3 || prevSq === 4 || prevSq === 5)) return true;
 else if ((currSq === 2) && (prevSq === 1 || prevSq === 4 || prevSq === 5)) return true;
 else if ((currSq === 3) && (prevSq === 0 || prevSq === 1 || prevSq === 4 || prevSq === 6 || prevSq === 7)) return true;
 else if (currSq === 4) return true;
 else if ((currSq === 5) && (prevSq === 1 || prevSq === 2 || prevSq === 4 || prevSq === 7 || prevSq === 8)) return true;
 else if ((currSq === 6) && (prevSq === 3 || prevSq === 4 || prevSq === 7)) return true;
 else if ((currSq === 7) && (prevSq === 6 || prevSq === 3 || prevSq === 4 || prevSq === 5 || prevSq === 8)) return true;
 else if ((currSq === 8) && (prevSq === 7 || prevSq === 5 || prevSq === 4)) return true;
 else return false;

}
