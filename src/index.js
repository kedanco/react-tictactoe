import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import IconsBox from "./components/IconsBox";
import Credits from "./components/Credits";
import RestartGame from "./components/RestartGame";
import Board from "./components/Board";
import AudioPlayer from "./components/AudioPlayer";
import StopMusic from "./components/StopMusic";
import Ranking from "./components/Ranking";
import Status from "./components/Status";

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
				<IconsBox
					iconsArray={iconsArray}
					player1={this.state.player1}
					player2={this.state.player2}
					user1={this.state.user1}
					user2={this.state.user2}
					handleFormChangeP1={e => {
						this.handleFormChange(1, e);
					}}
					handleFormChangeP2={e => {
						this.handleFormChange(2, e);
					}}
					onIconReset={e => this.setState({ resetIcons: true })}
					editP1Icon={e => this.setState({ nameEdit: 1 })}
					editP2Icon={e => this.setState({ nameEdit: 2 })}
					updateP1Icon={e => {
						e.preventDefault();
						this.setState({
							user1: document.getElementById("player1-name").value
						});
						document.getElementById("player1-name").value = "";
					}}
					updateP2Icon={e => {
						e.preventDefault();
						this.setState({
							user2: document.getElementById("player2-name").value
						});
						document.getElementById("player2-name").value = "";
					}}
				/>
				<div className="game-board">
					<Board squares={current.squares} onClick={i => this.handleClick(i)} />
				</div>
				<div className="move-list">
					<h3>Go To Move:</h3>
					<ul>{moves}</ul>
				</div>
				<div className="leaderboard-container">
					<Ranking
						rankingList={rankingList}
						resetRank={e => {
							this.setState({ resetRank: true });
						}}
					/>
				</div>
				<div className="game-info">
					<Status
						winner={winner}
						history={this.state.history}
						status={this.state.status}
						isWin={this.state.isWin}
					/>
					<StopMusic
						isWin={this.state.isWin}
						isDraw={this.state.isDraw}
						pausePlayMusic={() => this.pausePlayMusic()}
					/>
					<RestartGame
						setRestart={() => {
							restart = true;
						}}
						restartGame={() => this.restartGame()}
						isWin={this.state.isWin}
						isDraw={this.state.isDraw}
					/>
				</div>
				<div className="credits">
					<Credits />
					<AudioPlayer isWin={this.state.isWin} isDraw={this.state.isDraw} />
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
// Confetti Code
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
