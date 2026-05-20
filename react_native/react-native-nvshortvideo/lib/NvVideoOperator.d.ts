import { NvWatermarkConfig } from 'react-native-nvshortvideo/src/VideoConfig/Config/NvCompileWatermarkConfig';
import { NvVideoConfig } from './VideoConfig/Config/NvVideoConfig';
/*! \if ENGLISH
 *
 *  \brief Video editing module event
 *  \else
 *  \brief 视频编辑模块事件
 *  \endif
*/
export declare enum NvVideoEditEvent {
    publish = 0
}
/*! \if ENGLISH
 *
 *  \brief Video compile event
 *  \else
 *  \brief 视频合成事件
 *  \endif
*/
export declare enum NvVideoCompileEvent {
    progress = 0,//!< \if ENGLISH compile progress \else 合成进度 \endif
    complete = 1,//!< \if ENGLISH compile state \else 合成完成状态 \endif
    coverImageSelected = 2
}
/*! \if ENGLISH
 *
 *  \brief music information
 *  \else
 *  \brief 传入拍摄页面音乐信息
 *  \endif
*/
export declare class NvMusicInfo {
    musicName: string;
    musicPath: string;
    constructor(musicName: string, musicPath: string);
}
export declare class NvMusicInfoModel {
    iconUrl?: string;
    duration: number;
    musicName?: string;
    musicSinger?: string;
    musicUrl?: string;
    localFilePath?: string;
    trimIn: number;
    trimOut: number;
    musicId?: string;
    constructor(data: any);
    static fromJson(json: string): NvMusicInfoModel;
}
export declare class NvTemplateInfo {
    templateId?: string;
    name?: string;
    constructor(data: any);
    static fromJson(json: string): NvTemplateInfo;
}
export declare class NvPublishInfo {
    videoPath?: string;
    coverPath?: string;
    imagesPath?: string[];
    musicInfo?: NvMusicInfoModel;
    templateInfo?: NvTemplateInfo;
    constructor(data: any);
    static fromJson(json: string): NvPublishInfo;
}
/*! \if ENGLISH
 *
 *  \brief Video editing module interface
 *  \else
 *  \brief 视频模块接口
 *  \endif
*/
export interface NvVideoOperator {
    /*! \if ENGLISH
     *
     *  \brief Set the material server information
     *  \else
     *  \brief 设置素材服务器信息
     *  \endif
    */
    configServerInfo(info: Map<string, any>): void;
    /*! \if ENGLISH
     *
     *  \brief Shooting entrance
     *  \param config Configuration item
     *  \param music The default is nil，If you need to shoot with music, you need to pass an audio object, and the path of the audio must be local and has been downloaded
     *  \else
     *
     *  \brief 拍摄入口
     *  \param config 配置项
     *  \param music 默认是nil，如果拍摄时需要带音乐拍摄，需要传递一个音频对象，音频的路径必须是本地的，已经下载的路径
     *  \endif
     */
    startVideoCaptrue(config?: NvVideoConfig, musicInfo?: NvMusicInfo): Promise<Boolean>;
    /*! \if ENGLISH
     *
     *  \brief PIP entrance By default, the album is opened, and a material from the album is taken into the beat
     *  \param config Configuration item
     *  \else
     *
     *  \brief 合拍入口，默认打开相册，从相册取一个素材进入合拍
     *  \param config 配置项
     *  \endif
     */
    startVideoDualCaptrue(config?: NvVideoConfig): Promise<Boolean>;
    /*! \if ENGLISH
     *
     *  \brief PIP entrance
     *  \param config Configuration item
     *  \param videoPath The video path to be filmed must be a local path
     *  \else
     *
     *  \brief 合拍入口
     *  \param config 配置项
     *  \param videoPath 准备合拍的视频路径，必须是本地路径
     *  \endif
     */
    startVideoDualCaptrueWithVideo(videoPath: string, config?: NvVideoConfig): Promise<Boolean>;
    /*! \if ENGLISH
     *
     *  \brief Edit entrance
     *  \param config Configuration item
     *  \else
     *
     *  \brief 编辑入口
     *  \param config 配置项
     *  \endif
     */
    startSeleteFilesForEdit(config?: NvVideoConfig): Promise<Boolean>;
    /*! \if ENGLISH
     *  \brief get draft list
     *  \else
     *  \brief 获取草稿列表
     *  \endif
    */
    getDraftList(): Promise<Map<string, any>>;
    /*! \if ENGLISH
     *  \brief reedit draft project
     *  \else
     *  \brief 打开草稿
     *  \endif
    */
    reeditDraft(projectId: string, config?: NvVideoConfig): Promise<Map<string, any>>;
    /*! \if ENGLISH
     *  \brief delete draft
     *  \else
     *  \brief 删除草稿
     *  \endif
    */
    deleteDraft(projectId: string): Promise<Map<string, any>>;
    /*! \if ENGLISH
     *  \brief save draft
     *  \else
     *  \brief 保存草稿
     *  \endif
    */
    saveDraft(info: string): Promise<Map<string, any>>;
    /*! \if ENGLISH
     *  \brief selete cover image
     *  \else
     *  \brief 选择封面图片
     *  \endif
    */
    selectCoverImage(): Promise<Map<string, any>>;
    /*! \if ENGLISH
    *  \brief save image
    *  \else
    *  \brief 保存图片
    *  \endif
    */
    saveImage(coverImagePath: string): Promise<Map<string, any>>;
    /*! \if ENGLISH
 *  \brief save image to album
 *  \else
 *  \brief 保存图片到相册
 *  \endif
*/
    saveImageToAlbum(): Promise<string>;
    /*! \if ENGLISH
   *  \brief Whether there is only one picture when editing
   *  \else
   *  \brief 剪辑时是否只有一张图片
   *  \endif
  */
    isOnlyHaveImage(): Promise<boolean>;
    isOnlyHaveMultiImage(): Promise<boolean>;
    /*! \if ENGLISH
   *  \brief Save save options panel
   *  \else
   *  \brief 展示保存选项面板
   *  \endif
  */
    showSaveOptionsPanel(): Promise<number>;
    /*! \if ENGLISH
     *  \brief Composite video
     *  \else
     *  \brief 合成视频
     *  \endif
    */
    compileCurrentTimeline(configure: Map<string, string>): Promise<Map<string, any>>;
    /*! \if ENGLISH
    *
    *  \brief Get a list of all currently selected materials
    *  \else
    *
    *  \brief 获取当前所选所有素材列表
    *  \endif
    */
    getAVFileInfoArray(): Promise<Map<string, any>>;
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
    getAVFileInfo(path: String): Promise<Map<string, any>>;
    /*! \if ENGLISH
     *
     *  \brief Exit the entire publisher call
     *  \param projectId Returned by the edit completion callback
     *  \warning This method will clean up the current draft and SDK-held resources, please call after completely exiting the editing and publishing process
     *  \else
     *
     *  \brief 退出整个发布器调用
     *  \param projectId 由编辑完成回调中返回
     *  \warning 该方法会清理当前草稿以及sdk持有资源，请在完全退出编辑发布流程之后，调用
     *  \endif
     */
    exitEdit(projectId: String): void;
    /*! \if ENGLISH
     *  \brief Edit module event callback
     *  \else
     *  \brief 编辑模块事件回调
     *  \endif
    */
    setVideoEditEventHandler(handler?: (event: NvVideoEditEvent, info: Map<string, string>) => void): void;
    /*! \if ENGLISH
     *  \brief Draft update event callback
     *  \else
     *  \brief 草稿更新事件回调
     *  \endif
    */
    setDraftUpdateHandler(handler?: () => void): void;
    /*! \if ENGLISH
     *  \brief Composite video event callback
     *  \else
     *  \brief 视频合成事件回调
     *  \endif
    */
    setVideoCompileEventHandler(handler?: (event: NvVideoCompileEvent, compileInfo: Map<string, string>) => void): void;
    /*! \if ENGLISH
      *  \brief Download prefabricated material
      *  \else
      *  \brief 下载预置素材
      *  \endif
    */
    downloadPrefabricatedMaterial(): Promise<boolean>;
    exportVideos(filePaths: string[], outputFilePath?: string, config?: NvWatermarkConfig, progress?: (info: Map<string, string>) => void, complate?: (info: Map<string, string>) => void): Promise<Boolean>;
    openAlbum(): Promise<string[]>;
    /*! \if ENGLISH
      *  \brief get publish info
      *  \else
      * \brief 获取发布信息
      *  \endif
    */
    getPublishInfo(): Promise<NvPublishInfo>;
}
