import React from "react";
import fanfare from "./../ff7-victory.mp3";
import draw from "./../draw.mp3";

function AudioPlayer(props) {
	if (props.isWin) {
		return (
			<div>
				<audio id="fanfare" src={fanfare} autoPlay loop />
			</div>
		);
	} else if (props.isDraw) {
		return (
			<div>
				<audio id="fanfare" src={draw} autoPlay />
			</div>
		);
	}
	return null;
}

export default AudioPlayer;
