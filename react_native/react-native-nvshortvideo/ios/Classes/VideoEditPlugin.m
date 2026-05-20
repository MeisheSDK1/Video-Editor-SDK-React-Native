//
//  VideoEditPlugin.m
//  Runner
//
//  Created by 美摄 on 2021/10/15.
//

#import "VideoEditPlugin.h"
#import <NvShortVideoCore/NvShortVideoCore.h>
#import "NvHttpRequestDelegate.h"
#import <Network/Network.h>
#import <NvStreamingSdkCore/NvstreamingSdkCore.h>

@interface VideoEditPlugin() <NvModuleManagerDelegate, NvModuleManagerCompileStateDelegate>

@property (nonatomic, strong) NvModuleManager* moduleManager;

@property (nonatomic, assign) bool hasListeners;

@property (nonatomic, strong) UINavigationController* videoEditNavigationController;
//@property (nonatomic, strong)MBProgressHUD *hud;
@property (nonatomic, strong) NvHttpRequestDelegate *requestDelegate;
@end

@implementation VideoEditPlugin

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
  return true;
}

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

- (instancetype)init {
    self = [super init];
    if(self){
        NSString* licPath = [[NSBundle mainBundle] pathForResource:@"meishesdk.lic" ofType:nil];
        if (![NvsStreamingContext verifySdkLicenseFile:licPath]) {
            NSLog(@"[Error] ❤️: NvsStreamingContext verifySdkLicenseFile error");
        }
        self.moduleManager = NvModuleManager.sharedInstance;
        self.moduleManager.delegate = self;
        self.moduleManager.compileDelegate = self;
        [self.moduleManager prepareDownloadFolders];
        self.requestDelegate = [[NvHttpRequestDelegate alloc] init];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleDraftListNotification:) name:@"NvDraftManager_Draft_Save_Notification" object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleDraftListNotification:) name:@"NvDraftManager_Draft_Delete_Notification" object:nil];
    }
    return self;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[VideoEditDraftChangeMethodChannel, VideoEditCallbackMethodChannel, VideoEditMethodChannel,VideoExportProgressCallbackMethodChannel,VideoExportResultCallbackMethodChannel]; //这里返回的将是你要发送的消息名的数组。
}

-(void)handleDraftListNotification:(NSNotification*)notification{
  [self sendEventWithName:VideoEditDraftChangeMethodChannel body:@{@"method": DraftListUpdate}];
}

- (void)networkState{
    // 联网后，请求、下载模型文件
    // After networking, request and download the model file
    nw_path_monitor_t monitor = nw_path_monitor_create();
    nw_path_monitor_set_queue(monitor, dispatch_get_main_queue());
    nw_path_monitor_set_update_handler(monitor, ^(nw_path_t path) {
        if (nw_path_get_status(path) == nw_path_status_satisfied) {
            NvModuleManager* moduleManager = [NvModuleManager sharedInstance];
            [moduleManager preloadedResource];
            nw_path_monitor_cancel(monitor);
        } else {
//            NSLog(@"Network not reachable");
        }
    });
    nw_path_monitor_start(monitor);
}

RCT_EXPORT_METHOD(sendMessageToNative:(NSDictionary *)dic resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSString* method = dic[@"method"];
  NSDictionary* arguments = dic[@"arguments"];
  [self handleMethod:method arguments:arguments completion:^(NSObject * _Nullable response, NSError * _Nonnull error) {
        if (error) {
            reject([NSString stringWithFormat:@"%ld", error.code], error.localizedDescription, error);
        } else {
            if (response) {
                resolve(response);
            } else {
                resolve(@"suc");
            }
        }
    }];
}

