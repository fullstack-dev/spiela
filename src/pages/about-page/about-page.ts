import {ReportPage} from './../shared-report-modal/report-modal';
import {Component} from '@angular/core';

import {NavController, ModalController, AlertController, PopoverController, NavParams} from 'ionic-angular';
import {AuthHttp} from "angular2-jwt";
import {AuthService} from "../../providers/auth-service";
import {CollaborationPage} from "../collaboration/collaboration";
import {HomePage} from "../home/home";
import {UserPage} from "../user/user";
import {ContextMenuComponent} from "../../components/context-menu/context-menu";

@Component({
    selector: 'page-about',
    templateUrl: 'about-page.html'
})
export class AboutPagePage {
    error = '';
    collaborations = [];
    perPage = 10;
    page = 0;
    search = '';
    private username = '';
    hotpage = false;

    constructor(public modalCtrl: ModalController, public navCtrl: NavController, public http: AuthHttp,
                public auth: AuthService, private alertCtrl: AlertController, public popoverCtrl: PopoverController, public navParams: NavParams) {

        this.loadMore(false, false);
        this.username = auth.user;
    }

    loadMore(infiniteScroll: any, reset: boolean) {
        if (reset) {
            this.page = 0;
        }
        var offset = this.page * this.perPage;
        //this.auth.jwtHelper.isTokenExpired('id_token')
        this.http.get(this.auth.API_URL + 'collaborations?offset=' + offset + '&max=' + this.perPage + '&q=' + this.search).subscribe(
            data => {
                this.page++;
                
                var newData = data.json();
                if (reset) {
                    if (this.navParams.get('key')){
                        if (this.navParams.get('key') === 'hot'){
                            this.hotpage = true;
                            // this.collaborations = newData;
                            for (let i = 0; i < newData.length; ++i){
                                
                                if (newData[i].commentsCount > 24){

                                    this.collaborations.push(newData[i]);
                                }
                            }
                            if (this.collaborations.length < 10){
                                this.loadMore(false, false);
                            }
                        } else {
                            for (let i = 0; i < newData.length; ++i){
                                if (this.searchKeyword(newData[i].keywords, this.navParams.get('key'))){

                                    this.collaborations.push(newData[i]);
                                }
                            }
                            if (this.collaborations.length < 10){
                                this.loadMore(false, false);
                            }
                        }
                    } else {
                        this.collaborations = newData;
                    }
                } else {
                    if (this.navParams.get('key') === 'hot'){
                        this.hotpage = true;
                        // Array.prototype.push.apply(this.collaborations, newData);
                        for (let i = 0; i < newData.length; ++i){
                            if (newData[i].commentsCount > 24){

                                this.collaborations.push(newData[i]);
                            }
                        }
                        if (this.collaborations.length < 10){
                            this.loadMore(false, false);
                        }
                    } else {
                        if (this.navParams.get('key')){
                            for (let i = 0; i < newData.length; ++i){
                                if (this.searchKeyword(newData[i].keywords, this.navParams.get('key'))){
                                    this.collaborations.push(newData[i]);
                                }
                            }
                        } else {
                            Array.prototype.push.apply(this.collaborations, newData);
                        }
                        if (this.collaborations.length < 10){
                            this.loadMore(false, false);
                        }
                    }
                }
                if (infiniteScroll) {
                    infiniteScroll.complete();
                }

            },
            err => {
                console.log('err', err);
                this.error = err;
                this.auth.reauth();
            })
        if (!this.auth.authenticated()) {
            this.navCtrl.setRoot(HomePage, {});
        }
    }

    searchKeyword(array, key){
        console.log(array);
        for (let i = 0; i < array.length; ++i){
            if (key.toLowerCase().replace(' ', '') === array[i].toLowerCase().replace(' ', '')){
                return true;
            }
        }
        return false;
    }


    clickCollVote(value, collId) {
        //value id user-id type
        this.http.post(this.auth.API_URL + "item/" + collId + "/" + 'collaboration' + "/like?value=" + value, {})
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
        this.navCtrl.push(UserPage, {
            userId: userId
        });
    }


    reportAPost(collaboration_id) {
        let params = {type: 'collaboration', id: collaboration_id};
        // console.log("params isnide the about component",params);
        let reportModal = this.modalCtrl.create(ReportPage, {params});
        reportModal.present();
    }

    showReportIcon(username) {
        return username == this.username;
    }

    showDeleteIcon(username) {
        return username != this.username;
    }

    hideCollaboration(id) {
        let $this = this;
        let alert = this.alertCtrl.create({
            title: 'Block item',
            message: 'Are you sure you want to hide this item?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.http.post(this.auth.API_URL + 'collaborations/' + id + '/hide', {
                            id: id
                        }).subscribe(
                            data => {
                                $this.loadMore(false, false);

                                // let res = data.json();
                                // if (res.success == true) {
                                //     let alert = this.alertCtrl.create({
                                //         title: 'Success',
                                //         subTitle: 'Your request has been submitted successfully',
                                //         buttons: ['Dismiss']
                                //     });
                                //     alert.present();
                                // }
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
                        this.http.delete(this.auth.API_URL + 'collaborations/' + id, {}).subscribe(
                            data => {
                                let res = data.json();
                                if (res.success == true) {
                                    let alert = this.alertCtrl.create({
                                        title: 'Success',
                                        subTitle: 'Your request has been submitted successfully',
                                        buttons: ['Dismiss']
                                    });
                                    alert.present();
                                    this.loadMore(false, true);

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
    classNameForComments(comments){
        // return "comm-gt-100";
        if (comments > 24 && comments < 50) {
            return "comm-gt-50";
        } else if (comments>50) {
            return "comm-gt-100";
        } else  {
            return "comm-gt-50";
        }
    }
    presentPopover(ev, collaboration) {
        let popover = this.popoverCtrl.create(ContextMenuComponent, {
            delCol: collaboration.username == this.username, //allow delete only own collaborations
            hideCol: true,//item.username != this.username,
            addSpiel: false,
            delSpiel: false,
            hideSpiel: false,
            reportCol: collaboration.username != this.username
        });
        popover.present({ev: ev});
        popover.onDidDismiss((action, id) => {
            if (action == 'delCol') {
                // confirm delete item
                this.deletePost(collaboration.id);
            } else if (action == 'hideCol') {
                // confirm delete item
                this.hideCollaboration(collaboration.id);
            } else if (action == 'reportCol') {
                // confirm delete item
                this.reportAPost(collaboration.id)
            } else {
                console.log('action', action);
            }
        })
    }
}