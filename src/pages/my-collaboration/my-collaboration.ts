import { ReportPage } from './../shared-report-modal/report-modal';
import { Component } from '@angular/core';

import { NavController, ModalController, AlertController } from 'ionic-angular';
import { AuthHttp } from "angular2-jwt";
import { AuthService } from "../../providers/auth-service";
import { CollaborationPage } from "../collaboration/collaboration";
import { HomePage } from "../home/home";
import { UserPage } from "../user/user";
import { RestService } from '../../providers/rest-service';

@Component({
    selector: 'page-my-collaboration',
    templateUrl: 'my-collaboration.html'
})
export class MyCollaborationPage {
    perPage = 10;
    page = 0;
    search = '';
    error = '';
    collaborations = [];
    private username = '';

    constructor(
        private modalCtrl: ModalController,
        private navCtrl: NavController,
        private alertCtrl: AlertController,
        private http: AuthHttp,
        private auth: AuthService,
        private rest: RestService,

    ) {
        this.loadMore(false, false);
        this.username = auth.user;
    }

    loadMore(infiniteScroll: any, reset: boolean) {
        if (!this.auth.authenticated()) {
            this.navCtrl.setRoot(HomePage, {});
        }
       
        if (reset) this.page = 0;
        var offset = this.page * this.perPage;
        this.http.get(`${this.auth.API_URL}collaborations?offset=${offset}&max=${this.perPage}&q=${this.search}`)
            .subscribe(data => {
                this.page++;
                var newData = data.json();

                if (reset) {
                    this.collaborations = newData;
                } else {
                    Array.prototype.push.apply(this.collaborations, newData);
                }
                if (infiniteScroll) {
                    infiniteScroll.complete();
                }

            }, err => {
                this.error = err;
                this.auth.reauth();
            });
    }

    clickCollVote(value, collId) {
        this.http
            .post(`${this.auth.API_URL}collaboration/${collId}/collaboration/like?value=${value}`, {})
            .subscribe(
                data => this.navigate(collId),
                err => this.error = err
            );
    }

    navigate(collId) {
        this.navCtrl.push(CollaborationPage, {
            collId: collId
        });
    }

    navigateUser(userId) {
        this.rest.loadUser(userId).subscribe(data => {
            var userProfile = data.user;
            // console.log(userProfile);
            this.navCtrl.push(UserPage, { userProfile });
        }, err => {
            this.error = err;
        });
    }

    reportAPost(collaboration_id) {
        let params = { type: 'collaboration', id: collaboration_id };
        // console.log("params isnide the about component",params);
        let reportModal = this.modalCtrl.create(ReportPage, { params });
        reportModal.present();
    }

    showReportIcon(username) {
        if (username == this.username)
            return true;
        else return false;
    }

    showDeleteIcon(username) {
        if (username == this.username)
            return false;
        else return true;
    }

    deletePost(id) {
        let alert = this.alertCtrl.create({
            title: 'Confirm deletion',
            message: 'Are you sure you want to delete this item?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.http.post(this.auth.API_URL + 'deletecol', {
                            id: id
                        }).subscribe(
                            data => {
                                let res = data.json();
                                if (res.success == true) {
                                    let alert = this.alertCtrl.create({
                                        title: 'Success',
                                        subTitle: 'Your request has been submitted successfully',
                                        buttons: ['Dismiss']
                                    });
                                    alert.present();
                                }
                            }, err => {
                                let alert = this.alertCtrl.create({
                                    title: 'Error',
                                    subTitle: 'Something wrong!',
                                    buttons: ['Dismiss']
                                });
                                alert.present();
                            }
                            );
                    }
                }
            ]
        });
        alert.present();
    }

}
