import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';
import { TermsPage } from './../home/terms';
import { PolicyPage } from './../home/policy';
import { CommunityPage } from './../home/community';

import { AuthService } from "../../providers/auth-service";


@Component({
    selector: 'page-invite',
    templateUrl: 'invite.html'
})
export class InvitePage {

    // When the page loads, we want the Login segment to be selected
    authType: string = "login";
    _accept = {
        'checked' : false
    };

    constructor(public navCtrl: NavController, public auth: AuthService, public modalCtrl: ModalController) {

    }

    showModal(name) {
        let modal = null;
        if (name == 'terms') {
            modal = this.modalCtrl.create(TermsPage);
        } else  if (name == 'policy') {
            modal = this.modalCtrl.create(PolicyPage);
        } else  if (name == 'community') {
            modal = this.modalCtrl.create(CommunityPage);
        }
        modal.present();
    }
}
