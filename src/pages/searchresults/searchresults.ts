import { ReportPage } from './../shared-report-modal/report-modal';
import { Component, ElementRef, ViewChild, Renderer} from '@angular/core';

import { NavController, ModalController, AlertController, PopoverController, NavParams, Events, Searchbar } from 'ionic-angular';
import { HomePage } from "../home/home";
import { UserPage } from "../user/user";
import { ExplorerPage } from "../explorer/explorer";
import { CollaborationPage } from "../collaboration/collaboration";
import { ContextMenuComponent } from "../../components/context-menu/context-menu";
import { AuthService } from "../../providers/auth-service";
import { RestService } from '../../providers/rest-service';
import { NotifyService } from '../../providers/notify-service';

/**
 * Generated class for the SearchresultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-searchresults',
  templateUrl: 'searchresults.html',
})
export class SearchresultsPage {
    
     
    //@ViewChildren('#searchbar') vc;
    @ViewChild('searchbar') firstNameElement: ElementRef;
    error = '';
    collaborations = new Array();
    perPage = 30; page = 0;
    search = '';
    isSearch = false;
    username = '';
    hotpage = false;
    key = null;
    userProfile: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
    private alertCtrl: AlertController,
     private popoverCtrl: PopoverController,
     private auth: AuthService,
     private rest: RestService,
     private notify: NotifyService,
     public events: Events,
      private el: ElementRef,
    ) 
     {
        this.search = navParams.get('search');
        if (this.search.trim() != '')
        {
            this.loadMore(false, true);
        }
  }
  ngAfterContentInit() 
  {  
      this.el.nativeElement.querySelector('#searchbar').focus();
      
  }
  loadMore(infiniteScroll: any, reset: boolean) {
    if (reset) {
        this.page = 0;
        this.collaborations = new Array();
    }
    if (this.search == '')
    {
        this.navCtrl.push(ExplorerPage, {search: ''});
    }
    let offset = this.page * this.perPage;
    let keywordtouse = (this.key) ? this.key : '';
    this.rest.loadCollibrations(this.key, offset, this.perPage, this.search, this.isSearch, keywordtouse).subscribe(data => {
        this.page++;
        if (this.key) {
            let filted = data.filter(item => {
                if (this.hotpage) {
                    let flag = (item.commentsCount > 24);
                    return flag;
                }

                return this.searchKeyword(item.keywords, this.key);
            });
            //console.log(JSON.stringify(filted));
            this.collaborations.push(...filted);
        } else {
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
     //console.log(JSON.stringify(this.collaborations));
    if (!this.auth.authenticated()) {
        this.navCtrl.setRoot(HomePage, {});
    }
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
