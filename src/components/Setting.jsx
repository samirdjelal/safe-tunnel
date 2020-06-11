import React, {Component} from 'react';

class Setting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tab: 'publicKey'
		}
		this.changeTab = this.changeTab.bind(this);
	}
	
	render() {
		return (
			<div className={`Setting ${this.props.show?'Show':'Hide'} absolute rounded-lg shadow-md overflow-hidden border-t-4 bg-white p-4`}>
				<div className="flex">
					<div onClick={()=>this.changeTab('publicKey')} className={`${this.state.tab === 'publicKey' ? 'bg-gray-100 text-gray-700' : 'bg-gray-200 text-gray-600'} cursor-pointer border-t border-l p-2 text-sm border-b rounded-tl-md border-r`}>publicKey</div>
					<div onClick={()=>this.changeTab('privateKey')} className={`${this.state.tab === 'privateKey' ? 'bg-gray-100 text-gray-700' : 'bg-gray-200 text-gray-600'} cursor-pointer border-t p-2 text-sm border-b border-r`}>privateKey</div>
					<div onClick={()=>this.changeTab('publicKeyServer')} className={`${this.state.tab === 'publicKeyServer' ? 'bg-gray-100 text-gray-700' : 'bg-gray-200 text-gray-600'} cursor-pointer border-t p-2 text-sm border-b rounded-tr-md`}>publicKeyServer</div>
				</div>

				<div className="font-mono whitespace-pre overflow-x-scroll bg-gray-100 p-2 text-sm text-gray-600 rounded-tr-md rounded-b border-l border-r border-b " style={{height:420}}>
					{this.state.tab === 'publicKey' && this.props.publicKey}
					{this.state.tab === 'privateKey' && this.props.privateKey}
					{this.state.tab === 'publicKeyServer' && this.props.publicKeyServer}
				</div>
			</div>
		);
	}
	
	changeTab(tab) {
		this.setState({tab: tab})
	}
}

export default Setting;
