import React, { Component } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import './Chat.css'
const URL = 'wss://jxjsgplwv2.execute-api.us-east-1.amazonaws.com/ChatQA'

class Chat extends Component {
  state = {
    name: 'Bob',
    messages: [],
  }

  ws = new WebSocket(URL)

  componentDidMount() {
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected')
    }

    this.ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      const message = JSON.parse(evt.data)
      console.log(message);
      this.addMessage(message)
    }

    this.ws.onclose = () => {
      console.log('disconnected')
      // automatically try to reconnect on connection loss
      this.setState({
        ws: new WebSocket(URL),
      })
    }
  }

  addMessage = message =>
    this.setState(state => ({ messages: [...state.messages, message] }))

  submitMessage = messageString => {
    // on submitting the ChatInput form, send the message, add it to the list and reset the input
    const message = { name: this.state.name, message: messageString }
    this.ws.send(JSON.stringify(message))
    this.addMessage(message)
  }

  render() {
    return (
      <div>
        <label htmlFor="name">
          Name:&nbsp;
          <input
            type="text"
            id={'name'}
            placeholder={'Enter your name...'}
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
          />
        </label>
        <ChatInput
          ws={this.ws}
          onSubmitMessage={messageString => this.submitMessage(messageString)}
        />
        <div className="Scroll">
          {this.state.messages.map((message, index) =>
            <ChatMessage
              key={index}
              message={message.message}
              name={message.name}
            />,
          )}
        </div>
      </div>
    )
  }
}

export default Chat