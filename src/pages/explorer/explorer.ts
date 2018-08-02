import { ReportPage } from './../shared-report-modal/report-modal';
import { Component } from '@angular/core';

import { NavController, ModalController, AlertController, PopoverController, NavParams, Events,  App} from 'ionic-angular';
import { CollaborationPage } from "../collaboration/collaboration";
import { HomePage } from "../home/home";
import { UserPage } from "../user/user";
import { ViewPicturePage } from "../view-picture/view-picture";
import { ContextMenuComponent } from "../../components/context-menu/context-menu";

import { AuthService } from "../../providers/auth-service";
import { RestService } from '../../providers/rest-service';
import { NotifyService } from '../../providers/notify-service';

import { SearchresultsPage } from '../searchresults/searchresults';
import { Storage } from '@ionic/storage';
 
 

@Component({
    selector: 'page-explorer',
    templateUrl: 'explorer.html'
})
export class ExplorerPage {
    error = '';
    collaborations = new Array();
    perPage = 300; 
    page = 0;
    search = '';
    oldSearch = '';
    isSearch = false;
    username = '';
    hotpage = false;
    key = null;
    specialReload = false;
    userProfile: any = {};

    constructor(
        private modalCtrl: ModalController,
        private navCtrl: NavController,
        private alertCtrl: AlertController,
        private popoverCtrl: PopoverController,
        private navParams: NavParams,
        private auth: AuthService,
        private rest: RestService,
        private notify: NotifyService,
        public events: Events,
        private storage: Storage,
        private app : App
        
    ) {
    
        this.storage.set('firsttime', 1);
        this.loadMore(false, true);
        
        this.username = auth.user;
        
        // Listen for event when new colab is added;
        this.events.subscribe('publised:reload', () => {
            this.specialReload = true;
            this.loadMore(false, true);
       }) 
        if (this.key === "hot")
            this.hotpage = true;
    }
    getRightExplorer ( item )
    {
       var img1 = item.collaboration_image_thumb;
       var img = new Image();
       img.src = img1;
       
       if (img.height != 0) { return img1; } 
       else 
       {
           img.src = item.collaboration_image;
           if (img.height != 0) { return  item.collaboration_image; } 
           else
           {
                var  img1 = item.collaboration_image.substr(item.collaboration_image.lastIndexOf('/') + 1); 
                img1 = 'https://spiela.co.uk/media/cache/collab_wide/uploads/post/' + img1;
                var img = new Image();
                img.src = img1;
                
                if (img.height != 0) { return img1; } 
           }
           
           return false;
       }
    }

