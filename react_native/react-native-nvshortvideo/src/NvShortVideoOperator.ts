import { NvVideoOperator, NvVideoEditEvent, NvVideoCompileEvent, NvMusicInfo, NvPublishInfo, NvMusicInfoModel, NvTemplateInfo } from './NvVideoOperator';
import { NvVideoConfig } from './VideoConfig/Config/NvVideoConfig';
import { NvWatermarkConfig } from './VideoConfig/Config/NvCompileWatermarkConfig';

import {
    NativeModules,
    NativeEventEmitter,
} from 'react-native';

interface VideoEditPlugin {
    sendMessageToNative(msg: Map<string, any>): Promise<Map<string, any>>;
}

const { VideoEditPlugin } = NativeModules;
const VideoEditPluginEmitter = new NativeEventEmitter(VideoEditPlugin);


export class NvShortVideoOperator implements NvVideoOperator {

    editEventHandler?: (event: NvVideoEditEvent, info: Map<string, string>) => void
    draftEventHandler?: () => void
    videoCompiletEventHandler?: (event: NvVideoCompileEvent, info: Map<string, string>) => void

    exportProgressCallback?: (info: Map<string, string>) => void
    exportCompleteCallback?: (info: Map<string, string>) => void

    constructor() {
    }


    /*! \if ENGLISH
    *  \brief Set the material server information
    *  \else
    *  \brief 设置素材服务器信息
    *  \endif
    */
    configServerInfo(info: Map<string, any>) {
        VideoEditPlugin.sendMessageToNative({
            'method': 'ConfigServerInfo',
            'arguments': info
        }).then((response: Map<string, any>) => {
            console.log('Received VideoEditPlugin response from native:', response);
        }).catch((error: Error) => {
            console.error('VideoEditPlugin Error sending message to native:', error);
        });
    }

    /*! \if ENGLISH
     *  \brief capture
     *  \else
     *  \brief 视频拍摄
     *  \endif
    */
    startVideoCaptrue(config?: NvVideoConfig, musicInfo?: NvMusicInfo): Promise<Boolean> {
        var params: { [key: string]: any } = {};
        params['method'] = 'CaptureMethod';
        params['arguments'] = {};
        if (musicInfo) {
            params['arguments']['musicInfo'] = musicInfo;
        }
        if (config) {
            params['arguments']['config'] = config;
        }
        return VideoEditPlugin.sendMessageToNative(params).then((response: Boolean) => {
            console.log('Received VideoEditPlugin response from native:', response);
            return response;
        }).catch((error: Error) => {
            console.error('VideoEditPlugin Error sending message to native:', error);
            return false;
        });
    }

    /*! \if ENGLISH
     *  \brief dual capture
     *  \else
     *  \brief 合拍
     *  \endif
    */
    startVideoDualCaptrue(config?: NvVideoConfig): Promise<Boolean> {
        var params: { [key: string]: any } = {};
        params['method'] = 'DualCaptureMethod';
        if (config) {
            params['arguments'] = { "config": config };
        }
        return VideoEditPlugin.sendMessageToNative(params).then((response: Boolean) => {
            console.log('Received VideoEditPlugin response from native:', response);
            return response;
        }).catch((error: Error) => {
            console.error('VideoEditPlugin Error sending message to native:', error);
            return false;
        });
    }
    /*! \if ENGLISH
     *  \brief dual capture
     *  \else
     *  \brief 合拍
     *  \endif
    */
    startVideoDualCaptrueWithVideo(videoPath: string, config?: NvVideoConfig): Promise<Boolean> {
        if (!videoPath) {
            new Promise((resolve, reject) => {
                reject(new Error('videoPath is required'));
            });
        }
        const params: {
            method: string;
            arguments: {
                videoPath: string;
                config?: NvVideoConfig;
            };
        } = {
            method: 'DualCaptureMethod',
            arguments: {
                videoPath: videoPath
            }
        };
    
        if (config) {
            params.arguments.config = config;
        }
        return VideoEditPlugin.sendMessageToNative(params).then((response: Boolean) => {
            console.log('Received VideoEditPlugin response from native:', response);
            return response;
        }).catch((error: Error) => {
            console.error('VideoEditPlugin Error sending message to native:', error);
            return false;
        });
    }

