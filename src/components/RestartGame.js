import React from "react";
class RestartGame extends React.Component {
	render() {
		if (this.props.isWin || this.props.isDraw) {
			return (
				<div className="restart">
					<button
						className="restartButton"
						onClick={() => {
							this.props.restartGame();
							this.props.setRestart();
						}}
					>
						<span role="img" aria-label="restart">
							⟳
						</span>
						&nbsp; Restart Game
					</button>
				</div>
			);
		} else return null;
	}
}
export default RestartGame;
