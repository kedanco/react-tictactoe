import React from "react";

class Status extends React.Component {
	render() {
		if (this.props.winner === null && this.props.history.length === 10) {
			let winStatus = "It's a draw!";
			return <div className="winnerText">{winStatus}</div>;
		}
		if (this.props.isWin) {
			let winStatus = "Winner is: " + this.props.winner;
			return <div className="winnerText">{winStatus}</div>;
		} else {
			return <div className="statusText">{this.props.status}</div>;
		}
	}
}

export default Status;
