import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CollaborationPage } from "../collaboration/collaboration";
import { Collaboration } from "../collaboration";
import { RestService } from "../../providers/rest-service";
import { CameraService } from "../../providers/camera-service";
import { NotifyService } from "../../providers/notify-service";

declare var cordova: any;

@Component({
    selector: 'page-canvas',
    templateUrl: 'canvas.html'
})
export class CanvasPage {
    collaboration: Collaboration;
    curImg = null;

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private rest: RestService,
        private camService: CameraService,
        private notify: NotifyService
    ) {
        this.collaboration = navParams.data.collaboration;
    }

    addSpiel(content) {
        let loader = this.notify.showLoader();

        let collId = this.collaboration.id;
        this.rest.addCollaborationImg(collId, content, this.curImg).subscribe(data => {
            loader.dismiss();
            if (!data.success) return;

            this.notify.showToast(
                'Collaboration posted.',
                2000,
                "top"
            );
            this.navCtrl.popToRoot().then(result => {
                this.navCtrl.push(CollaborationPage, { collId });
            });

        }, err => {
            loader.dismiss();
            this.notify.showToast(
                'Collaboration not posted.',
                2000,
                "top"
            );
        });
    }

    public presentActionSheet() {
        this.camService.showSheet((err, data) => {
            if (err) {
                this.curImg = null;
                console.log(err);
                this.notify.showToast(
                    'Error while picking photo.',
                    2000,
                    "top"
                );
                return;
            }

            this.curImg = data;
        });
}}
