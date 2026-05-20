#import "NvHttpRequestDelegate.h"
#if __has_include(<SDWebImageWebPCoder/SDWebImageWebPCoder.h>)
#import <SDWebImage/SDWebImage.h>
#import <SDWebImageWebPCoder/SDWebImageWebPCoder.h>
#endif

#if __has_include(<SSZipArchive/SSZipArchive.h>)
#import <SSZipArchive/SSZipArchive.h>
#endif

@implementation NvHttpRequestDelegate

- (void)configWebPInit {
#if __has_include(<SDWebImageWebPCoder/SDWebImageWebPCoder.h>)
    [SDImageCodersManager.sharedManager addCoder:[SDImageWebPCoder sharedCoder]];
    NSLog(@"♥️: WebP coder initialized");
#endif
}

// MARK: -- NvWebImageDelegate
- (void)fetchImageFor:(UIImageView *)imageView url:(NSURL *)url placeholder:(UIImage *)placeholder completion:(void (^)(UIImage * _Nullable))completion{
#if __has_include(<SDWebImageWebPCoder/SDWebImageWebPCoder.h>)
    SDWebImageOptions options = SDWebImageAvoidAutoSetImage; // !!!: -- 非常重要
    [imageView sd_setImageWithURL:url
                 placeholderImage:placeholder
                          options:options
                        completed:^(UIImage * _Nullable image,
                                    NSError * _Nullable error,
                                    SDImageCacheType cacheType,
                                    NSURL * _Nullable imageURL) {

        if (completion) {
            completion(image);
        }
        if (error && error.code != 2002) {
            NSLog(@"❌ Image loading failed: %@", error.localizedDescription);
        }
    }];
#endif
}

- (void)webImageCancel:(UIImageView *)imageView {
#if __has_include(<SDWebImageWebPCoder/SDWebImageWebPCoder.h>)
    [imageView sd_cancelCurrentImageLoad];
#endif
}

// MARK: -- Zip
- (BOOL)unzipWithPath:(NSString *)path destination:(NSString *)destination {
#if __has_include(<SSZipArchive/SSZipArchive.h>)
    NSError* unpackError = nil;
    BOOL ret = [SSZipArchive unzipFileAtPath:path toDestination:destination overwrite:YES password:nil error:&unpackError];
    if (unpackError) {
        NSLog(@"unzip error: %@", unpackError);
    }
    return ret;
#else
    NSLog(@"♥️: zip decompression not implemented");
    return false;
#endif
}

@end