- (void)handleMethod:(NSString*)methodName
           arguments:(NSDictionary*)arguments
          completion:(nullable void (^)(NSObject * _Nullable response, NSError * _Nullable error))completion {
    UIViewController* presentingVc = [NvSPUtils keyWindow].rootViewController;
    NSDictionary *configDic = arguments[@"config"];
    NvVideoConfig *videoConfig;
    if (configDic) {
        videoConfig = [NvVideoConfig fromDic:configDic];
    }
    if ([methodName isEqualToString:CaptureMethod]) {
        NSMutableArray *menuArray = [NSMutableArray array];
        for (NSString *menu in videoConfig.captureConfig.captureBottomMenuItems) {
            if ([menu isEqualToString:NvCaptureBottomMenu.image]) {
                [menuArray addObject:NvCaptureBottomMenu.image];
            } else if ([menu isEqualToString:NvCaptureBottomMenu.video]) {
                [menuArray addObject:NvCaptureBottomMenu.video];
            } else if ([menu isEqualToString:NvCaptureBottomMenu.smart]) {
                [menuArray addObject:NvCaptureBottomMenu.smart];
            } else if ([menu isEqualToString:NvCaptureBottomMenu.template]) {
                [menuArray addObject:NvCaptureBottomMenu.template];
            }
        }

        if (menuArray.count > 0) {
            videoConfig.captureConfig.captureBottomMenuItems = menuArray;
        }

        NvCaptureMusicInfo *musicInfo;
        NSDictionary *musicInfoDic = arguments[@"musicInfo"];
        if (musicInfoDic) {
            NSString *musicName = musicInfoDic[@"musicName"];
            NSString *musicFilePath = musicInfoDic[@"musicFilePath"];
            
            if (musicFilePath && musicFilePath.length > 0) {
                NvCaptureMusicInfo *info = [[NvCaptureMusicInfo alloc] init];
                info.musicName = musicName;
                info.musicFilePath = musicFilePath;
                musicInfo = info;
            }
        }
        [self.moduleManager startCaptureWithPresent:presentingVc config:videoConfig music:musicInfo with:^(BOOL isFinish) {
            completion([NSNumber numberWithBool:isFinish], nil);
        }];
    } else if([methodName isEqualToString:DualCaptureMethod]) {
        [self.moduleManager startDualCaptureWithPresent:presentingVc config:videoConfig with:^(BOOL isFinish) {
            completion([NSNumber numberWithBool:isFinish], nil);
        }];
    } else if([methodName isEqualToString:DualCaptureWithVideoMethod]) {
        NSFileManager* fm = [NSFileManager defaultManager];
        NSString* videoPath = arguments[@"videoPath"];
        if (videoPath && [fm fileExistsAtPath:videoPath]) {
            [self.moduleManager startDualCaptureWithPresent:presentingVc config:videoConfig videoPath:videoPath with:^(BOOL isFinish) {
                completion([NSNumber numberWithBool:isFinish], nil);
            }];
        }else{
            completion(nil, [NSError errorWithDomain:@"" code:-1 userInfo:@{NSLocalizedDescriptionKey:@"video file does not exist"}]);
        }
    } else if([methodName isEqualToString:EditMethod]) {
        [self.moduleManager startEditWithPresent:presentingVc config:videoConfig with:^(BOOL isFinish) {
            completion([NSNumber numberWithBool:isFinish], nil);
        }];
    } else if([methodName isEqualToString:ReeditMethod]) {
        NSString* projectId = arguments[@"projectId"];
        if (projectId && projectId.length > 0) {
            NSArray<NvEditProjectInfo*> * draftList = [NvModuleManager projectList];
            for (NvEditProjectInfo* draftModel in draftList) {
                if ([draftModel.projectId isEqualToString:projectId]) {
                    [self.moduleManager reeditProject:draftModel presentViewController:presentingVc config:videoConfig];
                    completion(nil, nil);
                    return;
                }
            }
        }
        completion(nil, [NSError errorWithDomain:@"" code:-1 userInfo:@{NSLocalizedDescriptionKey:@"projectId error, draft does not exist"}]);
    } else if([methodName isEqualToString:DraftListMethod]) {
        completion([self getProjectList], nil);
    } else if([methodName isEqualToString:DeleteDraftMethod]) {
        NSString* projectId = arguments[@"projectId"];
        if (projectId && projectId.length > 0) {
            if ([NvModuleManager deleteDraft:projectId]) {
                completion(nil, nil);
                return;
            }
        }
        completion(nil, [NSError errorWithDomain:@"" code:-1 userInfo:@{NSLocalizedDescriptionKey:@"projectId error, draft does not exist"}]);
    } else if([methodName isEqualToString:ExitVideoEditMethod]) {
        NSString* projectId = arguments[@"projectId"];
        if (projectId) {
            [self.moduleManager exitVideoEdit:projectId];
        }
        completion(nil, nil);
    } else if([methodName isEqualToString:ConfigServerInfo]) {
        //设置服务器参数 Setting server parameters
        NSString* host = arguments[@"host"];
        NSString* assetRequestUrl = arguments[@"assetRequestUrl"];
        NSString* assetCategoryUrl = arguments[@"assetCategoryUrl"];
        NSString* assetMusiciansUrl = arguments[@"assetMusiciansUrl"];
        NSString* assetFontUrl = arguments[@"assetFontUrl"];
        NSString* assetDownloadUrl = arguments[@"assetDownloadUrl"];
        NSString* assetPrefabricatedUrl = arguments[@"assetPrefabricatedUrl"];
        NSString* assetAutoCutUrl = arguments[@"assetAutoCutUrl"];
        NSString* assetTagUrl = arguments[@"assetTagUrl"];
        
        NSString* clientId = arguments[@"clientId"];
        NSString* clientSecret = arguments[@"clientSecret"];
        NSString* assemblyId = arguments[@"assemblyId"];
        NSInteger isAbroad = [arguments[@"isAbroad"] integerValue];
        
        if (!host || !assetRequestUrl || !assetCategoryUrl || !assetMusiciansUrl || !assetFontUrl || !assetDownloadUrl || !assetPrefabricatedUrl || !assetAutoCutUrl || !assetTagUrl) {
            completion(nil, [NSError errorWithDomain:@"" code:-1 userInfo:@{NSLocalizedDescriptionKey:@"Server Info error"}]);
            return;
        }

        NvHttpRequest *request = (NvHttpRequest *)self.moduleManager.netDelegate;
        request.dependencyDelegate = self.requestDelegate;
        request.assetRequestUrl = [host stringByAppendingString:assetRequestUrl];
        request.assetCategoryUrl = [host stringByAppendingString:assetCategoryUrl];
        request.assetMusiciansUrl = [host stringByAppendingString:assetMusiciansUrl];
        request.assetFontUrl = [host stringByAppendingString:assetFontUrl];
        request.assetDownloadUrl = [host stringByAppendingString:assetDownloadUrl];
        request.assetPrefabricatedUrl = [host stringByAppendingString:assetPrefabricatedUrl];
        if ([assetAutoCutUrl hasPrefix:@"http://"] || [assetAutoCutUrl hasPrefix:@"https://"]) {
            request.assetAutoCutUrl = assetAutoCutUrl;
        } else {
            request.assetAutoCutUrl = [host stringByAppendingString:assetAutoCutUrl];
        }
        request.assetTagUrl = [host stringByAppendingString:assetTagUrl];
        
        request.clientId = clientId;
        request.clientSecret = clientSecret;
        request.assemblyId = assemblyId;
        request.isAbroad = isAbroad;
        
        [self networkState];
        completion(nil, nil);
    } else if([methodName isEqualToString:SaveDraftMethod]) {
        NSString* infoString = arguments[@"draftInfo"];
        if ([self.moduleManager saveCurrentDraftWithDraftInfo:infoString]) {
            completion(nil, nil);
        } else {
            completion(nil, [NSError errorWithDomain:@"" code:-1 userInfo:@{NSLocalizedDescriptionKey:@"Save draft error"}]);
        }
    } else if([methodName isEqualToString:CompileVideoMethod]) {
        if ([self.moduleManager compileCurrentTimeline]) {
            completion(nil, nil);
        } else {
            completion(nil, [NSError errorWithDomain:@"" code:-1 userInfo:@{NSLocalizedDescriptionKey:@"Save draft error"}]);
        }
    } else if([methodName isEqualToString:SelectCoverImage]) {
        __weak typeof(self) weakSelf = self;
        [self.moduleManager selectCoverWith:nil completionHandler:^(NSString * _Nonnull path) {
            NSFileManager *fm = [NSFileManager defaultManager];
            NSString *nFileName = [NSString stringWithFormat:@"%@.jpeg", [NSUUID UUID].UUIDString];
            NSString *nFilePath = [[path stringByDeletingLastPathComponent] stringByAppendingPathComponent:nFileName];
            if (path != nil && nFilePath != nil) {
                [fm copyItemAtPath:path toPath:nFilePath error:nil];
                [weakSelf sendEventWithName:VideoEditCallbackMethodChannel body:@{
                  @"method":DidCoverImageChangedMethod,
                  @"arguments":@{@"coverImagePath":nFilePath}
                }];
            }
        }];
        completion(nil, nil);
    } else if([methodName isEqualToString:SaveImageMethod]) {
        NSString* coverImagePath = arguments[@"coverImagePath"];
        NSFileManager* fm = [NSFileManager defaultManager];
        if (coverImagePath && [fm fileExistsAtPath:coverImagePath]) {
            [self.moduleManager saveCover:coverImagePath with:^(BOOL success) {
                if (success) {
                    completion(nil, nil);
                } else {
                    completion(nil, [NSError errorWithDomain:@"" code:-1 userInfo:@{NSLocalizedDescriptionKey:@"save error"}]);
                }
            }];
        } else {
            completion(nil, [NSError errorWithDomain:@"" code:-2 userInfo:@{NSLocalizedDescriptionKey:@"coverPath error"}]);
        }
    } else if([methodName isEqualToString:DualTestVideoPathMethod]) {
        NSString* testFile = [[NSBundle mainBundle] pathForResource:@"IMG_1333.mp4" ofType:nil];
        completion(testFile, nil);
    } else if([methodName isEqualToString:DualTestImagePathMethod]) {
        NSString* testFile = [[NSBundle mainBundle] pathForResource:@"555.PNG" ofType:nil];
        completion(testFile, nil);
    } else if([methodName isEqualToString:GetAVFileInfoArrayMethod]) {
        NSMutableArray *array = [[NvModuleManager sharedInstance] getAVFileInfoArray];
        completion(array, nil);
    } else if([methodName isEqualToString:GetAVFileInfoMethod]) {
        NSString* path = arguments[@"path"];
        NvsAVFileInfo *info = [[NvModuleManager sharedInstance] getAVFileInfo:path];
        
        NSMutableDictionary *dict = [NSMutableDictionary dictionary];
        NvsSize size = [info getVideoStreamDimension:0];
        if (size.width > 0 && size.height > 0) {
            [dict setObject:@(size.width) forKey:@"width"];
            [dict setObject:@(size.height) forKey:@"height"];
        }
        
        NvsRational rational = [info getVideoStreamFrameRate:0];
        if (rational.num > 0 && rational.den > 0) {
            int temp = round((CGFloat)rational.num / rational.den);
            [dict setObject:@(temp) forKey:@"fps"];
        }
        
        NvsVideoCodecType type = [info getVideoStreamCodecType:0];
        if (type == NvsVideoCodecType_H264) {
            [dict setObject:@"H264" forKey:@"codecType"];
        } else if (type == NvsVideoCodecType_H265) {
            [dict setObject:@"H265" forKey:@"codecType"];
        }
        completion(dict, nil);
    } else if([methodName isEqualToString:TestJsonPathMethod]) {
        NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString *documentsDirectory = [paths objectAtIndex:0];
        NSString *docPath = [documentsDirectory stringByAppendingPathComponent:@"Config"];
        NSFileManager *fm = [NSFileManager defaultManager];
        if (![fm fileExistsAtPath:docPath]) {
            [fm createDirectoryAtPath:docPath withIntermediateDirectories:NO attributes:nil error:nil];
        }
        NSString* testFile = [docPath stringByAppendingPathComponent:@"test.json"];
        completion(testFile, nil);
    } else if([methodName isEqualToString:SaveImageToAlbumMethod]) {
        NSString *imagePath = [self.moduleManager saveImage];
        completion(imagePath, nil);
    } else if([methodName isEqualToString:IsOnlyHaveImageMethod]) {
        BOOL isOnlyHaveImage = [self.moduleManager isOnlyHaveImage];
        completion(isOnlyHaveImage? @(1): @(0), nil);
    } else if([methodName isEqualToString:ShowSaveOptionsPanelMethod]) {
        [self.moduleManager showSelectDownloadPanel:presentingVc completion:^(NSInteger index) {
            completion(@(index), nil);
        }];
    } else if([methodName isEqualToString:DownloadPrefabricatedMaterialCompletionMethod]) {
        [self.moduleManager downloadPrefabricatedMaterialCompletion:^(BOOL isFinish) {
            completion([NSNumber numberWithBool:isFinish], nil);
        }];
    } else if ([methodName isEqualToString:IsOnlyHaveMultiImageMethod]) {
        BOOL isOnlyHaveMultiImage = [self.moduleManager isOnlyHaveMultiImage];
        completion([NSNumber numberWithBool:isOnlyHaveMultiImage], nil);
    } else if([methodName isEqualToString:ExportVideosMethod]) {
        NSArray *filePaths = arguments[@"filePaths"];
        NSString *outputFilePath = arguments[@"outputFilePath"];
        NvWatermarkConfig *waterMarkConfig = [NvWatermarkConfig fromDic:arguments[@"config"]];
        BOOL suc = [self.moduleManager exportVideos:filePaths outputFilePath:outputFilePath config:waterMarkConfig progress:^(CGFloat progress) {
            [self sendEventWithName:VideoExportProgressCallbackMethodChannel body:@{
                    @"method":DidExportProgressMethod,
                    @"arguments":@{@"progress":@(progress)}
            }];
        } completed:^(unsigned int result, NSString * _Nonnull errorString, NSString * _Nonnull outputFilePath) {
            NSLog(@"%d",result);
            NSMutableDictionary* mutDic = [NSMutableDictionary dictionary];
            mutDic[@"result"] = @(result);
            if (outputFilePath) {
                mutDic[@"outputFilePath"] = outputFilePath;
            }
            if (errorString) {
                mutDic[@"errorString"] = errorString;
            }
            [self sendEventWithName:VideoExportResultCallbackMethodChannel body:@{
                    @"method":DidExportResultMethod,
                    @"arguments":mutDic
            }];
        }];
        completion(@(suc), nil);
    } else if([methodName isEqualToString:OpenAlbumMethod]) {
        [self.moduleManager openAlbumWithPresentViewController:presentingVc config:videoConfig complateHandler:^(NSArray *paths) {
            completion(paths, nil);
        }];
    } else if([methodName isEqualToString:PublishInfoMethod]) {
        NvPublishInfo *info = [self.moduleManager publishInfo];
        completion([info toDictionary], nil);
    }
    else {
        completion(nil, [NSError errorWithDomain:@"" code:-2 userInfo:@{NSLocalizedDescriptionKey:@"Method not implemented"}]);
    }
}

