import { Injectable } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { ActionSheetController } from "ionic-angular";

@Injectable()
export class CameraService {
    constructor(
        private sheetCtrl: ActionSheetController,
        private camera: Camera
    ) { }

    showSheet(callback) {
        this.sheetCtrl.create({
            title: 'Select Image Source',
            buttons: [
                {
                    text: 'Load from Library',
                    handler: () => {
                        this.pickPhoto(false)
                            .then(data => callback(null, data))
                            .catch(err => callback(err, null));
                    }
                },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.pickPhoto(true)
                            .then(data => callback(null, data))
                            .catch(err => callback(err, null));
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        }).present();
    }

    pickPhoto(isCamera: boolean = false) {
        return this.camera.getPicture(this.makeOption(isCamera));
    }

    private makeOption(fromCamera) {
        return {
            quality: 100,
            sourceType: fromCamera ?
                this.camera.PictureSourceType.CAMERA :
                this.camera.PictureSourceType.PHOTOLIBRARY,
            saveToPhotoAlbum: false,
            correctOrientation: true,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };
    }
}
