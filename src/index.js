import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  renderRow(row) {
    const squares = [];
    const maxCol = 3;
    for (let i = 0; i < maxCol; i++) {
      squares.push(this.renderSquare(row * maxCol + i));
    }
    return (
      <div className="board-row">
        {squares}
      </div>
    )
  }
  render() {
    const rows = [];
    const maxRow = 3;
    for (let i = 0; i < maxRow; i++) {
      rows.push(this.renderRow(i));
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      sort: true,
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (squares[i] || calculateWinner(squares, history.length - 1)) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: calculateXY(i)
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  sortStep() {
    this.setState({
      sort: !this.state.sort
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, this.state.stepNumber);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + " " + history[move].location :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {this.state.stepNumber === move ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });

    let status;
    if (checkDraw(current.squares)) {
      status = "Draw";
    }
    else {
      if (winner === "X" || winner === "O") {
        status = "Winner: " + winner;
      } else if (winner === null) {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button className='button-sort' onClick={() => this.sortStep()}>
            {this.state.sort ? "Ascending" : "Descending"}
          </button>
          <ol>{this.state.sort ? moves : moves.reverse()}</ol>

        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
function checkDraw(square) {
  for (let i = 0; i < 9; i++) {
    if (square[i] === null) return false;
  }
  return true;
}
function calculateXY(a) {
  const max = 3;
  for (let i = 0; i < max; i++) {
    for (let j = 0; j < max; j++) {
      if (i * max + j === a) {
        return "[" + i.toString() + "," + j.toString() + "]";
      }
    }
  }
}
function calculateWinner(squares) {
  const maxSquare = 9;
  for (let i = 0; i < maxSquare; i++) {
    if (squares[i]) {
      try{
        if(squares[i]===squares[i+1] && squares[i]===squares[i+2]){
          return squares[i];
        }
        if(squares[i]===squares[i+1] && squares[i]===squares[i-1]){
          return squares[i];
        }
        if(squares[i]===squares[i-1] && squares[i]===squares[i-2]){
          return squares[i];
        }
        if(squares[i]===squares[i+3] && squares[i]===squares[i+6]){
          return squares[i];
        }
      }
      finally{

      }
    }
  }
  return null;
}
