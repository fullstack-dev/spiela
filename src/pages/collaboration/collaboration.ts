import { Component } from '@angular/core';
import { AlertController, ModalController, NavController, NavParams, PopoverController, App } from 'ionic-angular';
import { UserPage } from "../user/user";
import { ReportPage } from '../shared-report-modal/report-modal';
import { AuthService } from "../../providers/auth-service";
import { ShareMenuComponent } from "../../components/share-menu/share-menu";
import { ContextMenuComponent } from "../../components/context-menu/context-menu";
import { Collaboration } from "../collaboration";
import { RestService } from "../../providers/rest-service";
import { NotifyService } from '../../providers/notify-service';
import { Bookmarks } from '../../providers/bookmarks'; 
import { ViewPicturePage } from "../view-picture/view-picture";

@Component({
    selector: 'page-collaboration',
    templateUrl: 'collaboration.html'
})

export class CollaborationPage {
    collaboration: Collaboration = new Collaboration("");
    newComment = '';
    bookmarkimage = 'assets/img/bookmark.png';
    private error = '';
    private collId = '';
    private username = '';
    private usertags = [];
    private last = '';
    
    constructor(
        private modalCtrl: ModalController,
        private navCtrl: NavController,
        private alertCtrl: AlertController,
        private popoverCtrl: PopoverController,
        private navParams: NavParams,
        private rest: RestService,
        private auth: AuthService,
        private notify: NotifyService,
        private bookmarks: Bookmarks,
        private app : App,
    ) {
        this.collId = navParams.data.collId;
        this.username = auth.user;
        this.loadCollaboration(this.collId) ;
    }

    reloadTags(data) {  
        this.usertags = data.data;
        this.last = data.last;
    }
    viewTheImage(id)
    {
        this.app.getActiveNav().push(ViewPicturePage, { id : id });
    }

    bookmark(collaboration)
    {
        if (this.bookmarkimage == 'assets/img/bookmark_2.png') { this.bookmarkimage = 'assets/img/bookmark.png'; }
        else 
        {
            this.bookmarkimage = 'assets/img/bookmark_2.png';
        }
        let bookdata = this.bookmarks.bookmarkCollaboration(this.username, collaboration);
        bookdata.subscribe(data => {  
            let bookdat = this.bookmarks.getBookmark(this.auth.user, this.collaboration);
            bookdat.subscribe(data => { 
                if (data.success == 1)
                {   
                //this.bookmarkimage = 'assets/img/bookmark_2.png';
                } else {/* this.bookmarkimage = 'assets/img/bookmark.png'; */} });
        }, err => { console.log(err); });
    }

    selectUserTag(tag, mentionableInput) {  
        //if (tag != null) tag = tag.toLowerCase();
        let toProcess = mentionableInput.value.substr(0, mentionableInput.selectionEnd);
        let withoutTag = toProcess.substr(0, toProcess.lastIndexOf('@' + this.last));
        mentionableInput.value = mentionableInput.value.replace(toProcess, withoutTag + '@' + tag + ' ');
        this.usertags = [];
        this.last = '';
        mentionableInput.setFocus();
    }

    presentPopover(ev) {
        let collId = this.collId;
        let username = this.username
        let popover = this.popoverCtrl.create(ContextMenuComponent, {
            collaboration: collId,
            delCol: this.collaboration.user.username == username,
            hideCol: this.collaboration.user.username != username,
            reportCol: this.collaboration.user.username != username,
            shareCol: this.collaboration.user.username != username
        });
        popover.present({ ev });
        popover.onDidDismiss((action, id) => {
            switch (action) {
                case 'delCol':
                    this.deleteCol(collId);
                    break;
                case 'reportCol':
                    this.reportAPost(collId);
                    break;
                case 'hideCol':
                    this.hideCol(collId);
                    break;
                case 'shareCol':
                    this.shareCol(collId);
                    break;    
                default:
                    console.log('unhandled action', action);
                    break;
            }
        });
    }
    getRightImage(img1, img2)
    {
       //img1 may not exist at first
       img1 = 'https://spiela.co.uk/media/cache/collab_wide/uploads/post/' + img1;
       var img = new Image();
       img.src = img1;
       
       if (img.height != 0) { return img1; } 
       else 
       {
           img.src = img2;
           if (img.height != 0) { return img2; } 
           else return false;
       }
    }
    loadCollaboration(collId) {
        
        this.rest.loadCollibration(collId).subscribe(
            data => {
                console.log(JSON.stringify(data));
                this.collaboration = data.json();
                 
                let bookdat = this.bookmarks.getBookmark(this.auth.user, this.collaboration);
                 bookdat.subscribe(data => { 
                      /*
                      var img = new Image();
           
            img.src = this.profileImg;
             
            if (img.height != 0) 
            { 
                this.profileImg = img.src;
            } 
                      */
                     if (data.success == 1)
                     {
                        this.bookmarkimage = 'assets/img/bookmark_2.png';
                     } else { this.bookmarkimage = 'assets/img/bookmark.png'; } }, 
                 err => { console.log(err); });; }, err => { this.error = err; }
        );
    }

