#!/bin/bash

rm *.apk

ionic cordova build android --release

APK_NAME=release-unsigned.apk
FINAL_APK=final-signed.apk

mv ./platforms/android/build/outputs/apk/android-release-unsigned.apk ./$APK_NAME
jarsigner -verbose \
	 -sigalg SHA1withRSA \
	 -digestalg SHA1 \
	 -storepass warrior11 \
	 -keypass warrior11 \
	 -keystore release.keystore \
	 $APK_NAME \
	 myreleasekey
zipalign -v 4 $APK_NAME $FINAL_APK
rm $APK_NAME
apksigner verify $FINAL_APK