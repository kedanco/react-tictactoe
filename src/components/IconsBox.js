import React from "react";
import ResetIcon from "./ResetIcon";
import IconOption from "./IconOption";

class Iconsbox extends React.Component {
	render() {
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
									onClick={this.props.editP1Icon}
								>
									✎ {""}
								</span>
								{this.props.user1}:{" "}
							</span>
						</label>
						<select
							id="select1"
							value={this.props.player1}
							onChange={this.props.handleFormChangeP1}
						>
							{this.props.iconsArray.map(opt => (
								<IconOption opt={opt} key={opt} />
							))}
						</select>
					</div>
					<div className="player-input">
						<input id="player1-name" type="text" maxLength="20" />
						<button onClick={this.props.updateP1Icon}>
							<span>✓</span>
						</button>
					</div>
					<div className="player2-icons">
						<label>
							<span>
								<span
									id="edit2"
									alt="change name"
									onClick={this.props.editP2Icon}
								>
									✎ {""}
								</span>
								{this.props.user2}:{" "}
							</span>
						</label>
						<select
							id="select2"
							value={this.props.player2}
							onChange={this.props.handleFormChangeP2}
						>
							{this.props.iconsArray.map(opt => (
								<IconOption key={opt} opt={opt} />
							))}
						</select>
					</div>
					<div className="player-input">
						<input id="player2-name" type="text" maxLength="20" />
						<button onClick={this.props.updateP2Icon}>
							<span>✓</span>
						</button>
					</div>
					<p className="icons-warning" />
					<p className="names-warning" />
					<ResetIcon
						player1={this.props.player1}
						player2={this.props.player2}
						onIconReset={this.props.onIconReset}
					/>
				</div>
			</form>
		);
	}
}

export default Iconsbox;
