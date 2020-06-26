import React, {Component} from 'react';

const ipcRenderer = window.require('electron').ipcRenderer;

let userExistsTimeout;

class Connect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userExists: false
		}
		this.handleInputField = this.handleInputField.bind(this);
	}
	
	
	componentDidMount() {
		ipcRenderer.on('USER_EXISTS', () => {
			this.setState({userExists: true});
			clearTimeout(userExistsTimeout);
			userExistsTimeout = setTimeout(() => {
				this.setState({userExists: false});
			}, 4000)
		});
	}
	
	render() {
		return (
			<div className="mx-auto -mt-12 bg-white rounded-lg shadow-md overflow-hidden" style={{width: '90%'}}>
				<div id="message-container" className="border-t-4" style={{height: 486, borderColor: '#f6ad55'}}>
					
					
					<div className="text-xs text-center border-b text-white font-bold w-full"
					     style={{backgroundColor: '#fbd38d', borderColor: '#f6ad55', fontSize: 12, padding: '5px 0', textShadow: '#ab4400 1px 1px 3px'}}>
						END-TO-END ENCRYPTION ENABLED
					</div>
					
					
					<div className="py-4 px-8 w-full">
						{/*<div className="mb-2">User ID</div>*/}
						{/*<input type="text" id="create-uid" className="border leading-3 p-3 w-full focus:outline-none focus:shadow-outline rounded mb-6"/>*/}
						
						{this.state.userExists && <div className="bg-red-400 text-white py-2 px-3 mb-3 rounded">Please choose another name.</div>}
						
						<div className="mb-2 text-sm">Full Name</div>
						<input type="text" id="create-name" autoFocus={true} onKeyPress={this.handleInputField}
						       className="border leading-3 p-3 w-full focus:outline-none focus:shadow-outline rounded mb-6"/>
						
						{/*<div onClick={this.props.handleWSConnect}*/}
						{/*     className="shadow bg-red-400 border-red-500 text-white rounded text-center py-3 cursor-pointer hover:bg-red-500 hover:border-red-600 border-b-4 " style={{textShadow: '#861616 1px 1px 4px'}}>Connect*/}
						{/*</div>*/}
						
						<div onClick={() => {
							this.setState({userExists: false});
							this.props.handleWSConnect()
						}}
						     className="shadow bg-gray-400 border-gray-500 text-white rounded text-center py-3 cursor-pointer hover:bg-gray-500 hover:border-gray-600 border-b-4 "
						     style={{}}>Connect
						</div>
						
						{/*<div onClick={this.props.handleWSConnect}*/}
						{/*     className="shadow text-white rounded text-center py-3 cursor-pointer hover:bg-red-500 hover:border-red-600 border-b-4 " style={{textShadow: '#861616 1px 1px 4px',backgroundColor:'#fbd38d', borderColor:'#f6ad55'}}>Connect*/}
						{/*</div>*/}
					
					
					</div>
				
				
				</div>
			</div>
		);
	}
	
	
	handleInputField(e) {
		if (e.key === 'Enter') {
			this.setState({userExists: false});
			this.props.handleWSConnect();
		}
	}
	
}

export default Connect;
