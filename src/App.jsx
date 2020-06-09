import React from 'react';
import Header from "./components/Header";
import Chat from "./components/Chat";
import Connect from "./components/Connect";

const ipcRenderer = window.require('electron').ipcRenderer;
const crypto = require('crypto');

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 'connect', // chat
			uid: '',
			name: '',
			messages: [],
			privateKey: null,
			publicKey: null,
			publicKeyServer: null
		}
		this.handleSendMessage = this.handleSendMessage.bind(this);
		this.handleWSConnect = this.handleWSConnect.bind(this);
	}
	
	componentDidMount() {
		
		ipcRenderer.on('RECEIVE_MESSAGE', (event, args) => {
			console.log(args)
			if (args.body && args.body.length > 0) {
				this.setState(prevState => ({
					messages: [...prevState.messages, args]
				}))
			}
		})
		
		ipcRenderer.on('CONNECTED', (event, args) => {
			this.setState(prevState => ({
				page: 'chat',
				uid: args.uid,
				name: args.name,
				publicKeyServer: args.publicKeyServer
			}))
		})
		
		ipcRenderer.on('KEYS_GENERATED', (event, args) => {
			console.log(args)
			this.setState({
				privateKey: args.privateKey,
				publicKey: args.publicKey
			});
			// if (args.body && args.body.length > 0) {
			// 	this.setState(prevState => ({
			// 		messages: [...prevState.messages, args]
			// 	}))
			// }
		})
		
		
	}
	
	render() {
		return (
			<div className="App">
				<Header {...this.state}/>
				{this.state.page === 'connect' && <Connect handleWSConnect={this.handleWSConnect}/>}
				{this.state.page === 'chat' && <Chat {...this.state} handleSendMessage={this.handleSendMessage}/>}
			</div>
		);
	}
	
	
	handleSendMessage(messageField) {
		ipcRenderer.send('SEND_MESSAGE', {
			uid: this.state.uid,
			name: this.state.name,
			body: messageField,
		});
		// this.setState(prevState => ({
		// 	messages: [...prevState.messages, {
		// 		uid: this.state.uid,
		// 		name: this.state.name,
		// 		body: messageField
		// 	}]
		// }));
	}
	
	handleWSConnect() {
		// const uidField = document.getElementById('create-uid').value;
		const nameField = document.getElementById('create-name').value;
		const uidField = crypto.createHash('sha256').update(nameField).digest('hex');
		
		ipcRenderer.send('CONNECT', {
			uid: uidField,
			name: nameField,
			action: 'connect'
		});
	}
	
}

export default App;
