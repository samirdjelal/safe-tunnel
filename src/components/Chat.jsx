import React, {Component, Fragment} from 'react';

class Chat extends Component {
	constructor(props) {
		super(props);
		this.handleSendMessage = this.handleSendMessage.bind(this);
		this.handleInputField = this.handleInputField.bind(this);
		this.handleFileChange = this.handleFileChange.bind(this);
		this.downloadFile = this.downloadFile.bind(this);
	}
	
	render() {
		
		setTimeout(() => {
			let messageContainer = document.getElementById("message-container");
			messageContainer.scrollTop = messageContainer.scrollHeight;
		}, 100)
		
		const me = this.props.uid;
		return (
			<div className="mx-auto -mt-12 mb-5 bg-white rounded-lg shadow-md overflow-hidden" style={{width: '90%'}}>
				
				<div id="message-container" className="overflow-y-scroll p-4 pt-2 border-t-4" style={{height: 438}}>
					
					{this.props.messages.map((message, index) => {
						
						if (message.alert) {
							return <Fragment key={index}>
								<div className="text-xs uppercase text-gray-500 text-center py-2 px-4">{message.alert}</div>
							</Fragment>
						}
						
						// const SIGNATURE = message.signature.data.toString()
						
						if (message.fileName) {
							let size = message.fileSize, sizeExt = ['Bytes', 'KB', 'MB', 'GB'];
							let i = 0;
							while (size > 900) {
								size /= 1024;
								i++;
							}
							size = (Math.round(size * 100) / 100) + ' ' + sizeExt[i];
							
							
							return <Fragment key={index}>
								<div className="flex mb-3" style={{direction: (me === message.uid ? 'rtl' : 'ltr')}}>
									<div className={`shadow-md h-10 w-10 rounded-full text-center leading-10 text-white text-xl ${me === message.uid ? 'bg-blue-400 ml-2' : 'bg-red-400 mr-2'}`}>
										{message.name.charAt(0).toUpperCase()}
									</div>
									<div className="flex-1">
										
										<div className={` px-2 pb-1 uppercase text-xs font-bold ${me === message.uid ? 'text-blue-400' : 'text-red-400'}`}>{message.name}</div>
										
										<div className="cursor-pointer p-3 rounded-lg overflow-hidden bg-gray-100 shadow text-gray-700 w-auto inline-block break-words "
										     style={{direction: 'ltr'}} title={message.signature}
										     onClick={() => this.downloadFile(message.fileData, message.fileName)}>
											
											<div className="flex">
												<div className="w-6 h-6 mr-1">
													<svg className="fill-current" fill="currentColor" viewBox="0 0 20 20">
														<path fillRule="evenodd"
														      d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
														      clipRule="evenodd"/>
													</svg>
												</div>
												<div className="leading-6 flex-1 text-sm font-bold">{message.fileName}</div>
											</div>
										</div>
										<div className={`text-xs -mt-1 text-gray-600 ${me === message.uid ? 'text-right' : 'text-left'}`} style={{direction: 'ltr'}}>{size}</div>
									</div>
								
								</div>
							</Fragment>
						}
						
						return <Fragment key={index}>
							<div className="flex mb-3" style={{direction: (me === message.uid ? 'rtl' : 'ltr')}}>
								
								<div className={`shadow-md h-10 w-10 rounded-full text-center leading-10 text-white text-xl ${me === message.uid ? 'bg-blue-400 ml-2' : 'bg-red-400 mr-2'}`}>
									{message.name.charAt(0).toUpperCase()}
								</div>
								
								<div className="flex-1">
									
									<div className={`px-2 pb-1 uppercase text-xs font-bold ${me === message.uid ? 'text-blue-400' : 'text-red-400'}`}>{message.name}</div>
									
									<div className="p-3 rounded-lg overflow-hidden bg-gray-100 shadow text-gray-700 w-auto inline-block break-words "
									     style={{direction: 'ltr'}} title={message.signature}>{message.body}</div>
								</div>
							
							</div>
						</Fragment>
					})}
				
				</div>
				
				<div className="h-12 border-t flex">
					
					<input className="hidden" onChange={this.handleFileChange} type="file" id="file-input"/>
					
					<div className="h-12 p-3 w-12 bg-gray-100 border-r text-center cursor-pointer text-gray-600 hover:text-gray-900"
					     onClick={() => document.getElementById('file-input').click()}>
						<svg className="fill-current" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
							      clipRule="evenodd"/>
						</svg>
					</div>
					
					<div className="h-12 flex-1" onKeyPress={this.handleInputField}>
						<input type="text" autoFocus={true} id="message-field" className="h-full w-full px-3 outline-none"/>
					</div>
					
					{/*<div className="h-12 p-2 w-12 bg-gray-100 border-l text-center cursor-pointer text-gray-600 hover:text-gray-900" onClick={this.handleSendMessage}>*/}
					<div className="h-12 w-12 p-2 bg-gray-100 border-l text-center cursor-pointer text-gray-600 hover:text-gray-900" onClick={this.handleSendMessage}>
						<svg className="fill-current " fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
						</svg>
					</div>
				</div>
			
			
			</div>
		
		
		);
	}
	
	
	handleInputField(e) {
		if (e.key === 'Enter') this.handleSendMessage()
	}
	
	handleSendMessage() {
		const messageField = document.getElementById('message-field').value;
		if (messageField.length <= 0) return;
		this.props.handleSendMessage(messageField)
		document.getElementById('message-field').value = '';
	}
	
	handleFileChange(e) {
		if (e.target.files.length <= 0) return;
		const file = e.target.files[0];
		this.props.handleSendFile(file)
	}
	
	downloadFile(fileData, fileName = '') {
		const link = document.createElement('a');
		link.href = fileData;
		link.setAttribute('download', fileName);
		document.body.appendChild(link);
		link.click();
		link.remove();
		window.URL.revokeObjectURL(fileData);
	}
	
}

export default Chat;