    /*! \if ENGLISH
     *  \brief Select material from album, edit
     *  \else
     *  \brief 从相册选择素材，编辑
     *  \endif
    */
    startSeleteFilesForEdit(config?: NvVideoConfig): Promise<Boolean> {
        var params: { [key: string]: any } = {};
        params['method'] = 'EditMethod';
        if (config) {
            params['arguments'] = { "config": config };
        }
        return VideoEditPlugin.sendMessageToNative(params).then((response: Boolean) => {
            console.log('Received VideoEditPlugin response from native:', response);
            return response;
        }).catch((error: Error) => {
            console.error('VideoEditPlugin Error sending message to native:', error);
            return false;
        });
    }


    /*! \if ENGLISH
     *  \brief get draft list
     *  \else
     *  \brief 获取草稿列表
     *  \endif
    */
    getDraftList(): Promise<Map<string, any>> {
        return VideoEditPlugin.sendMessageToNative({
            'method': 'DraftListMethod'
        });
    }

    /*! \if ENGLISH
     *  \brief reedit draft project
     *  \else
     *  \brief 打开草稿
     *  \endif
    */
    reeditDraft(projectId: string, config?: NvVideoConfig): Promise<Map<string, any>> {
        const params: {
            method: string;
            arguments: {
                projectId: string;
                config?: NvVideoConfig;
            };
        } = {
            method: 'ReeditMethod',
            arguments: {
                projectId: projectId
            }
        };
    
        if (config) {
            params.arguments.config = config;
        }
        return VideoEditPlugin.sendMessageToNative(params);
    }

    /*! \if ENGLISH
     *  \brief delete draft
     *  \else
     *  \brief 删除草稿
     *  \endif
    */
    deleteDraft(projectId: string): Promise<Map<string, any>> {
        return VideoEditPlugin.sendMessageToNative({
            'method': 'DeleteDraftMethod',
            'arguments': { "projectId": projectId }
        });
    }

    /*! \if ENGLISH
     *  \brief save draft
     *  \else
     *  \brief 保存草稿
     *  \endif
    */
    saveDraft(info: string): Promise<Map<string, any>> {
        return VideoEditPlugin.sendMessageToNative({
            'method': 'SaveDraftMethod',
            'arguments': { "draftInfo": info }
        });
    }

    /*! \if ENGLISH
   *  \brief selete cover image
   *  \else
   *  \brief 选择封面图片
   *  \endif
  */
    selectCoverImage(): Promise<Map<string, any>> {
        return VideoEditPlugin.sendMessageToNative({
            'method': 'SelectCoverImageMethod'
        });
    }
    /*! \if ENGLISH
      *  \brief save image
      *  \else
      *  \brief 保存图片
      *  \endif
      */
    saveImage(coverImagePath: string): Promise<Map<string, any>> {
        return VideoEditPlugin.sendMessageToNative({
            'method': 'SaveImageMethod',
            'arguments': { "coverImagePath": coverImagePath }
        });
    }

    saveImageToAlbum(): Promise<string> {
        return VideoEditPlugin.sendMessageToNative({
            'method': 'SaveImageToAlbumMethod'
        }).then((response: string) => {
            console.log('Received VideoEditPlugin response from native:', response) ;
            return response;
        }).catch((error: Error) => {
            console.error('VideoEditPlugin Error sending message to native:', error);
            return ''; // 返回一个默认值，表示操作失败
        });
    }

    /*! \if ENGLISH
    *  \brief Whether there is only one picture when editing
    *  \else
    *  \brief 剪辑时是否只有一张图片
    *  \endif
    */
    isOnlyHaveImage(): Promise<boolean> {
        return VideoEditPlugin.sendMessageToNative({
            'method': 'IsOnlyHaveImageMethod'
        }).then((response: boolean) => {
            console.log('Received VideoEditPlugin response from native:', response);
            return response;
        }).catch((error: Error) => {
            console.error('VideoEditPlugin Error sending message to native:', error);
            return false;
        });
    }

    isOnlyHaveMultiImage(): Promise<boolean> {
        return VideoEditPlugin.sendMessageToNative({
            'method': 'IsOnlyHaveMultiImageMethod'
        }).then((response: boolean) => {
            console.log('Received VideoEditPlugin response from native:', response);
            return response;
        }).catch((error: Error) => {
            console.error('VideoEditPlugin Error sending message to native:', error);
            return false;
        });
    }

