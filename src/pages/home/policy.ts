import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/*
  Generated class for the policy page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-policy',
    templateUrl: 'policy.html'
})
export class PolicyPage {
    constructor(public viewCtrl: ViewController = null) {

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
