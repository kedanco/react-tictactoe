import React from "react";
class StopMusic extends React.Component {
	render() {
		if (this.props.isWin || this.props.isDraw) {
			return (
				<div className="playPauseMusic">
					<button
						id="playPauseButton"
						className="playPauseButton"
						onClick={() => this.props.pausePlayMusic()}
					>
						<span role="img" aria-label="sound">
							{" "}
							🔊{" "}
						</span>
						<span id="playPauseText">Playing</span>
					</button>
				</div>
			);
		} else return null;
	}
}
export default StopMusic;
