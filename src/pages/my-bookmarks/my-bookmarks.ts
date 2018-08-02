import { ReportPage } from './../shared-report-modal/report-modal';
import { Component } from '@angular/core';

import { NavController, ModalController, AlertController, NavParams } from 'ionic-angular';
import { AuthHttp } from "angular2-jwt";
import { AuthService } from "../../providers/auth-service";
import { CollaborationPage } from "../collaboration/collaboration";
import { HomePage } from "../home/home";
import { UserPage } from "../user/user";
import { RestService } from '../../providers/rest-service';

@Component({
    selector: 'page-my-bookmarks',
    templateUrl: 'my-bookmarks.html'
})
export class MyBookmarksPage {
    perPage = 10;
    page = 0;
    search = '';
    error = '';
    bookmarks = [];
    
    private username = '';

    constructor(
        private modalCtrl: ModalController,
        private navCtrl: NavController,
        private alertCtrl: AlertController,
        private http: AuthHttp,
        private auth: AuthService,
        private rest: RestService,
        private navParams: NavParams,

    ) {
       let passedUser = navParams.data.user;
       //alert (JSON.stringify(passedUser.username))
       this.username = passedUser.username;// auth.user;
       this.loadMore(false, false);
   }

    loadMore(infiniteScroll: any, reset: boolean) {
        
        if (!this.auth.authenticated()) {
            this.navCtrl.setRoot(HomePage, {});
        }
        
        //this.username = this.auth.user;
        if (typeof(this.username) == 'undefined') { return; }
        if (reset) this.page = 0;
        var offset = this.page * this.perPage;
        this.http.get(`${this.auth.API_URL}bookmarks/${this.username}?offset=${offset}&max=${this.perPage}`)
            .subscribe(data => {
                this.page++;
                 
                var newData = data.json();

                if (reset) {
                    this.bookmarks = newData;
                    
                } else {
                    Array.prototype.push.apply(this.bookmarks, newData);
                }
                if (infiniteScroll) {
                    infiniteScroll.complete();
                }

            }, err => {
                this.error = err;
                this.auth.reauth();
            });
    }
 
    choose_image(picFil)
    {
        var picFil2 = '';
        if (typeof(picFil) != 'undefined') { picFil2 = picFil.substr(picFil.lastIndexOf('/') + 1); }
        else picFil2 = '';
        if (picFil2.length != 0) return picFil;
        else return 'assets/img/profile-image.png';
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

    reportAPost(bookmark_id) {
        let params = { type: 'collaboration', id: bookmark_id };
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

    deleteBookmark(id) { 
        let alert = this.alertCtrl.create({
            title: 'Confirm deletion',
            message: 'Are you sure you want to delete this bookmark?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Yes',
                    handler: () => { //${config.API_URL}addbookmark/${username}
                        this.http.post(this.auth.API_URL + 'addbookmark/' + this.username, {
                            id: id
                        }).subscribe(
                            data => {
                                let res = data.json();
                                if (res.success ==2) { 
                                     this.bookmarks = [];
                                    this.loadMore(false,  true);
                                   
    
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
