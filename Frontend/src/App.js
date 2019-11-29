import React, { Component } from 'react'
import './App.css'
import Chat from './Chat'
import VideoPlayer from './Video'

const videoJsOptions = {
  autoplay: true,
  controls: false,
  height: 500,
  sources: [{
    src: 'http://142.93.53.35:8080/hls/cinema.m3u8',
    type: 'application/x-mpegURL'
  }]
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>CINEMA TIME</h1>
        <div className="Video" >
        <VideoPlayer { ...videoJsOptions } />
        </div>
        <Chat />
      </div>
    )
  }
}

export default App