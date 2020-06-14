import React, {Component} from 'react';

class Setting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tab: 'publicKey'
		}
		this.changeTab = this.changeTab.bind(this);
		this.handleInputField = this.handleInputField.bind(this);
	}
	
	render() {
		return (
			<div className={`Setting ${this.props.show ? 'Show' : 'Hide'} absolute rounded-lg shadow-md overflow-hidden border-t-4 bg-white p-4`}>
				
				<div className="mb-4">
					<div className="mb-2 text-sm">Change Channel</div>
					<div className="relative">
						<input type="text" defaultValue={this.props.channel} id="change-channel" onKeyPress={this.handleInputField}
						       className="block border leading-3 p-3 w-full focus:outline-none focus:shadow-outline rounded pr-24 "/>
						<div className="top-0 right-0 h-full absolute px-3 py-3 rounded-r border cursor-pointer bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-600"
						     onClick={this.props.handleChangeChannel}>Switch
						</div>
					</div>
				
				</div>
				
				<div className="flex">
					<div onClick={() => this.changeTab('publicKey')}
					     className={`${this.state.tab === 'publicKey' ? 'bg-gray-100 text-gray-700' : 'bg-gray-200 text-gray-600'} cursor-pointer border-t border-l p-2 text-sm rounded-tl-md border-r`}>publicKey
					</div>
					<div onClick={() => this.changeTab('privateKey')}
					     className={`${this.state.tab === 'privateKey' ? 'bg-gray-100 text-gray-700' : 'bg-gray-200 text-gray-600'} cursor-pointer border-t p-2 text-sm border-r`}>privateKey
					</div>
					<div onClick={() => this.changeTab('publicKeyServer')}
					     className={`${this.state.tab === 'publicKeyServer' ? 'bg-gray-100 text-gray-700' : 'bg-gray-200 text-gray-600'} cursor-pointer border-t border-r p-2 text-sm rounded-tr-md`}>publicKeyServer
					</div>
				</div>
				
				<div className="font-mono whitespace-pre overflow-x-scroll bg-gray-100 p-2 text-sm text-gray-600 rounded-tr-md rounded-b border " style={{height: 340}}>
					{this.state.tab === 'publicKey' && this.props.publicKey}
					{this.state.tab === 'privateKey' && this.props.privateKey}
					{this.state.tab === 'publicKeyServer' && this.props.publicKeyServer}
				</div>
			</div>
		);
	}
	
	handleInputField(e) {
		if (e.key === 'Enter') this.props.handleChangeChannel()
	}
	
	changeTab(tab) {
		this.setState({tab: tab})
	}
}

export default Setting;
