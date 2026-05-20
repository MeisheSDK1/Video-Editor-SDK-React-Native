import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  Image,
  SafeAreaView,
  TouchableHighlight,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import NvHomeIconImageArray from './NvHomeIconImageArray';
import { I18n } from './language/I18n';
import { serialize, deserialize } from 'json-typescript-mapper';
import {
  NvShortVideo,
  NvVideoEditEvent,
  NvVideoConfig,
  NvImageViewTheme,
  NvLabelTheme,
  NvEditConfig,
  NvThemeElementKey,
  NvButtonTheme,
  NvSliderTheme,
  NvTextFieldTheme,
  NvEditMenuItem,
  NvImageCaptionStyle,
  NvEditModeSource,
  NvEditMode,
  NvVideoCompileResolution,
  NvsCompileVideoBitrateGrade,
  NvExportImageType,
  NvTemplateConfig,
  NvViewTheme,
  NvRecordBtTheme,
  NvAlbumConfig,
  NvCaptureConfig,
  NvCaptureMenuItem,
  NvCaptureBottomMenuItem,
  NvVideoPreviewResolution,
  NvTimePair,
  NvBeautyConfig,
  NvBeautyCategorical,
  NvBeautyEffect,
  NvDualConfig,
  NvDualType,
  NvBubbleConfig,
  NvBubbleBgBlurStyle,
  NvWatermarkConfig,
  NvImageConfig,
  NvWaterMarkPosition,
} from 'react-native-nvshortvideo';

const RNFS = require('react-native-fs');

