import React from 'react';
import videojs from 'video.js'

export default class VideoPlayer extends React.Component {
  componentDidMount() {
    // instantiate Video.js
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      console.log('onPlayerReady', this)
    });
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <div>	
        <div data-vjs-player>
          <link href="https://unpkg.com/video.js@7/dist/video-js.min.css" rel="stylesheet"/>
          <link href="https://unpkg.com/@videojs/themes@1/dist/forest/index.css" rel="stylesheet"/>
          <video ref={ node => this.videoNode = node } className="video-js vjs-theme-forest"></video>
        </div>
      </div>
    )
  }
}