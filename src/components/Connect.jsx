import React, {Component} from 'react';

class Connect extends Component {
	constructor(props) {
		super(props);
		this.handleInputField = this.handleInputField.bind(this);
	}
	
	render() {
		return (
			<div className="mx-auto -mt-12 bg-white rounded-lg shadow-md overflow-hidden" style={{width: '90%'}}>
				<div id="message-container" className="overflow-y-scroll py-4 px-6 border-t-4" style={{height: 438}}>
					<div>
						{/*<div className="mb-2">User ID</div>*/}
						{/*<input type="text" id="create-uid" className="border leading-3 p-3 w-full focus:outline-none focus:shadow-outline rounded mb-6"/>*/}
						
						<div className="mb-2">Full Name</div>
						<input type="text" id="create-name" autoFocus={true} onKeyPress={this.handleInputField} className="border leading-3 p-3 w-full focus:outline-none focus:shadow-outline rounded mb-6"/>
						
						<div onClick={this.props.handleWSConnect}
						     className="bg-red-400 border-red-500 text-white rounded text-center py-3 cursor-pointer hover:bg-red-500 hover:border-red-600 border-b-4 ">Connect
						</div>
					</div>
				
				</div>
			</div>
		);
	}
	
	
	handleInputField(e) {
		if (e.key === 'Enter') this.props.handleWSConnect()
	}
	
}

export default Connect;