    /*! \if ENGLISH
    *  \brief Save save options panel
    *  \else
    *  \brief 展示保存选项面板
    *  \endif
    */
    showSaveOptionsPanel():Promise<number> {
        return VideoEditPlugin.sendMessageToNative({
            'method': 'ShowSaveOptionsPanelMethod'
        }).then((response: number) => {
            console.log('Received VideoEditPlugin response from native:', response);
            return response;
        }).catch((error: Error) => {
            console.error('VideoEditPlugin Error sending message to native:', error);
            return -1; // 返回一个默认值，表示操作失败
        });
    }

    /*! \if ENGLISH
     *  \brief Composite video
     *  \else
     *  \brief 合成视频
     *  \endif
    */
    compileCurrentTimeline(configure: Map<string, string>): Promise<Map<string, any>> {
        return VideoEditPlugin.sendMessageToNative({
            'method': 'CompileVideoMethod',
            'arguments': { "configure": configure }
        });
    }
    
    /*! \if ENGLISH
    *
    *  \brief Get a list of all currently selected materials
    *  \else
    *
    *  \brief 获取当前所选所有素材列表
    *  \endif
    */
   getAVFileInfoArray(): Promise<Map<string, any>> {
    return VideoEditPlugin.sendMessageToNative({
        'method': 'GetAVFileInfoArrayMethod'
    });
   }

    /*! \if ENGLISH
     *
     *  \brief Get material information
     *  \param path material path
     *  \else
     *
     *  \brief 获取素材信息
     *  \param path 素材路径
     *  \endif
     */
    getAVFileInfo(path: String): Promise<Map<string, any>> {
        return VideoEditPlugin.sendMessageToNative({
            'method': 'GetAVFileInfoMethod',
            'arguments': { "path": path }
        });
    }

    /*! \if ENGLISH
     *  \brief Exit editing module
     *  \else
     *  \brief 退出编辑模块
     *  \endif
    */
    exitEdit(projectId: String) {
        VideoEditPlugin.sendMessageToNative({
            'method': 'ExitVideoEditMethod',
            'arguments': { "projectId": projectId }
        });
    }

    /*! \if ENGLISH
     *  \brief Edit module event callback
     *  \else
     *  \brief 编辑模块事件回调
     *  \endif
    */
    setVideoEditEventHandler(handler?: (event: NvVideoEditEvent, info: Map<string, string>) => void) {
        this.editEventHandler = handler;
        if (handler) {
            VideoEditPluginEmitter.addListener('VideoEditMethodChannel', (body: any) => this._getNotice(body));
        } else {
            VideoEditPluginEmitter.removeAllListeners('VideoEditMethodChannel');
        }
    }

    /*! \if ENGLISH
     *  \brief Draft update event callback
     *  \else
     *  \brief 草稿更新事件回调
     *  \endif
    */
    setDraftUpdateHandler(handler?: () => void) {
        this.draftEventHandler = handler;
        if (handler) {
            VideoEditPluginEmitter.addListener('VideoEditDraftChangeMethodChannel', (body: any) => this._getNotice(body));
        } else {
            VideoEditPluginEmitter.removeAllListeners('VideoEditDraftChangeMethodChannel');
        }
    }

    /*! \if ENGLISH
     *  \brief Composite video event callback
     *  \else
     *  \brief 视频合成事件回调
     *  \endif
    */
    setVideoCompileEventHandler(handler?: (event: NvVideoCompileEvent, compileInfo: Map<string, string>) => void) {
        this.videoCompiletEventHandler = handler;
        if (handler) {
            VideoEditPluginEmitter.addListener('VideoEditCallbackMethodChannel', (body: any) => this._getNotice(body));
        } else {
            VideoEditPluginEmitter.removeAllListeners('VideoEditCallbackMethodChannel');
        }
    }

    /*! \if ENGLISH
     *  \brief Download prefabricated material
     *  \else
     *  \brief 下载预置素材
     *  \endif
    */
    downloadPrefabricatedMaterial(): Promise<boolean> {
        return VideoEditPlugin.sendMessageToNative({
            'method': 'DownloadPrefabricatedMaterialCompletionMethod'
        }).then((response: boolean) => {
            console.log('Received VideoEditPlugin response from native:', response);
            return response;
        }).catch((error: Error) => {
            console.error('VideoEditPlugin Error sending message to native:', error);
            return false;
        });
    }

