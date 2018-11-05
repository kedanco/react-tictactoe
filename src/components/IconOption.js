import React from "react";

class IconOption extends React.Component {
	render() {
		return (
			<option key={this.props.opt} value={this.props.opt}>
				{this.props.opt}
			</option>
		);
	}
}

export default IconOption;
