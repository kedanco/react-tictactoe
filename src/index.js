import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

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
				key={i}
			/>
		);
	}

	createBoard() {
		let board = [];
		for (let row = 0; row < 3; row++) {
			let squares = [];
			for (let sq = 0; sq < 3; sq++) {
				squares.push(this.renderSquare(3 * row + sq));
			}
			board.push(
				<div className="board-row" key={row}>
					{squares}
				</div>
			);
		}
		return board;
	}

	render() {
		let board = this.createBoard();
		return <div>{board}</div>;
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
			stepNumber: 0,
			xisNext: true,
			isWin: false,
			status: ""
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		let winner = this.calculateWinner(squares);
		if (winner || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? "X" : "O";
		this.setState({
			history: history.concat([{ squares: squares }]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		});
		winner = this.calculateWinner(squares);

		if (!winner && this.state.history.length === 9) {
			// Set Draw
			this.setState({ status: "We have a draw!", isWin: true });
		}

		let moveButtons = Array.from(document.getElementsByClassName(`move-item`));
		this.setResetBold(moveButtons);
	}

	setResetBold(coll, step = null) {
		// Restart bolded buttons
		coll.forEach(btn => {
			btn.style.fontWeight = "";
		});

		if (step !== null) {
			coll[step].style.fontWeight = "bold";
		}
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: step % 2 === 0
		});

		let moveButtons = Array.from(document.getElementsByClassName(`move-item`));
		this.setResetBold(moveButtons, step);
	}

	restartGame() {
		this.setState({
			history: [{ squares: Array(9).fill(null) }],
			stepNumber: 0,
			xIsNext: true,
			isWin: false,
			status: "Next player: " + (this.state.xIsNext ? "X" : "O")
		});
		document.getElementsByClassName("status").innerHTML = "";
		Array.from(document.getElementsByClassName("win")).forEach(box => {
			box.classList.remove("win");
		});
	}

	renderRestart() {
		if (this.state.isWin) {
			return (
				<div className="restart">
					<button className="restartBtn" onClick={() => this.restartGame()}>
						Restart Game
					</button>
				</div>
			);
		}
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];

		// display past moves
		const moves = history.map((step, move) => {
			const desc = move ? "Go to move #" + move : "Go to game start";
			return (
				<li key={move}>
					<button className="move-item" onClick={() => this.jumpTo(move)}>
						{desc}
					</button>
				</li>
			);
		});

		return (
			<div className="game">
				<div className="game-board">
					<Board squares={current.squares} onClick={i => this.handleClick(i)} />
				</div>
				<div className="game-info">
					<div>{this.state.status}</div>
					<ol>{moves}</ol>
					{this.renderRestart()}
				</div>
			</div>
		);
	}

	calculateWinner(squares) {
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
			if (
				squares[a] &&
				squares[a] === squares[b] &&
				squares[a] === squares[c]
			) {
				this.highlightWin(lines[i]);
				this.setState({ isWin: true, status: "Winner: " + squares[a] });
				return squares[a];
			}
		}
		this.setState({
			status: "Next player: " + (this.state.xIsNext ? "X" : "O")
		});
		return null;
	}

	highlightWin(winSquares) {
		let allSquares = Array.from(document.getElementsByClassName("square"));
		winSquares.forEach(index => {
			allSquares[index].classList.add("win");
		});
	}
}
// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
