import React from "react";
import Square from "./Square";

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
		console.log(board, board.length);
		return board;
	}

	render() {
		let board = this.createBoard();
		return <div>{board}</div>;
	}
}

export default Board;
