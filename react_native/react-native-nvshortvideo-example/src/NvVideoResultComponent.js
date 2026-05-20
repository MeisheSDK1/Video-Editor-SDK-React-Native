import React, { Component } from 'react';
import {
  Text,
  TextInput,
  ImageBackground,
  TouchableHighlight,
  View,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { I18n } from './language/I18n';
import RNProgressHud from 'progress-hud';
import { NvShortVideo, NvVideoCompileEvent } from 'react-native-nvshortvideo';

const ProgressHUDMaskType = RNProgressHud.ProgressHUDMaskType;

class NvVideoResultComponent extends Component {

  timer = null;

  constructor(props) {
    super(props);
    const { params } = this.props.route;
    this.state = {
      projectInfo: params.projectInfo,
      saveVideoShowPath: false,
      text: params.projectInfo.draftInfo,
    };
  }
  componentDidMount() {
    NvShortVideo.shareInstance().setVideoCompileEventHandler(
      this.handleEvent.bind(this),
    );
  }

  componentWillUnmount() {
    if (this.timer) { 
    clearTimeout(this.timer); 
    this.timer = null;
    }
    NvShortVideo.shareInstance().setVideoCompileEventHandler(null);
    NvShortVideo.shareInstance().exitEdit(this.state.projectInfo.projectId);
  }

 showWithDuration(text, duration = 1000) {
  if (this.timer) {
    clearTimeout(this.timer);
  }

  RNProgressHud.showInfoWithStatus(text);

  this.timer = setTimeout(() => {
    RNProgressHud.dismiss();
    this.timer = null;
  }, duration);
}

  handleEvent(nMethod, nArguments) {
    // console.log('------->🌹  nMethod:', nMethod);
    if (nMethod == NvVideoCompileEvent.progress) {
      //更新进度
      //Update progress
    } else if (nMethod == NvVideoCompileEvent.complete) {
      RNProgressHud.dismiss();
      NvShortVideo.shareInstance().getPublishInfo().then((publishInfo) => {
        console.log('------->🌹  publishInfo videoPath:', publishInfo.videoPath);
        console.log('------->🌹  publishInfo template.name:', publishInfo.templateInfo);
        console.log('------->🌹  publishInfo musicInfo', publishInfo.musicInfo);
        console.log('------->🌹  publishInfo template:', publishInfo.templateInfo);
      });
      let errorCode = nArguments.errorCode;
      if (errorCode == 0) {
        //成功
        //Sucess
        let outputPath = nArguments.outputPath;
        console.log('------->🌹  outputPath:', outputPath);
        this.showWithDuration(
            I18n.t('Save_suc') + outputPath
        );
      } else if (errorCode == 1) {
        //取消
        //Cancel
        this.showWithDuration(I18n.t('Cancelled'));
      } else {
        //失败
        //Failed
        console.log('Completed error:', nArguments);
        this.showWithDuration(I18n.t('Error') + errorCode);
      }
    } else if (nMethod == NvVideoCompileEvent.coverImageSelected) {
      let imagePath = nArguments.coverImagePath;
      if (imagePath) {
        this.setState({
          projectInfo: { ...this.state.projectInfo, coverImagePath: imagePath },
        });
      }
    } else if (nMethod == NvVideoCompileEvent.generateImagesResult) {
      console.log('GenerateImagesResult:', nArguments);
      this.showWithDuration(I18n.t('Save_suc'));
    }
  }
  pushToVideoEditFunction(type) {
    if (type == 'SaveDraft') {
      NvShortVideo.shareInstance()
        .saveDraft(this.state.text)
        .then(ret => {
          this.props.navigation.goBack();
        })
        .catch(error => {
          // 处理错误
          console.error(error);
        });
    } else if (type == 'SaveImage') {
      //保存到相册
      //Save to album
      NvShortVideo.shareInstance()
        .saveImageToAlbum().then(ret => {
          console.log('Image saved to album:', ret);
          this.showWithDuration(I18n.t('Save_suc'));
        })
    } else if (type == 'ShowPanel') {
      NvShortVideo.shareInstance().showSaveOptionsPanel().then(
        (index) => {
          
          if (index == 0) {
            //保存到相册
            //Save to album
            NvShortVideo.shareInstance()
              .saveImageToAlbum().then(ret => {
                console.log('Image saved to album:', ret);
                this.showWithDuration(I18n.t('Save_suc'));
              })
          } else if (index == 2) {
                this.showWithDuration(I18n.t('Save_suc'));
          } else {
            RNProgressHud.showWithStatus(
              I18n.t('Compiling'),
              ProgressHUDMaskType.Clear,
            );
            NvShortVideo.shareInstance()
              .compileCurrentTimeline({})
              .then(ret => {
                //
              })
              .catch(error => {
                // 处理错误
                console.error(error);
                RNProgressHud.dismiss();
              });
          }
        }
      );
    } else {
      console.log('aaaaa333');
      RNProgressHud.showWithStatus(
        I18n.t('Compiling'),
        ProgressHUDMaskType.Clear,
      );
      NvShortVideo.shareInstance()
        .compileCurrentTimeline({})
        .then(ret => {
          //
        })
        .catch(error => {
          // 处理错误
          console.error(error);
          RNProgressHud.dismiss();
        });
    }
  }

  endTextEdit() {
    Keyboard.dismiss();
  }

  saveLocal() {
    NvShortVideo.shareInstance().isOnlyHaveMultiImage().then((isOnlyHaveImage) => {
      console.log('isOnlyHaveImage:', isOnlyHaveImage);
      if (isOnlyHaveImage) {
        this.pushToVideoEditFunction('ShowPanel');
      } else {
        this.setState({ saveVideoShowPath: false }, () => {
          this.pushToVideoEditFunction('Compile');
        })
      }
    })
  }

  renderBottomBts = hasDraft => {
    var btArray = [];
    var btTitles = hasDraft
      ? ['SaveDraft', 'SaveImage', 'Compile']
      : ['SaveImage', 'Compile'];
    var btTypes = [0, 1];
    btTitles.forEach(item => {
      btArray.push(
        <TouchableHighlight
          key={item}
          onPress={() =>
            this.setState({ saveVideoShowPath: true }, () => {
              if(item == 'Compile'){
                this.saveLocal();
              } else {
                this.pushToVideoEditFunction(item);
              }
            })
          }
          style={{
            height: 50,
            width: 100,
            borderRadius: 11,
            backgroundColor: item == 'SaveDraft' ? '#2F2F2F' : '#FC3E5A',
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              lineHeight: 18,
              fontSize: 14,
              paddingHorizontal: 5,
              fontWeight: 'bold',
              textAlign: 'center',
              textAlignVertical: 'center',
              color: 'white',
            }}
            numberOfLines={2}>
            {I18n.t(item)}
          </Text>
        </TouchableHighlight>,
      );
    });
    return (
      <View
        style={{
          height: 100,
          marginBottom: 30,
          flexDirection: 'row',
          alignItems: 'stretch',
          justifyContent: 'space-around',
        }}>
        {btArray}
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#141414',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
        }}>
        <View
          style={{
            height: 160,
            marginTop: 35,
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}>
          <TextInput
            style={{
              flex: 1,
              height: 160,
              fontSize: 15,
              marginLeft: 25,
              marginRight: 30,
              color: 'white',
              textAlignVertical: 'top',
            }}
            placeholder={I18n.t('PublishInfo')}
            placeholderTextColor="#808080"
            multiline={true}
            onChangeText={text => this.setState({ text })}>
            {this.state.projectInfo.draftInfo}
          </TextInput>
          <TouchableOpacity
            onPress={() =>
              NvShortVideo.shareInstance()
                .selectCoverImage()
                .then(ret => { })
                .catch(error => {
                  // 处理错误
                  console.error(error);
                  RNProgressHud.dismiss();
                })
            }>
            <ImageBackground
              style={{
                width: 82,
                height: 110,
                marginRight: 16,
                borderRadius: 7.5,
                backgroundColor: '#707070',
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              source={{ uri: this.state.projectInfo.coverImagePath }}
              resizeMode={'cover'}>
              {(
                <>
                  
                  <TouchableOpacity
                    onPress={() =>
                      NvShortVideo.shareInstance()
                        .selectCoverImage()
                        .then(ret => { })
                        .catch(error => {
                          // 处理错误
                          console.error(error);
                          RNProgressHud.dismiss();
                        })
                    }
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}>
                    <Text
                      style={{
                        lineHeight: 15,
                        fontSize: 10,
                        paddingHorizontal: 5,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        textAlign: 'center',
                        color: 'white',
                      }}>
                      {I18n.t('selectCover')}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            {
              flex: 1,
              // backgroundColor: '#1461ff',
              // underlayColor: 'red',
              alignSelf: 'stretch',
            },
          ]}
          onPress={() => Keyboard.dismiss()}>
          <Text> </Text>
        </TouchableOpacity>
        {this.renderBottomBts(this.state.projectInfo.hasDraft)}
      </View>
    );
  }
}

export default NvVideoResultComponent;
