import React from "react";

class RenameIcon extends React.Component {
	render() {
		if (this.props.player1 !== "X" || this.props.player2 !== "O") {
			return (
				<div>
					<button id="resetIcons" onClick={this.props.onIconReset}>
						Reset Icons
					</button>
				</div>
			);
		} else {
			return "";
		}
	}
}

export default RenameIcon;
