import React from "react";
import { Button } from '@material-ui/core'

class VideoPlayer extends React.Component {

    constructor(props) {
        super(props);
        this.refs = React.createRef();
        this.state = { Pausebtn: false };
    }

     //to stop playing audio and video at same time.
    componentDidMount() {
        document.addEventListener("play", function(evt)
        {
            if(window.$_currentlyPlaying && window.$_currentlyPlaying !== evt.target)
            {
                window.$_currentlyPlaying.pause();
            } 
            window.$_currentlyPlaying = evt.target;
        }, true);
    }

    playVideo = () => {
        // You can use the play method as normal on your video ref
        this.refs.vidRef.play();
        this.setState({Pausebtn:true});
        
    };

    pauseVideo = () => {
        // Pause as well
        this.refs.vidRef.pause();
        this.setState({Pausebtn:false});
    };
    
    render = () => {
        console.log('playeriddddd',this.state.playerid );
        console.log('urlllll',this.props.videourl );
        return (

            <div className="vd-player-cus">
               
                <video id={this.props.videoid} controlsList="nodownload" width="320" height="240"
                    ref="vidRef"
                    src={this.props.videourl}
                    type="video/mp4"
                />
            
                <div className="play-pause-buttons">
                    {this.state.Pausebtn === false ?
                 
                    <Button  className="play-icon btn" onClick={this.playVideo}>
                        Play!
                    </Button> :
                    <Button  className="pause-icon btn" onClick={this.pauseVideo}>
                        Pause!
                    </Button>
                }
               
                </div>
            
            </div>
            
        );
    };
}

export default VideoPlayer;