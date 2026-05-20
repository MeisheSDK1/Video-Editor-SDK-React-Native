import { NvVideoOperator, NvVideoEditEvent, NvVideoCompileEvent, NvMusicInfo, NvPublishInfo } from './NvVideoOperator';
import { NvVideoConfig } from './VideoConfig/Config/NvVideoConfig';
import { NvWatermarkConfig } from './VideoConfig/Config/NvCompileWatermarkConfig';
export declare class NvShortVideoOperator implements NvVideoOperator {
    editEventHandler?: (event: NvVideoEditEvent, info: Map<string, string>) => void;
    draftEventHandler?: () => void;
    videoCompiletEventHandler?: (event: NvVideoCompileEvent, info: Map<string, string>) => void;
    exportProgressCallback?: (info: Map<string, string>) => void;
    exportCompleteCallback?: (info: Map<string, string>) => void;
    constructor();
    /*! \if ENGLISH
    *  \brief Set the material server information
    *  \else
    *  \brief 设置素材服务器信息
    *  \endif
    */
    configServerInfo(info: Map<string, any>): void;
    /*! \if ENGLISH
     *  \brief capture
     *  \else
     *  \brief 视频拍摄
     *  \endif
    */
    startVideoCaptrue(config?: NvVideoConfig, musicInfo?: NvMusicInfo): Promise<Boolean>;
    /*! \if ENGLISH
     *  \brief dual capture
     *  \else
     *  \brief 合拍
     *  \endif
    */
    startVideoDualCaptrue(config?: NvVideoConfig): Promise<Boolean>;
    /*! \if ENGLISH
     *  \brief dual capture
     *  \else
     *  \brief 合拍
     *  \endif
    */
    startVideoDualCaptrueWithVideo(videoPath: string, config?: NvVideoConfig): Promise<Boolean>;
    /*! \if ENGLISH
     *  \brief Select material from album, edit
     *  \else
     *  \brief 从相册选择素材，编辑
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
     *  \brief Exit editing module
     *  \else
     *  \brief 退出编辑模块
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
    getPublishInfo(): Promise<NvPublishInfo>;
    _getNotice(body: any): void;
    handleEvent(nMethod: string, nArguments: Map<string, any>): void;
}
