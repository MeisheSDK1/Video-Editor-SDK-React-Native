#!/bin/bash

yarn install
cd ios
pod install

open RNShortVideo.xcworkspace
