import React, {Component} from 'react';
import {
  Text,
  Image,
  TouchableHighlight,
  View,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {I18n} from './language/I18n';

import {NvShortVideo, NvVideoConfig} from 'react-native-nvshortvideo';

class NvDraftListComponent extends Component {
  constructor(props) {
    super(props);
    const {params} = this.props.route;
    this.state = {
      draftDataList: params.draftDataList,
    };
    this.videoConfig = params.videoConfig;
  }
  componentDidMount() {
    NvShortVideo.shareInstance().setDraftUpdateHandler(
      this.refreshDraftListData.bind(this),
    );
  }

  componentWillUnmount() {
    NvShortVideo.shareInstance().setDraftUpdateHandler(null);
  }

  refreshDraftListData() {
    //重新获取草稿列表
    //reload draft list
    NvShortVideo.shareInstance()
      .getDraftList()
      .then(result => {
        this.setState({
          draftDataList: result,
        });
      })
      .catch(error => {
        // 处理错误
        console.error(error);
      });
  }

  pushToVideoEditFunction(itemId) {
    if (this.videoConfig == null) {
      this.videoConfig = new NvVideoConfig();
      console.log('videoConfig is null');
    }
    NvShortVideo.shareInstance()
      .reeditDraft(itemId, this.videoConfig)
      .then(result => {
        //
      })
      .catch(error => {
        // 处理错误
        console.error(error);
      });
  }

  deleteDraft(data, rowMap) {
    const rowKey = data.item.projectId;
    if (rowMap && rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
    NvShortVideo.shareInstance()
      .deleteDraft(data.item.projectId)
      .then(result => {
        this.setState(prevState => ({
          draftDataList: prevState.draftDataList.filter(
            item => item.projectId !== rowKey,
          ),
        }));
      })
      .catch(error => {
        // 处理错误
        console.error(error);
      });
  }

  renderItem = draftItem => {
    var textInfo = draftItem.draftInfo
    if (textInfo.length == 0) {
      textInfo = I18n.t('Draft') + draftItem.defaultProjectDescription
      if (textInfo == 0) {
        textInfo = I18n.t('addDescription')
      }
    }
    return (
      <TouchableHighlight
        key={draftItem.projectId}
        onPress={() => this.pushToVideoEditFunction(draftItem.projectId)}
        style={{
          height: 100,
          backgroundColor: '#141414',
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'top',
            justifyContent: 'flex-start',
            paddingTop: 15,
          }}>
          <Image
            style={{
              height: 70,
              width: 70,
              marginLeft: 22,
              backgroundColor: 'black',
            }}
            source={{uri: draftItem.coverImagePath}}
            resizeMode={'center'}
          />
          <Text
            style={{
              flex: 1,
              fontSize: 12,
              lineHeight: 17,
              marginLeft: 10,
              marginRight: 22,
              color: '#C4C4C4',
            }}
            numberOfLines={4}>
            {textInfo}
          </Text>
        </View>
      </TouchableHighlight>
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
        <SwipeListView
          style={{
            flex: 1,
          }}
          disableRightSwipe
          data={this.state.draftDataList}
          keyExtractor={item => item.projectId}
          renderItem={({item}) => {
            return this.renderItem(item);
          }}
          useNativeDriver={false}
          rightOpenValue={-75}
          ListHeaderComponent={
            <Text
              style={{
                fontSize: 13,
                lineHeight: 20,
                marginHorizontal: 22,
                marginTop: 30,
                marginBottom: 10,
                color: 'white',
              }}>
              {I18n.t('DraftTip')}
            </Text>
          }
          renderHiddenItem={(data, rowMap) => (
            <View style={styles.rowBack}>
              <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => this.deleteDraft(data, rowMap)}>
                <Text style={styles.backTextWhite}>{I18n.t('Delete')}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backTextWhite: {
    color: '#FFF',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
});

export default NvDraftListComponent;