- (void)publishWithProjectId:(NSString *)projectId coverImagePath:(NSString *)coverImagePath hasDraft:(BOOL)hasDraft videoPath:(NSString *)videoPath description:(NSString *)description videoEdit:(UINavigationController *)videoEditNavigationController {
    if (videoEditNavigationController.presentingViewController.presentingViewController) {
        UIViewController* presentingVc = [NvSPUtils keyWindow].rootViewController;
        [presentingVc dismissViewControllerAnimated:YES completion:^{
            [self sendEventWithName:VideoEditMethodChannel body:@{
                @"method":VideoEditResultEvent,
                @"arguments":@{@"coverImagePath":coverImagePath,
                               @"hasDraft":@(hasDraft),
                               @"draftInfo":description!=nil?description:@"",
                               @"projectId":projectId,
                               @"videoPath":videoPath!=nil?videoPath:@""}
            }];
        }];
    }else{
        [videoEditNavigationController dismissViewControllerAnimated:YES completion:^{
            [self sendEventWithName:VideoEditMethodChannel body:@{
                @"method":VideoEditResultEvent,
                @"arguments":@{@"coverImagePath":coverImagePath,
                               @"hasDraft":@(hasDraft),
                               @"draftInfo":description!=nil?description:@"",
                               @"projectId":projectId,
                               @"videoPath":videoPath!=nil?videoPath:@""}
            }];
        }];
    }
}