const HomeScreen = (props) => {
  // State
  const [flItems] = useState(['Captrue', 'Dual', 'Edit', 'Draft']);
  const [progressText, setProgressText] = useState("")
  
  // Refs
  const videoConfig = useRef(new NvVideoConfig());

    var assetAutoCutUrl = '';
    if (Platform.OS === 'ios') {
      assetAutoCutUrl = 'https://creative.meishesdk.com/api/app/aivideo/asset/all/1';
    } else {
      assetAutoCutUrl = 'materialcenter/recommend/listTemplate';
    }

  // Initialize server config
  useEffect(() => {
    const map = {
      host: 'https://mall.meishesdk.com/api/shortvideo/v1/',
      assetRequestUrl: 'materialcenter/mall/custom/listAllAssemblyMaterial',
      assetCategoryUrl: 'materialcenter/appSdkApi/listTypeAndCategory',
      assetMusiciansUrl: 'materialcenter/appSdkApi/listMusic',
      assetFontUrl: 'materialcenter/listFont',
      assetDownloadUrl: 'materialcenter/mall/custom/materialInteraction',
      assetPrefabricatedUrl: 'materialcenter/beautyAssets/latest',
      assetAutoCutUrl: assetAutoCutUrl,
      assetTagUrl: 'materialcenter/listTemplateTag',
      clientId: '7480f2bf193d417ea7d93d64',
      clientSecret: 'e4434ff769404f64b33f462331a80957',
      assemblyId: 'MEISHE_MATERIAL_LIST',
      isAbroad: 1,
    };

    const videoOperator = NvShortVideo.shareInstance();
    videoOperator.configServerInfo(map);
    videoOperator.setVideoEditEventHandler(handleVideoEditEvent);

    return () => {
      videoOperator.setVideoEditEventHandler(null);
    };
  }, []);

  const handleVideoEditEvent = (event, info) => {
    if (event === NvVideoEditEvent.publish) {
      props.navigation.navigate('VideoResult', { projectInfo: info });
    }
  };

  const pushToVideoEditFunction = (type) => {
    const videoOperator = NvShortVideo.shareInstance();
    videoOperator.downloadPrefabricatedMaterial()
    if (type === 'Captrue') {
      // test
      // videoConfig.current.captureConfig.defaultBottomMenuSelectItem = NvCaptureBottomMenuItem.video;
      // videoConfig.current.captureConfig.recordConfiguration = {"video encoder name": "hevc","gopsize":30};
      // videoConfig.current.compileConfig.configure = {"video encoder name": "hevc","gopsize":30};
      videoOperator.startVideoCaptrue(videoConfig.current);
    } else if (type === 'Edit') {
      videoOperator.startSeleteFilesForEdit(videoConfig.current);
    } else if (type === 'Draft') {
      videoOperator.getDraftList()
        .then((draftList) => {
          props.navigation.navigate('DraftList', {
            draftDataList: draftList,
            videoConfig: videoConfig.current,
          });
        })
        .catch(console.error);
    } else if (type === 'Dual') {
      videoOperator.startVideoDualCaptrue(videoConfig.current);
    }else if (type === 'Album') {
     videoOperator.openAlbum().then((filePaths) => {
          const watermarkConfig = new NvWatermarkConfig();
          watermarkConfig.watermark = new NvImageConfig()
          watermarkConfig.watermark.imageName = 'homepage_logo';
          watermarkConfig.width = 150;
          watermarkConfig.height = 150;
          watermarkConfig.offsetX = 20;
          watermarkConfig.offsetY = 20;
          watermarkConfig.position = NvWaterMarkPosition.TopRight;

          videoOperator.exportVideos(
            filePaths,
            '',
            watermarkConfig,
            (info) => {
              console.log('export progress:', info['progress'] || 0);
              setProgressText(info['progress'])
            },
            (info) => {
              console.log('export result:', info['result'] || 0, info['errorString'], info['outputFilePath']);
              setProgressText(info['outputFilePath'])
            }
          ).then((suc) => {
            console.log('exportVideos suc:', suc);
          }).catch((error) => {
            console.error('exportVideos error:', error);
          });
        })
        .catch(console.error);
    }
  };

  const renderItem = (item) => {
    return (
      <TouchableHighlight
        key={item}
        onPress={() => pushToVideoEditFunction(item)}
        underlayColor="rgba(197, 197, 209, 0.40)"
        style={[
          {
            borderRadius: 20,
            alignSelf: 'stretch',
            height: 41,
            marginBottom: 20,
            backgroundColor: 'rgba(197, 197, 209, 0.15)',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 33,
          },
        ]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Image
            style={{ height: 23, width: 23, marginRight: 20 }}
            source={NvHomeIconImageArray[item + 'Icon']}
            resizeMode={'contain'}
          />
          <Text style={{
            lineHeight: 41,
            textAlign: 'left',
            fontSize: 15,
            color: 'white',
            flex: 1,
          }}>
            {I18n.t(item)}
          </Text>
          <Image
            style={{ height: 5, width: 10, marginLeft: 20 }}
            source={require('./assets/home_arrow_right.png')}
            resizeMode={'contain'}
          />
        </View>
      </TouchableHighlight>
    );
  };

  const getBannerImage = () => {
    const currentLanguage = I18n.localeLanguage();
    return currentLanguage && currentLanguage.includes('zh') 
      ? require('./assets/home_banner.png')
      : require('./assets/home_banner_en.png');
  };

  const loadTestConfigFile = async () => {
    try {
      const testDir = RNFS.DocumentDirectoryPath + '/Config';
      const exists = await RNFS.exists(testDir);
      
      if (exists) {
        const jsonFilePath = testDir + '/test.json';
        await readTestConfigJsonFile(jsonFilePath);
      } else {
        await RNFS.mkdir(RNFS.DocumentDirectoryPath + '/Config');
      }
    } catch (err) {
      console.log('check test dir error:', err);
    }
  };

  const readTestConfigJsonFile = async (jsonFilePath) => {
    try {
      const exists = await RNFS.exists(jsonFilePath);
      if (exists) {
        const result = await RNFS.readFile(jsonFilePath, 'utf8');
        try {
          const jsonData = JSON.parse(result);
          videoConfig.current = deserialize(NvVideoConfig, jsonData);
          console.log('deserialize suc:' + jsonFilePath);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      } else {
        console.log('测试文件不存在:', jsonFilePath);
      }
    } catch (err) {
      console.log('check jsonFilePath error:', err);
    }
  };

  const fillTestTheme = () => {
    const config = videoConfig.current;
    
    config.primaryColor = '#0000FF';
    config.backgroundColor = '#00FA9A';
    config.panelBackgroundColor = '#000080';
    config.textColor = '#FFA500';
    config.secondaryTextColor = '#8A2BE2';
    config.enableLocalMusic = false;

    // Album config
    config.albumConfig.type = 1;
    config.albumConfig.maxSelectCount = 5;
    config.albumConfig.useAutoCut = false;

    // Capture config
    config.captureConfig.captureMenuItems = [
      NvCaptureMenuItem.device,
      NvCaptureMenuItem.speed,
      NvCaptureMenuItem.beauty,
      NvCaptureMenuItem.original,
      NvCaptureMenuItem.filter,
    ];
    config.captureConfig.captureBottomMenuItems = [
      NvCaptureBottomMenuItem.image,
      NvCaptureBottomMenuItem.video,
    ];
    config.captureConfig.captureDeviceIndex = 0;
    config.captureConfig.resolution = NvVideoPreviewResolution.NvVideoPreviewResolution_720;
    config.captureConfig.ignoreVideoRotation = false;
    config.captureConfig.imageDuration = 6 * 1000;
    config.captureConfig.autoSavePhotograph = true;
    
    const pair1 = new NvTimePair(1 * 1000, 10 * 1000);
    const pair2 = new NvTimePair(0, 50 * 1000);
    config.captureConfig.timeRanges = [pair1, pair2];
    const pair3 = new NvTimePair(0, 30 * 1000);
    config.captureConfig.smartTimeRange = pair3;
    config.captureConfig.beautyConfig = new NvBeautyConfig();
    config.captureConfig.beautyConfig.categoricalArray = [
      NvBeautyCategorical.Skin,
      NvBeautyCategorical.MicroShape,
    ];
    config.captureConfig.beautyConfig.beautyEffectArray = [
      NvBeautyEffect.Standard,
      NvBeautyEffect.WhiteA,
      NvBeautyEffect.Rosy,
    ];

    config.captureConfig.dualMenuItems = [
      NvCaptureMenuItem.device,
      NvCaptureMenuItem.dualtype,
      NvCaptureMenuItem.original,
    ];
    config.captureConfig.dualConfig = new NvDualConfig();
    config.captureConfig.dualConfig.left = 50.0 / 375.0;
    config.captureConfig.dualConfig.top = 50.0 / 666.67;
    config.captureConfig.dualConfig.limitWidth = 200 / 375.0;
    config.captureConfig.dualConfig.defaultType = NvDualType.topDown;
    config.captureConfig.dualConfig.supportedTypes = [
      NvDualType.topDown,
      NvDualType.leftRight,
    ];
    config.captureConfig.dualConfig.autoDisablesMic = true;

    config.captureConfig.filterDefaultValue = 1.0;
    config.captureConfig.enableCaptureAlbum = true;
    config.captureConfig.autoDisablesMic = true;

    // Edit config
    config.editConfig.editMenuItems = [
      NvEditMenuItem.release,
      NvEditMenuItem.download,
      NvEditMenuItem.text,
    ];
    config.editConfig.resolution = NvVideoPreviewResolution.NvVideoPreviewResolution_1080;
    config.editConfig.fps = 25;
    config.editConfig.minEffectDuration = 1000;
    config.editConfig.minAudioDuration = 3000;
    config.editConfig.captionColor = '#FFA500';
    config.editConfig.captionColorList = [
      '#FFFFFF',
      '#000000',
      '#0099F6',
      '#50C23B',
    ];
    config.editConfig.supportedCaptionStyles = [
      NvImageCaptionStyle.none,
      NvImageCaptionStyle.outline,
    ];
    config.editConfig.editModeSource = NvEditModeSource.firstAsset;
    config.editConfig.editMode = NvEditMode.NvEditMode9v16;
    config.editConfig.supportedEditModes = [
      NvEditMode.NvEditMode9v16,
      NvEditMode.NvEditMode16v9,
      NvEditMode.NvEditMode3v4,
      NvEditMode.NvEditMode4v3,
      NvEditMode.NvEditMode1v1,
      NvEditMode.NvEditMode18v9,
      NvEditMode.NvEditMode9v18,
      NvEditMode.NvEditMode8v9,
      NvEditMode.NvEditMode9v8,
    ];
    config.editConfig.bubbleConfig = new NvBubbleConfig();
    config.editConfig.bubbleConfig.titleTheme = new NvLabelTheme();
    config.editConfig.bubbleConfig.titleTheme.textColor = '#0000FF';
    config.editConfig.bubbleConfig.backgroundBlurStyle = NvBubbleBgBlurStyle.light;

    config.editConfig.filterDefaultValue = 1.0;
    config.editConfig.maxVolume = 1;

    // Compile config
    config.compileConfig.resolution = NvVideoCompileResolution.NvVideoCompileResolution_720;
    config.compileConfig.fps = 25;
    config.compileConfig.bitrateGrade = NvsCompileVideoBitrateGrade.NvsCompileBitrateGradeHigh;
    config.compileConfig.bitrate = -1;
    config.compileConfig.autoSaveVideo = true;

    // Template config
    config.templateConfig.maxSelectCount = 5;
    config.templateConfig.useAutoCut = false;

    // Custom theme
    const buttonTheme = new NvButtonTheme();
    buttonTheme.imageName = 'homepage_logo';

    const labelTheme = new NvLabelTheme();
    labelTheme.textColor = '#FF0000';

    const viewTheme = new NvViewTheme();
    viewTheme.backgroundColor = '#FF0000';

    const record = new NvRecordBtTheme();
    record.minimumTrackTintColor = '#FF0000';

    const customTheme = {
      [NvThemeElementKey.NvCaptureCloseBtKey]: buttonTheme,
      [NvThemeElementKey.NvCaptureDurationLabelKey]: labelTheme,
      [NvThemeElementKey.NvCaptureMusicMenuViewKey]: viewTheme,
      [NvThemeElementKey.NvCaptureRecordBtSetKey]: record,
    };
    config.captureConfig.customTheme = customTheme;
    const watermarkConfig = new NvWatermarkConfig();
    watermarkConfig.watermark = new NvImageConfig()
    watermarkConfig.watermark.imageName = 'homepage_logo';
    watermarkConfig.width = 150;
    watermarkConfig.height = 150;
    watermarkConfig.offsetX = 20;
    watermarkConfig.offsetY = 20;
    watermarkConfig.position = NvWaterMarkPosition.TopRight;
    config.compileConfig.watermarkConfig = watermarkConfig;
    const coverWatermarkConfig = new NvWatermarkConfig();
    coverWatermarkConfig.watermark = new NvImageConfig()
    const documentPath = (Platform.OS === 'ios') ? RNFS.DocumentDirectoryPath : RNFS.ExternalDirectoryPath;
    coverWatermarkConfig.watermark.imagePath = documentPath + '/coverlogo.png';
    coverWatermarkConfig.width = 150;
    coverWatermarkConfig.height = 150;
    coverWatermarkConfig.offsetX = 20;
    coverWatermarkConfig.offsetY = 20;
    coverWatermarkConfig.position = NvWaterMarkPosition.BottomRight;
    config.compileConfig.coverWatermarkConfig = coverWatermarkConfig;

    // shadow
    videoConfig.current.shadowColor = '#00000080';
    videoConfig.current.shadowOffset = { width: 0, height: 0.5 };
  };

  return (
    <LinearGradient
      colors={['#000000', '#2A313C']}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      locations={[0.0, 1.0]}
      style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, flexDirection: 'column', marginHorizontal: 28 }}>
        <Text style={{
          lineHeight: 40,
          marginTop: 20,
          textAlign: 'left',
          fontSize: 29,
          color: 'white',
        }}>
          {I18n.t('new_materials')}
        </Text>
        <Image
          style={{
            marginTop: 20,
            borderRadius: 10,
            width: '100%',
            height: undefined,
            aspectRatio: 2.0 / 1,
          }}
          source={getBannerImage()}
          resizeMode={'cover'}
        />
        <View style={{ marginTop: 25 }}>
          <LinearGradient
            colors={['#21272C', '#282F3B']}
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1.0, y: 1.0 }}
            locations={[0.0, 1.0]}
            style={{ borderRadius: 9 }}>
            <Text style={{
              lineHeight: 20,
              marginTop: 38,
              textAlign: 'left',
              fontSize: 15,
              color: '#AAAAAA',
              marginHorizontal: 20,
            }}>
              {I18n.t('select_function_noti')}
            </Text>
            <Text style={{
              lineHeight: 33,
              textAlign: 'left',
              fontSize: 23.5,
              fontWeight: 'bold',
              color: 'white',
              marginHorizontal: 20,
            }}>
              {I18n.t('function_list')}
            </Text>
            <View style={{ marginTop: 20, marginBottom: 30, marginHorizontal: 20 }}>
              {flItems.map(renderItem)}
            </View>
          </LinearGradient>
        </View>
        <View style={{ flex: 1 }} />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;
