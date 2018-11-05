import React from "react";

class Ranking extends React.Component {
	displayRanking() {
		let rows = [];
		this.props.rankingList.forEach((user, index) => {
			rows.push(
				<div className="l-row" key={index}>
					<div className="r-number">{index + 1}</div>
					<div className="r-username">{user.username}</div>
					<div className="r-wins">{user.wins}</div>
				</div>
			);
		});
		return rows;
	}

	render() {
		return (
			<div className="leaderboard">
				<span className="l-title">Leaderboard:</span> <br />
				<div className="l-number">Ranking</div>
				<div className="l-username">Username</div>
				<div className="l-wins">Wins</div>
				<div className="l-board">{this.displayRanking()}</div>
				<div className="l-delete">
					<button id="delete-ranking" onClick={this.props.resetRank}>
						Reset Ranking
					</button>
				</div>
			</div>
		);
	}
}

export default Ranking;
