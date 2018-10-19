import React from "react";
import ReactDOM from "react-dom";
import fanfare from "./ff7-victory.mp3";
import "./index.css";

const canvasConfetti = document.querySelector("#canvas");
const w = (canvasConfetti.width = window.innerWidth);
const h = (canvasConfetti.height = window.innerHeight * 2);

const ctx = canvasConfetti.getContext("2d");
const confNum = Math.floor(w / 5);
let confs = new Array(confNum).fill().map(_ => new Confetti());
let restart = false;

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
			xIsNext: true,
			isWin: false,
			status: "Next player: X"
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if (!prevState.isWin && this.state.isWin) {
			if (confs.length === 0) {
				confs = new Array(confNum).fill().map(_ => new Confetti());
			}
			confLoop();
		}
		if (restart === true) {
			confs.splice(0, confs.length);
			console.log(confs.length);
			ctx.clearRect(0, 0, w, h);

			restart = false;
		}
	}

	audioPlayer = function(props) {
		if (this.state.isWin) {
			return <audio id="fanfare" src={fanfare} autoPlay loop />;
		}
	};

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
			xIsNext: !this.state.xIsNext,
			status: "Next player: " + (this.state.xIsNext ? "X" : "O")
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
					<button
						className="restartBtn"
						onClick={() => {
							this.restartGame();
							restart = true;
						}}
					>
						Restart Game
					</button>
				</div>
			);
		}
	}

	renderStopMusic() {
		if (this.state.isWin) {
			return (
				<div className="stopMusic">
					<button className="stopButton" onClick={() => this.pausePlayMusic()}>
						<span role="img" aria-label="sound">
							🔊
						</span>
						&nbsp; Play/Pause
					</button>
				</div>
			);
		}
	}

	pausePlayMusic() {
		let audio = document.getElementById("fanfare");
		audio.paused ? audio.play() : audio.pause();
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];

		// display past moves
		const moves = history.map((step, move) => {
			const desc = move ? "Go to move #" + move : "Go to game start";
			return (
				<li className="move-list" key={move}>
					<button className="move-item" onClick={() => this.jumpTo(move)}>
						{desc}
					</button>
				</li>
			);
		});

		return (
			<div className="game">
				<h2 className="title">TicTacToe!</h2>
				<div className="game-board">
					<Board squares={current.squares} onClick={i => this.handleClick(i)} />
				</div>
				<div className="game-info">
					<div>{this.state.status}</div>
				</div>
				<div className="buttonList">
					<ol>{moves}</ol>
					{this.renderRestart()}
					{this.renderStopMusic()}
				</div>
				{this.audioPlayer()}
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

function confLoop() {
	if (restart || confs.length === 0) {
		return;
	} else {
		requestAnimationFrame(confLoop);
		ctx.clearRect(0, 0, w, h);

		confs.forEach(conf => {
			conf.update();
			conf.draw();
		});
		console.log(confs.length);
	}
}

function Confetti() {
	const colours = ["#fde123", "#009bde", "#ff6b00"];

	this.x = Math.round(Math.random(10) * w);
	this.y = Math.round(Math.random(10) * h) - h / 2;

	this.rotation = Math.random(10) * 360;

	const size = Math.random(10) * (w / 60);
	this.size = size < 15 ? 15 : size;

	this.color = colours[Math.round(Math.random(colours.length) * 10 - 1)];

	this.speed = this.size / 7;

	this.opacity = Math.random(10);

	this.shiftDirection = Math.random(10) > 0.5 ? 1 : -1;
}

Confetti.prototype.border = function() {
	if (this.y >= h) {
		this.y = h;
		// delete conf if reach bottom
		confs.splice(confs.indexOf(this), 1);
	}
};

Confetti.prototype.update = function() {
	this.y += this.speed;

	if (this.y <= h) {
		this.x += this.shiftDirection / 5;
		this.rotation += (this.shiftDirection * this.speed) / 100;
	}

	this.border();
};

Confetti.prototype.draw = function() {
	ctx.beginPath();
	ctx.arc(
		this.x,
		this.y,
		this.size,
		this.rotation,
		this.rotation + Math.PI / 2
	);
	ctx.lineTo(this.x, this.y);
	ctx.closePath();
	ctx.globalAlpha = this.opacity;
	ctx.fillStyle = this.color;
	ctx.fill();
};

ReactDOM.render(<Game />, document.getElementById("root"));
