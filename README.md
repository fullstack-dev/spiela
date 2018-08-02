publish to google play

cordova build --release android
cd ..
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore release.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk myreleasekey