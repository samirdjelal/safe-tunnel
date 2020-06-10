import React, {Component} from 'react';

class Setting extends Component {
	render() {
		// console.log(this.props.show)
		return (
			// bg-white
			<div className={`Setting ${this.props.show?'Show':'Hide'} absolute rounded-lg shadow-md overflow-hidden border-t-4 bg-white p-4`}>
				Setting
			</div>
		);
	}
}

export default Setting;
