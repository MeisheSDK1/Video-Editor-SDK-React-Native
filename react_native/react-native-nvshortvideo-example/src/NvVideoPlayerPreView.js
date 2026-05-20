import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import RNFS from 'react-native-fs';

class NvVideoPlayerPreView extends Component {
  constructor(props) {
    super(props);
    const {params} = this.props.route;
    this.state = {
      videoPath: params.videoPath,
      paused: false,
      duration: 0,
      currentTime: 0,
      isBuffering: true,
      isEnded: false,
    };
  }

  componentWillUnmount() {
    this.setState({ paused: true });
  }

  formatTime = seconds => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h > 0 ? h : null, m > 9 ? m : `0${m}`, s > 9 ? s : `0${s}`]
      .filter(a => a !== null)
      .join(':');
  };

  handleLoad = ({duration}) => {
    this.setState({duration, isBuffering: false});
  };

  handleProgress = ({currentTime}) => {
    this.setState({currentTime});
  };

  handleBuffer = ({isBuffering}) => {
    this.setState({isBuffering});
  };

  handleEnd = () => {
    this.setState({paused: true, isEnded: true});
  };

  handlePlayPause = () => {
    if (this.state.isEnded) {
      this.videoRef.seek(0);
      this.setState({isEnded: false, paused: false});
    } else {
      this.setState(prevState => ({paused: !prevState.paused}));
    }
  };

  handleSlidingComplete = value => {
    if (this.videoRef) {
      this.videoRef.seek(value);
    }
    this.setState({paused: false, isEnded: false});
  };

  render() {
    const {videoPath, paused, duration, currentTime, isBuffering} = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.videoContainer}>
          <Video
            ref={ref => {
              this.videoRef = ref;
            }}
            source={{uri: `file://${videoPath}`}}
            style={styles.video}
            paused={paused}
            resizeMode="contain"
            onLoad={this.handleLoad}
            onProgress={this.handleProgress}
            onBuffer={this.handleBuffer}
            onEnd={this.handleEnd}
            onError={e => console.error('Video Error:', e)}
          />
          {isBuffering && (
            <ActivityIndicator
              size="large"
              color="#fff"
              style={styles.bufferIndicator}
            />
          )}
        </View>
        <View style={styles.controls}>
          <TouchableOpacity onPress={this.handlePlayPause}>
            <Text style={styles.icon}>{paused ? '▶️' : '⏸️'}</Text>
          </TouchableOpacity>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={currentTime}
            minimumTrackTintColor="#FC3E5A"
            maximumTrackTintColor="#000000"
            thumbTintColor="#FFFFFF"
            onValueChange={value => {
              this.setState({currentTime: value, paused: true, isEnded: false});
            }}
            onSlidingComplete={this.handleSlidingComplete}
          />
          <Text style={styles.timeText}>
            {this.formatTime(currentTime) + '/' + this.formatTime(duration)}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  bufferIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 30,
  },
  timeText: {
    color: 'white',
    paddingHorizontal: 5,
  },
  slider: {
    flex: 1,
    height: 20,
    marginLeft: 10,
  },
  icon: {
    color: 'white',
    fontSize: 30,
  },
});

export default NvVideoPlayerPreView;