    exportVideos(filePaths: string[], outputFilePath?: string, config?: NvWatermarkConfig, progress?: (info: Map<string, string>) => void, complate?: (info: Map<string, string>) => void): Promise<Boolean> {
        this.exportProgressCallback = progress;
        this.exportCompleteCallback = complate;
        if (progress) {
            VideoEditPluginEmitter.addListener('VideoExportProgressCallbackMethodChannel', (body: any) => this._getNotice(body));
        } else {
            VideoEditPluginEmitter.removeAllListeners('VideoExportProgressCallbackMethodChannel');
        }
        if (complate) {
            VideoEditPluginEmitter.addListener('VideoExportResultCallbackMethodChannel', (body: any) => this._getNotice(body));
        } else {
            VideoEditPluginEmitter.removeAllListeners('VideoExportResultCallbackMethodChannel');
        }
        var params: { [key: string]: any } = {};
        params['method'] = 'ExportVideosMethod';
        params['arguments'] = { "filePaths": filePaths };
        if (outputFilePath) {
            params['arguments']['outputFilePath'] = outputFilePath;
        }
        if (config) {
            params['arguments']['config'] = config;
        }
        return VideoEditPlugin.sendMessageToNative(params).then((response: Boolean) => {
            console.log('Received VideoEditPlugin response from native:', response);
            return response;
        }).catch((error: Error) => {
            console.error('VideoEditPlugin Error sending message to native:', error);
            return false;
        });
    }

    openAlbum(): Promise<string[]> {
        var params:{ [key: string]: any } = {};
        params['method'] = 'OpenAlbumMethod';
        return VideoEditPlugin.sendMessageToNative(params).then((response: string[]) => {
            console.log('Received VideoEditPlugin response from native:', response);
            return response;
        }).catch((error: Error) => {
            console.error('VideoEditPlugin Error sending message to native:', error);
            return [];
        });
    }

    getPublishInfo(): Promise<NvPublishInfo> {
        return VideoEditPlugin.sendMessageToNative({
            'method': 'PublishInfoMethod'
        }).then((response: NvPublishInfo) => {
            console.log('Received VideoEditPlugin response from native:', response);
            let publishInfo = NvPublishInfo.fromJson(response as any)
            return publishInfo;
        }).catch((error: Error) => {
            console.error('VideoEditPlugin Error sending message to native:', error);
            return null;
        });
    }

    _getNotice(body: any) {
        let nMethod = body.method;
        let nArguments = body.arguments;
        // console.log('nMethod:', nMethod);
        // console.log('nArguments:', nArguments);
        this.handleEvent(nMethod, nArguments);
    }

    handleEvent(nMethod: string, nArguments: Map<string, any>) {
        if (nMethod == 'DraftListUpdate') {
            if (this.draftEventHandler) {
                this.draftEventHandler();
            }
        } else if (nMethod == 'VideoEditResultEvent') {
            if (this.editEventHandler) {
                this.editEventHandler(NvVideoEditEvent.publish, nArguments);
            }
        } else if (nMethod == 'DidCompileProgressMethod') {
            if (this.videoCompiletEventHandler) {
                this.videoCompiletEventHandler(NvVideoCompileEvent.progress, nArguments);
            }
        } else if (nMethod == 'DidCompileCompletedMethod') {
            if (this.videoCompiletEventHandler) {
                this.videoCompiletEventHandler(NvVideoCompileEvent.complete, nArguments);
            }
        } else if (nMethod == 'DidCoverImageChangedMethod') {
            if (this.videoCompiletEventHandler) {
                this.videoCompiletEventHandler(NvVideoCompileEvent.coverImageSelected, nArguments);
            }
        } else if (nMethod == 'DidExportProgressMethod') {
            if (this.exportProgressCallback) {
                this.exportProgressCallback(nArguments);
            }
        } else if (nMethod == 'DidExportResultMethod') {
            if (this.exportCompleteCallback) {
                this.exportCompleteCallback(nArguments);
            }
        } else {
            //
        }
    }

    /**
     * 获取测试配置JSON文件
     *
     * @returns 返回一个Promise，解析为包含测试配置信息的Map对象
     */
    // fetchTestConfigJsonFile(): Promise<Map<string, any>> {
    //     return VideoEditPlugin.sendMessageToNative({
    //         'method': 'TestJsonPathMethod'
    //     });
    // }

}