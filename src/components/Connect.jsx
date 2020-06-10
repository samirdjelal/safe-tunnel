import React, {Component} from 'react';

class Connect extends Component {
	constructor(props) {
		super(props);
		this.handleInputField = this.handleInputField.bind(this);
	}
	
	render() {
		return (
			<div className="mx-auto -mt-12 bg-white rounded-lg shadow-md overflow-hidden" style={{width: '90%'}}>
				<div id="message-container" className="border-t-4 border-green-300" style={{height: 438}}>
					
					<div className="text-xs text-center bg-green-200 border-green-300 border-b text-green-600 font-bold w-full" style={{fontSize: 12, padding: '5px 0', textShadow: '#7df955 1px 1px 2px'}}>
						END-TO-END ENCRYPTION ENABLED
					</div>
					
					<div className="py-4 px-6 w-full">
						{/*<div className="mb-2">User ID</div>*/}
						{/*<input type="text" id="create-uid" className="border leading-3 p-3 w-full focus:outline-none focus:shadow-outline rounded mb-6"/>*/}
						
						<div className="mb-2 text-sm">Full Name</div>
						<input type="text" id="create-name" autoFocus={true} onKeyPress={this.handleInputField} className="border leading-3 p-3 w-full focus:outline-none focus:shadow-outline rounded mb-6"/>
						
						<div onClick={this.props.handleWSConnect}
						     className="shadow bg-red-400 border-red-500 text-white rounded text-center py-3 cursor-pointer hover:bg-red-500 hover:border-red-600 border-b-4 ">Connect
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