- (void)didCompileFloatProgress:(float)progress {
//  self.hud.progress = progress;
  
  [self sendEventWithName:VideoEditCallbackMethodChannel body:@{
    @"method":DidCompileProgressMethod,
    @"arguments":@{@"progress":@(progress)}
  }];
}

- (void)didCompileCompleted:(NSString*)outputPath error:(NSError*)error {
    NSMutableDictionary* mutDic = [NSMutableDictionary dictionary];
    if (outputPath) {
      mutDic[@"errorCode"] = @(0);
        mutDic[@"outputPath"] = outputPath;
    }
    if (error) {
        mutDic[@"errorCode"] = @(error.code);
        mutDic[@"errorString"] = error.localizedDescription;
    }
//  [MBProgressHUD hideHUDForView:self.videoEditNavigationController.view animated:YES];
//  [self.videoEditNavigationController dismissViewControllerAnimated:YES completion:^{
//    self.videoEditNavigationController = nil;
//    self.hud = nil;
//  }];
    NSLog(@"---> 🌹");
  [self sendEventWithName:VideoEditCallbackMethodChannel body:@{
    @"method":DidCompileCompletedMethod,
    @"arguments":mutDic
  }];
}

- (void)didGenerateImagesType:(int)type results:(NSArray <NSString *> *_Nullable)result error:(NSError *_Nullable)error {
    NSMutableDictionary* mutDic = [NSMutableDictionary dictionary];
    if (error) {
        mutDic[@"errorCode"] = @(error.code);
        mutDic[@"errorString"] = error.localizedDescription;
    }
    mutDic[@"type"] = @(type);
    if (result) {
        mutDic[@"results"] = result;
    }
    [self sendEventWithName:VideoEditCallbackMethodChannel body:@{
        @"method":DidGenerateImagesResultMethod,
        @"arguments":mutDic
    }];
    NSLog(@"didGenerateImagesType:%d results:%@ error:%@",type, result, error.localizedFailureReason);
}

- (NSMutableArray<NSDictionary*>*)getProjectList {
    NSArray<NvEditProjectInfo*> * draftList = [NvModuleManager projectList];
    NSMutableArray* mutArray = [NSMutableArray array];
    for (NvEditProjectInfo* draftModel in draftList) {
        NSString* imagePath = draftModel.coverImagePath?:@"";
        [mutArray addObject:@{@"projectId": draftModel.projectId,
                              @"coverImagePath": imagePath,
                              @"draftInfo": draftModel.projectDescription ? draftModel.projectDescription:@"",
                              @"defaultProjectDescription": draftModel.defaultProjectDescription ? draftModel.defaultProjectDescription:@""}];
    }
    return mutArray;
}

@end


