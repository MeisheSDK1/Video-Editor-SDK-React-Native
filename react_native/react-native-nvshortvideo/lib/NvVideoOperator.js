"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NvPublishInfo = exports.NvTemplateInfo = exports.NvMusicInfoModel = exports.NvMusicInfo = exports.NvVideoCompileEvent = exports.NvVideoEditEvent = void 0;
/*! \if ENGLISH
 *
 *  \brief Video editing module event
 *  \else
 *  \brief 视频编辑模块事件
 *  \endif
*/
var NvVideoEditEvent;
(function (NvVideoEditEvent) {
    NvVideoEditEvent[NvVideoEditEvent["publish"] = 0] = "publish"; //!< \if ENGLISH Jump to publish \else 跳转到发布 \endif
})(NvVideoEditEvent || (exports.NvVideoEditEvent = NvVideoEditEvent = {}));
/*! \if ENGLISH
 *
 *  \brief Video compile event
 *  \else
 *  \brief 视频合成事件
 *  \endif
*/
var NvVideoCompileEvent;
(function (NvVideoCompileEvent) {
    NvVideoCompileEvent[NvVideoCompileEvent["progress"] = 0] = "progress";
    NvVideoCompileEvent[NvVideoCompileEvent["complete"] = 1] = "complete";
    NvVideoCompileEvent[NvVideoCompileEvent["coverImageSelected"] = 2] = "coverImageSelected"; //!< \if ENGLISH cover image selected \else 选择了新的封面图片 \endif
})(NvVideoCompileEvent || (exports.NvVideoCompileEvent = NvVideoCompileEvent = {}));
/*! \if ENGLISH
 *
 *  \brief music information
 *  \else
 *  \brief 传入拍摄页面音乐信息
 *  \endif
*/
class NvMusicInfo {
    musicName;
    musicPath;
    constructor(musicName, musicPath) {
        this.musicName = musicName;
        this.musicPath = musicPath;
    }
}
exports.NvMusicInfo = NvMusicInfo;
class NvMusicInfoModel {
    iconUrl;
    duration = 0;
    musicName;
    musicSinger;
    musicUrl;
    localFilePath;
    trimIn = 0;
    trimOut = 0;
    musicId;
    constructor(data) {
        this.iconUrl = data.iconUrl;
        this.duration = Number(data.duration);
        this.musicName = data.musicName;
        this.musicSinger = data.musicSinger;
        this.musicUrl = data.musicUrl;
        this.localFilePath = data.localFilePath;
        this.trimIn = Number(data.trimIn);
        this.trimOut = Number(data.trimOut);
        this.musicId = data.musicId;
    }
    static fromJson(json) {
        try {
            if (typeof json === 'object') {
                return new NvMusicInfoModel(json);
            }
            const jsonString = String(json);
            const data = JSON.parse(jsonString);
            return new NvMusicInfoModel(data);
        }
        catch (error) {
            console.error('NvMusicInfoModel.fromJson parse error:', error);
            return new NvMusicInfoModel({});
        }
    }
}
exports.NvMusicInfoModel = NvMusicInfoModel;
class NvTemplateInfo {
    templateId;
    name;
    constructor(data) {
        this.templateId = data.templateId;
        this.name = data.name;
    }
    static fromJson(json) {
        try {
            if (typeof json === 'object') {
                return new NvTemplateInfo(json);
            }
            const jsonString = String(json);
            const data = JSON.parse(jsonString);
            return new NvTemplateInfo(data);
        }
        catch (error) {
            console.error('NvTemplateInfo.fromJson parse error:', error);
            return new NvTemplateInfo({});
        }
    }
}
exports.NvTemplateInfo = NvTemplateInfo;
class NvPublishInfo {
    videoPath;
    coverPath;
    imagesPath;
    musicInfo;
    templateInfo;
    constructor(data) {
        this.videoPath = data.videoPath;
        this.coverPath = data.coverPath;
        this.imagesPath = data.imagesPath;
        if (data.musicInfo) {
            this.musicInfo = new NvMusicInfoModel(data.musicInfo);
        }
        if (data.templateInfo) {
            this.templateInfo = new NvTemplateInfo(data.templateInfo);
        }
    }
    static fromJson(json) {
        try {
            if (typeof json === 'object') {
                return new NvPublishInfo(json);
            }
            const jsonString = String(json);
            const data = JSON.parse(jsonString);
            return new NvPublishInfo(data);
        }
        catch (error) {
            console.error('NvPublishInfo.fromJson parse error:', error);
            return new NvPublishInfo({});
        }
    }
}
exports.NvPublishInfo = NvPublishInfo;
