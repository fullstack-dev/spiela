import {Component} from '@angular/core';
import {StartCollaborationPage} from "../start-collaboration/start-collaboration";
import {BulletinBoardPage} from "../bulletin-board/bulletin-board";
import { NavController } from 'ionic-angular'

/*
 Generated class for the User page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-feedback',
    templateUrl: 'feedback.html'
})
export class FeedbackPage {

    constructor(public navCtrl: NavController) {
    }

    bulletinboard() {
        this.navCtrl.setRoot(BulletinBoardPage, {});
    }

    startacollab() {
        this.navCtrl.setRoot(StartCollaborationPage, {});
    }

}
