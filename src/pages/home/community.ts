import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';


/*
  Generated class for the terms page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-community',
    templateUrl: 'community.html'
})
export class CommunityPage {
    constructor(public viewCtrl: ViewController = null) {

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