    addComment(collaboration) {
        collaboration.commentsCount++;
        this.rest.addCommentOnCollibration(this.collId, this.newComment).subscribe(data => {
            this.loadCollaboration(this.collId);
            
            this.newComment = '';
        }, err => {
            console.log(err);
            this.error = err;
        });
    }

    clickSpielVote(value, id) {
        this.rest.voteSpielaOnCollibrartion(id, value).subscribe(
            data => this.loadCollaboration(this.collId),
            err => this.error = err
        );
    }

    clickVote(value) {
        this.clickSpielVote(value, this.collId);
    }

    clickCommentVote(value, id) {
        this.rest.voteCommentOnCollibrartion(id, value).subscribe(
            data => this.loadCollaboration(this.collId),
            err => this.error = err
        );
    }

    navigateUser(userId) {
        this.rest.loadUser(userId).subscribe(data => {
            var userProfile = data.user;
            this.navCtrl.push(UserPage, { userProfile });
        }, err => {
            this.error = err;
        });
    }

    reportAPost(collId) {
        let params = { type: 'collaboration', id: collId };
        this.modalCtrl.create(ReportPage, { params }).present();
    }

    showComment(username) {
        if (username == this.username) {
            return false;
        } else {
            return true;
        }
    }

    deleteComment(id) {
        this.alertCtrl.create({
            title: 'Confirm deletion',
            message: 'Are you sure you want to delete this comment?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.rest.deleteComment(id).subscribe(
                            data => this.loadCollaboration(this.collId),
                            err => this.alertCtrl.create({
                                title: 'Error',
                                subTitle: 'Something wrong!',
                                buttons: ['Dismiss']
                            }).present()
                        )
                    }
                }
            ]
        }).present();
    }

    shareCol(id) {
        console.log("colId: ", id);
        let collId = this.collId;
        let username = this.username;
        let collaboration = this.collaboration;

        let popover = this.popoverCtrl.create(ShareMenuComponent, {
            collaborationId: collId,
            username: this.collaboration.user.username,
            collaboration: this.collaboration
        });
        popover.present();
    }

    hideCol(id) {
        this.alertCtrl.create({
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
                        this.rest.hideCollibration(id).subscribe(
                            data => console.log(data),
                            err => {
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
        }).present();
    }

    deleteCol(id) {
        this.alertCtrl.create({
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
                        this.rest.deleteCollibration(id).subscribe(
                            data => console.log(data),
                            err => {
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
        }).present();
    }


    deleteSpiel(id) {
        this.alertCtrl.create({
            title: 'Confirm deletion',
            message: 'Are you sure you want to delete this post?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.rest.deleteSpiel(id).subscribe(data => {
                            let res = data.json();
                            if (res.success == true) {
                                this.alertCtrl.create({
                                    title: 'Success',
                                    subTitle: 'Your request has been submitted successfully',
                                    buttons: ['Dismiss']
                                }).present();
                            }
                        }, err => this.alertCtrl.create({
                            title: 'Error',
                            subTitle: 'Something wrong!',
                            buttons: ['Dismiss']
                        }).present());
                    }
                }
            ]
        }).present();
    }
}
