import React from "react";
import ReactDOM from "react-dom";
import fanfare from "./ff7-victory.mp3";
import draw from "./draw.mp3";
import "./index.css";

const canvasConfetti = document.querySelector("#canvas");
const w = (canvasConfetti.width = window.innerWidth);
const h = (canvasConfetti.height = window.innerHeight * 2);

const iconsArray = [
	"X",
	"💩",
	"🍦",
	"🐞",
	"♨",
	"☆",
	"⚽",
	"♠",
	"♡",
	"♤",
	"♦",
	"♫",
	"O",
	"🚽",
	"🍫",
	"🕷️",
	"☕",
	"★",
	"⚾",
	"♢",
	"♣",
	"♥",
	"♧",
	"♭"
];

// TODO
let rankingList = [];
if (localStorage.ranking.length !== 0) {
	rankingList = JSON.parse(localStorage.ranking);
} else {
	rankingList = [
		{ username: "Player1", wins: 0 },
		{ username: "Player2", wins: 0 }
	];
}

const ctx = canvasConfetti.getContext("2d");
const confNum = Math.floor(w / 5);
let confs = new Array(confNum).fill().map(_ => new Confetti());
let restart = false;
let winner = "";

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
			isDraw: false,
			gameStart: false,
			iconClash: false,
			nameEdit: 0,
			resetRank: false,
			resetIcons: false,
			status: "Next player: X",
			player1: "X",
			player2: "O",
			user1: "Player1",
			user2: "Player2"
		};

		this.handleFormChange = this.handleFormChange.bind(this);
	}

	// shouldComponentUpdate() {}

	componentDidMount() {
		this.iconLabel = document.getElementsByClassName("icons-text")[0];
		this.iconWarning = document.getElementsByClassName("icons-warning")[0];
		this.namesWarning = document.getElementsByClassName("names-warning")[0];
		this.player_input = document.getElementsByClassName("player-input");
		// Array.from(this.player_input).forEach((input, index) => {
		// 	input.addEventListener("submit", this.updateName(), false);
		// });
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.isWin !== this.state.isWin && this.state.isWin === true) {
			if (confs.length === 0) {
				confs = new Array(confNum).fill().map(_ => new Confetti());
			}
			this.setState({
				status: "Winner is " + winner
			});
			this.addScore();
			confLoop();
		}

		if (restart === true) {
			confs.splice(0, confs.length);
			console.log(confs.length);
			ctx.clearRect(0, 0, w, h);
			this.setState({
				status:
					"Next player: " +
					(this.state.xIsNext ? this.state.player1 : this.state.player2)
			});

			restart = false;
		}

		if (prevState.xIsNext !== this.state.xIsNext) {
			this.setState({
				status:
					"Next player: " +
					(this.state.xIsNext ? this.state.player1 : this.state.player2)
			});
		}

		if (this.state.gameStart) {
			this.iconLabel.innerHTML = "<strong>Icons locked</strong>";
		} else {
			this.iconLabel.innerHTML = "Select your icons before game start";
		}

		if (this.state.iconClash) {
			this.iconWarning.innerHTML =
				"This icon has been chosen by another player.";
		} else {
			this.iconWarning.innerHTML = "";
		}

		// display username edit input
		if (this.state.nameEdit > 0) {
			this.player_input[this.state.nameEdit - 1].style.display === ""
				? (this.player_input[this.state.nameEdit - 1].style.display = "inline")
				: (this.player_input[this.state.nameEdit - 1].style.display = "");
			this.setState({ nameEdit: 0 });
		}

		if (this.state.user1 === this.state.user2) {
			this.namesWarning.innerHTML = "Both players cannot have the same name";
			console.log("hi");
			this.setState({ user1: prevState.user1, user2: prevState.user2 });
		} else {
			if (prevState.user1 !== this.state.user1) {
				this.player_input[0].style.display = "";
			}
			if (prevState.user2 !== this.state.user2) {
				this.player_input[1].style.display = "";
			}
		}

		if (
			prevState.user1 !== this.state.user2 &&
			prevState.user2 !== this.state.user1 &&
			this.state.user1 !== this.state.user2
		) {
			this.namesWarning.innerHTML = "";
		}

		if (this.state.resetRank) {
			this.deleteRanking(
				window.confirm(
					"Are you sure you wish to reset all ranking records? This action cannot be reversed."
				)
			);

			this.setState({ resetRank: false });
		}

		if (this.state.resetIcons) {
			this.setState({ player1: "X", player2: "O", resetIcons: false });
		}
	}

	addScore() {
		// TODO
		console.log("adding score for " + winner);
		let usernames = [];
		let winUser =
			winner === this.state.player1 ? this.state.user1 : this.state.user2;
		rankingList.forEach(user => {
			usernames.push(user.username);
		});

		let index = usernames.indexOf(winUser);
		console.log(index, usernames[index], winUser);
		if (index >= 0) {
			rankingList[index].wins += 1;
		} else {
			rankingList.push({ username: winUser, wins: 1 });
		}

		// Re-order rankingList, re-render
		rankingList.sort(function(a, b) {
			return b.wins - a.wins;
		});

		console.log(rankingList);

		localStorage.setItem("ranking", JSON.stringify(rankingList));
	}

	audioPlayer = function(props) {
		if (this.state.isWin) {
			return <audio id="fanfare" src={fanfare} autoPlay loop />;
		} else if (this.state.isDraw) {
			return <audio id="fanfare" src={draw} autoPlay />;
		}
	};

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();

		if (!this.state.gameStart) {
			this.setState({ gameStart: !this.state.gameStart });
		}

		winner = this.calculateWinner(squares);
		if (winner || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? this.state.player1 : this.state.player2;
		this.setState({
			history: history.concat([{ squares: squares }]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		});
		winner = this.calculateWinner(squares);
		if (winner) {
			this.setState({ isWin: true, status: "Winner is " + winner });
		}
		if (!winner && this.state.history.length === 9) {
			// Set Draw
			this.setState({ status: "We have a draw!", isDraw: true });
		}

		let moveButtons = Array.from(
			document.getElementsByClassName(`move-button`)
		);
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

		let moveButtons = Array.from(
			document.getElementsByClassName(`move-button`)
		);
		this.setResetBold(moveButtons, step);
	}

	restartGame() {
		this.setState({
			history: [{ squares: Array(9).fill(null) }],
			stepNumber: 0,
			xIsNext: true,
			isWin: false,
			isDraw: false,
			iconClash: false,
			gameStart: false,
			status: "Next player: " + this.state.player1
		});

		Array.from(document.getElementsByClassName("win")).forEach(box => {
			box.classList.remove("win");
		});
	}

	renderStatus() {
		if (winner === null && this.state.history.length === 10) {
			let winStatus = "It's a draw!";
			return <div className="winnerText">{winStatus}</div>;
		}
		if (this.state.isWin) {
			let winStatus = "Winner is: " + winner;
			return <div className="winnerText">{winStatus}</div>;
		} else {
			return <div className="statusText">{this.state.status}</div>;
		}
	}

	renderRestart() {
		if (this.state.isWin || this.state.isDraw) {
			return (
				<div className="restart">
					<button
						className="restartButton"
						onClick={() => {
							this.restartGame();
							restart = true;
						}}
					>
						<span role="img" aria-label="restart">
							⟳
						</span>
						&nbsp; Restart Game
					</button>
				</div>
			);
		}
	}

	renderStopMusic() {
		if (this.state.isWin || this.state.isDraw) {
			return (
				<div className="playPauseMusic">
					<button
						id="playPauseButton"
						className="playPauseButton"
						onClick={() => this.pausePlayMusic()}
					>
						<span role="img" aria-label="sound">
							{" "}
							🔊{" "}
						</span>
						<span id="playPauseText">Playing</span>
					</button>
				</div>
			);
		}
	}

	handleFormChange(player, event) {
		if (!this.state.gameStart) {
			console.log(player);
			const target = event.target;

			if (player === 1) {
				if (target.value !== this.state.player2) {
					this.setState({
						player1: target.value,
						iconClash: false,
						status: "Next player: " + target.value
					});
				} else {
					this.setState({ iconClash: true });
				}
			} else {
				//player2
				if (target.value !== this.state.player1) {
					this.setState({ player2: target.value, iconClash: false });
				} else {
					this.setState({ iconClash: true });
				}
			}
		}
	}

	defaultIcons() {
		if (this.state.player1 !== "X" || this.state.player2 !== "O") {
			return (
				<div>
					<button
						id="resetIcons"
						onClick={e => this.setState({ resetIcons: true })}
					>
						Reset Icons
					</button>
				</div>
			);
		} else {
			return "";
		}
	}

	renderIcons() {
		const listOptions = opt => {
			return (
				<option key={opt} value={opt}>
					{opt}
				</option>
			);
		};

		return (
			<form>
				<div className="icons">
					<p className="icons-text">Select your icons before game start:</p>
					<div className="player1-icons">
						<label>
							<span>
								<span
									id="edit1"
									alt="change name"
									onClick={e => this.setState({ nameEdit: 1 })}
								>
									✎ {""}
								</span>
								{this.state.user1}:{" "}
							</span>
						</label>
						<select
							id="select1"
							value={this.state.player1}
							onChange={e => {
								this.handleFormChange(1, e);
							}}
						>
							{iconsArray.map(listOptions)}
						</select>
					</div>
					<div className="player-input">
						<input id="player1-name" type="text" />
						<button
							onClick={e => {
								e.preventDefault();
								this.setState({
									user1: document.getElementById("player1-name").value
								});
								document.getElementById("player1-name").value = "";
							}}
						>
							<span>✓</span>
						</button>
					</div>
					<div className="player2-icons">
						<label>
							<span>
								<span
									id="edit2"
									alt="change name"
									onClick={e => {
										this.setState({ nameEdit: 2 });
									}}
								>
									✎ {""}
								</span>
								{this.state.user2}:{" "}
							</span>
						</label>
						<select
							id="select2"
							value={this.state.player2}
							onChange={e => {
								this.handleFormChange(2, e);
							}}
						>
							{iconsArray.map(listOptions)}
						</select>
					</div>
					<div className="player-input">
						<input id="player2-name" type="text" />
						<button
							onClick={e => {
								e.preventDefault();
								this.setState({
									user2: document.getElementById("player2-name").value
								});
								document.getElementById("player1-name").value = "";
							}}
						>
							<span>✓</span>
						</button>
					</div>
					<p className="icons-warning" />
					<p className="names-warning" />
					{this.defaultIcons()}
				</div>
			</form>
		);
	}

	renderRanking() {
		let rows = [];
		let displayRanking = function() {
			rankingList.forEach((user, index) => {
				rows.push(
					<div className="l-row" key={index}>
						<div className="r-number">{index + 1}</div>
						<div className="r-username">{user.username}</div>
						<div className="r-wins">{user.wins}</div>
					</div>
				);
			});
			return rows;
		};

		return (
			<div className="leaderboard">
				<span className="l-title">Leaderboard:</span> <br />
				<div className="l-number">Ranking</div>
				<div className="l-username">Username</div>
				<div className="l-wins">Wins</div>
				<div className="l-board">{displayRanking()}</div>
				<div className="l-delete">
					<button
						id="delete-ranking"
						onClick={e => {
							this.setState({ resetRank: true });
						}}
					>
						Reset Ranking
					</button>
				</div>
			</div>
		);
	}

	deleteRanking(ans) {
		if (ans) {
			rankingList = [
				{ username: "Player1", wins: 0 },
				{ username: "Player2", wins: 0 }
			];
			localStorage.setItem("ranking", JSON.stringify(rankingList));
			alert("Ranking has been reset.");
		}
	}

	pausePlayMusic() {
		let audio = document.getElementById("fanfare");
		let audioText = document.getElementById("playPauseText");
		audio.paused ? audio.play() : audio.pause();
		audioText.innerHTML = audio.paused ? " Paused" : " Playing";
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];

		// display past moves
		const moves = history.map((step, move) => {
			const desc = move ? "Move #" + move : "Game Start";
			return (
				<li className="move-item" key={move}>
					<button className="move-button" onClick={() => this.jumpTo(move)}>
						{desc}
					</button>
				</li>
			);
		});

		return (
			<div className="game">
				<h2 className="title">Kedanco's TicTacToe!</h2>
				{this.renderIcons()}
				<div className="game-board">
					<Board squares={current.squares} onClick={i => this.handleClick(i)} />
				</div>
				<div className="move-list">
					<h3>Go To Move:</h3>
					<ul>{moves}</ul>
				</div>
				<div className="leaderboard-container">{this.renderRanking()}</div>
				<div className="game-info">
					{this.renderStatus()}
					{this.renderStopMusic()}
					{this.renderRestart()}
				</div>
				<div className="credits">
					<p>
						Music Credits:&nbsp;
						<a href="https://www.youtube.com/watch?v=-YCN-a0NsNk">
							Final Fantasy 7 Fanfare
						</a>
						<br />
						<a href="https://www.youtube.com/watch?v=-CSQglagWmY">
							Mario Party 4 Draw Music
						</a>
					</p>
					<p>
						Confetti Background:&nbsp;
						<a href="https://codemyui.com/confetti-falling-background-using-canvas/">
							CodemyUI
						</a>
					</p>
					<p>
						<a href="www.kedanco.com">Kedanco</a>
					</p>
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
				return squares[a];
			}
		}

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
		ctx.clearRect(0, 0, w, h);
		return;
	} else {
		requestAnimationFrame(confLoop);
		ctx.clearRect(0, 0, w, h);

		confs.forEach(conf => {
			conf.update();
			conf.draw();
		});
		// console.log(confs.length);
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
