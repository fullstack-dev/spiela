import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/*
  Generated class for the terms page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-terms',
    templateUrl: 'terms.html'
})
export class TermsPage {
    constructor(public viewCtrl: ViewController = null) {

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
