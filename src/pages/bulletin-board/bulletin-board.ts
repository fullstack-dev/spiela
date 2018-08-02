import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserPage } from '../user/user';
import { StartCollaborationPage } from "../start-collaboration/start-collaboration";
import { CollaborationPage } from '../collaboration/collaboration';
import { FeedbackPage } from '../feedback/feedback';
import { NotifyService } from "../../providers/notify-service";
import { RestService } from '../../providers/rest-service';
import { AuthService } from '../../providers/auth-service';
import { Observable } from 'rxjs/Rx';


@Component({
    selector: 'page-bulletin',
    templateUrl: 'bulletin-board.html'
})
export class BulletinBoardPage {
    curUser = null;
    data = [];
    _accept = { 'checked': false };

    constructor(
        private navCtrl: NavController,
        private rest: RestService,
        private auth: AuthService,
        private notify: NotifyService
    ) {
        let loader = this.notify.showLoader();
        Observable.forkJoin(
            this.rest.loadUserProfile(null),
            this.rest.loadBulletins().map(json => json.entities),
            (profile, entities) => {
                this.curUser = profile.user;
                return entities.filter(entity => this.curUser.id === entity.user.id);
            }
        ).subscribe(items => {
            this.data = items;
            loader.dismissAll();
        }, error => {
            loader.dismissAll();
            console.log(error);
        });
    }

    startacollab() {
        this.navCtrl.setRoot(StartCollaborationPage, {});
    }

    feedback() {
        this.navCtrl.setRoot(FeedbackPage, {});
    }

    navigateUser(userId) {
        this.navCtrl.push(UserPage, {
            userId: userId
        });
    }

    navigateToColl(collId) {
        this.navCtrl.push(CollaborationPage, { collId });
    }

    showShowWords(str) {
        let splited = str.split(" ");
        if (splited.length >= 3)
            return `${splited.slice(0, 3).join(" ")}...`;
        return str;
    }}
