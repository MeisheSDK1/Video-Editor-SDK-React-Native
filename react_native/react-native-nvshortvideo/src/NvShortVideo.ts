import { NvVideoEditEvent, NvVideoCompileEvent } from './NvVideoOperator';
import type { NvVideoOperator } from './NvVideoOperator';
import { NvShortVideoOperator } from './NvShortVideoOperator';


export class NvShortVideo {
  private static instance: NvVideoOperator;

  // 私有化构造函数，防止外部直接实例化
  private constructor() { }

  // 获取单例实例的方法
  public static shareInstance(): NvVideoOperator {
    if (!NvShortVideo.instance) {
      NvShortVideo.instance = new NvShortVideoOperator();
    }
    return NvShortVideo.instance;
  }
}