    filterByItem(item)
    {
        var tolowerUser = item.username.toLowerCase();
        if (tolowerUser != 'srrt' && tolowerUser != 'namesxare' && tolowerUser != 'rubyp85' && tolowerUser != 'redbullcat' && tolowerUser != 'marcoricci' && tolowerUser != 'ivankayima' && tolowerUser != 'fitimba' && tolowerUser != 'skip' && tolowerUser != 'carlo')
        {
            //console.log('the user is ' + tolowerUser);
            if (this.key == null) return true;
            var thisKey = this.key.toLowerCase();
            //console.log('the key is ' + thisKey);
            if (thisKey == 'partners' || thisKey == 'events' || thisKey == 'influencers')
            {
                return false;
            }
        }
        return true;
    }
    viewTheImage(id)
    {
        this.app.getActiveNav().push(ViewPicturePage, { id : id });
    }
    getRightImage_ex(img1, img2)
    {
       //img1 may not exist at first
       img1 = 'https://spiela.co.uk/media/cache/collab_wide/uploads/post/' + img1;
       var img = new Image();
       img.src = img1;
       if (img.height != 0) { return img1; } 
       else return img2;
    }
    loadMore(infiniteScroll: any, reset: boolean) {
        if (reset) {
            this.page = 0;
            this.collaborations = new Array();
            
        }  
        this.perPage = 300;
        if (this.search != '')
        {
            this.isSearch = true;
            if (this.oldSearch != this.search)
            {
                this.oldSearch = this.search;
                this.collaborations = [];
            }

        } else 
        {  
            this.key = this.navParams.data.key; 
            this.isSearch = false;
        }
        if (this.key == '' || typeof(this.key) == 'undefined')//used by explorer
        {
            this.isSearch = true;
            this.perPage = 10;
        }
        /*console.log("*************************************************************");
        if (reset) { console.log('We have reset'); }
        else { console.log('We have not reset yet'); }
        console.log("***** We have the key as: " + this.key);
        console.log("***** We have perpage as : " + this.perPage);
        console.log("***** We have page as : " + this.page);
        console.log("***** We have search as : " + this.search); 
        
        if (this.isSearch) console.log("We have this.isSearch as true");
        else console.log("We have this.isSearch as false");*/
        
        if (this.specialReload)
        {
            this.isSearch = true;
            this.search = '';
        }


        let offset = this.page * this.perPage;
        let keywordtouse = (this.key) ? this.key : '';
        this.rest.loadCollibrations(this.key, offset, this.perPage, this.search, this.isSearch, keywordtouse).subscribe(data => {
            this.page++;
            if (this.key) 
            {     
                let filted = data.filter(item => {
                    if (this.hotpage) {
                        let flag = (item.commentsCount > 24);
                        return flag;
                    }
                    return this.searchKeyword(item.keywords, this.key);
                });

                if (filted.length == 0) { return; }
                this.collaborations.push(...filted);
            } else 
            { 
                 
                this.collaborations.push(...data);
            }
            if (this.collaborations.length == 0) {
        
                this.loadMore(false, false);
            }
            if (infiniteScroll) {
                infiniteScroll.complete();
            }                
        }, err => {
            console.log(err);
            this.error = err;
            this.auth.reauth();
        });
        if (!this.auth.authenticated()) {
            this.navCtrl.setRoot(HomePage, {});
        }
    }
    choose_image(picFil)
    {
        var picFil2 = '';
        if (typeof(picFil) != 'undefined') { picFil2 = picFil.substr(picFil.lastIndexOf('/') + 1); }
        else picFil2 = '';
        //alert(picFil);
        //console.log('the image here is ' + picFil);
        if (picFil2.length != 0) return picFil;
        else return 'assets/img/profile-image.png';
    }
    searchKeyword(array, key) {
        for (let i = 0; i < array.length; ++i) {
            if (key.toLowerCase().replace(' ', '') === array[i].toLowerCase().replace(' ', '')) {
                return true;
            }
        }
        return false;
    }

    clickCollVote(value, collId) {
        //value id user-id type
        this.rest.voteCollibration(collId, value)
            .subscribe(
            data => this.navigate(collId),
            err => this.error = err
            );
    }

    navigate(collId) {
        this.navCtrl.push(CollaborationPage, { collId });
    }

    navigateUser(userId) {
        this.rest.loadUser(userId).subscribe(data => {
            var userProfile = data.user;
            this.navCtrl.push(UserPage, { userProfile });
        }, err => {
            this.error = err;
        });
    }

    reportAPost(collaboration_id) {
        let params = { type: 'collaboration', id: collaboration_id };
        let reportModal = this.modalCtrl.create(ReportPage, { params });
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
                        this.rest.hideCollibration(id)
                            .subscribe(data => {
                                $this.loadMore(false, false);
                            }, err => {
                                let alert = this.alertCtrl.create({
                                    title: 'Error',
                                    subTitle: 'Something wrong!',
                                    buttons: ['Dismiss']
                                });
                                alert.present();
                            });
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
                        this.rest.deleteCollibration(id)
                            .subscribe(
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
                                    subTitle: `Something wrong! ${err}`,
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

    classNameForComments(comments) {
        // return "comm-gt-100";
        if (comments > 24 && comments < 50) {
            return "comm-gt-50";
        } else if (comments >= 50) {
            return "comm-gt-100";
        } else {
            return "comm--50";
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
        popover.present({ ev: ev });
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
