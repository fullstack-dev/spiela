import {Injectable} from '@angular/core';
import {
    LoadingController,
    ToastController
} from 'ionic-angular';

@Injectable()
export class NotifyService {
    constructor(
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
   ) {  }

    showToast(message, duration = 3000, position = 'top') {
        this.toastCtrl.create({
            message,
            duration,
            position
        }).present();
    }

    showLoader(content = 'Please wait...') {
        let loading = this.loadingCtrl.create({ content });
        loading.present();
        return loading;
    }
   
    
}