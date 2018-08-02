import {Component, Input} from '@angular/core';
import {ViewController} from "ionic-angular";
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the ShareMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'share-menu',
  templateUrl: 'share-menu.html',
})
export class ShareMenuComponent {

  	collaborationId: any;
    username: any;

    constructor(
    	private viewCtrl: ViewController,
    	private socialSharing: SocialSharing
    	) {
            this.collaborationId = viewCtrl.getNavParams().get('collaborationId');
            this.username = viewCtrl.getNavParams().get('username');
            console.log("collaboration id: ", this.collaborationId);
            console.log('username: ', this.username);
        }

    facebook() {
    	// Share via facebook 
        this.socialSharing.shareViaFacebook("shareViaFacebook", '', "https://spiela.co.uk/collaboration/" + this.collaborationId)
        .then(() => {
          // Success!
            console.log("success share via facebook");
            this.viewCtrl.dismiss();
        }).catch(() => {
          // Error!
            console.log("error share via facebook");
            this.viewCtrl.dismiss();
        });
    }

    twitter() {
    	// Share via twitter
        this.socialSharing.shareViaTwitter("shareViaTwitter", '', "https://spiela.co.uk/collaboration/" + this.collaborationId)
        .then(() => {
          // Success!
            console.log("success share via twitter");
            this.viewCtrl.dismiss();
        }).catch(() => {
          // Error!
            console.log("error share via twitter");
            this.viewCtrl.dismiss();
        });
    }

    whatsapp() {
    	// Share via whatsapp
        this.socialSharing.shareViaWhatsApp("shareViaWhatsapp", '', "https://spiela.co.uk/collaboration/" + this.collaborationId)
        .then(() => {
          // Success!
            console.log("success share via whatsapp");
            this.viewCtrl.dismiss();
        }).catch(() => {
          // Error!
            console.log("error share via whatsapp");
            this.viewCtrl.dismiss();
        });
    }

}
