"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NvShortVideo = void 0;
const NvShortVideoOperator_1 = require("./NvShortVideoOperator");
class NvShortVideo {
    static instance;
    // 私有化构造函数，防止外部直接实例化
    constructor() { }
    // 获取单例实例的方法
    static shareInstance() {
        if (!NvShortVideo.instance) {
            NvShortVideo.instance = new NvShortVideoOperator_1.NvShortVideoOperator();
        }
        return NvShortVideo.instance;
    }
}
exports.NvShortVideo = NvShortVideo;
