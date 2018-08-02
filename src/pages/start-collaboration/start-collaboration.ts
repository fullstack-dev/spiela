import {Component} from '@angular/core';

import {NavController, Events} from 'ionic-angular';

import {AuthService} from "../../providers/auth-service";
import {CanvasPage} from "../canvas/canvas";
import {Collaboration} from "../collaboration";
import {FeedbackPage} from '../feedback/feedback';
import {BulletinBoardPage} from "../bulletin-board/bulletin-board";
import {RestService} from "../../providers/rest-service";
import {NotifyService} from "../../providers/notify-service";


@Component({
    selector: 'page-start-collaboration',
    templateUrl: 'start-collaboration.html'
})
export class StartCollaborationPage {
    public collaboration: Collaboration = new Collaboration("New item");

    constructor(
        public navCtrl: NavController,
        public auth: AuthService,
        private rest: RestService,
        private notify: NotifyService,
        public events: Events
    ) {  }


    publish(f) {
        if (!f.valid) return;
        this.collaboration = f.value;

        let loader = this.notify.showLoader();
        this.rest.addCollaboration(f.value).subscribe(data => {
            loader.dismissAll();

            this.notify.showToast(
                "Collaboration is published",
                2000, "top"
            );
            this.events.publish('publised:reload', true);
            this.navCtrl.push(CanvasPage, {
                collaboration: data.entity
            });
        }, error => {
            loader.dismissAll();
            this.notify.showToast(
                "Collaboration not created",
                2000, "top"
            );
        });
    }

    feedback() {
        this.navCtrl.setRoot(FeedbackPage, {});
    }

    bulletinboard() {
        this.navCtrl.setRoot(BulletinBoardPage, {});
    }
}
