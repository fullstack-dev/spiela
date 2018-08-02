import {Component, Input, ApplicationRef} from '@angular/core';
import { App, ViewController, NavController} from "ionic-angular";
import { MyCollaborationPage } from "../../pages/my-collaboration/my-collaboration";
import { MyBookmarksPage } from "../../pages/my-bookmarks/my-bookmarks";
import { TabsPage } from "../../pages/tabs/tabs";
/**
 * Generated class for the ContextMenuComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
    selector: 'profile-menu',
    templateUrl: 'profile-menu.html'
})
export class ProfileMenuComponent {
    buttons: any = {};

    constructor(private viewCtrl: ViewController,  private navCtrl: NavController, private appCtrl: App) {
        this.buttons = viewCtrl.getNavParams().data;
        console.log(this.buttons, 'buttos');
        
    }

    close(action) {
        this.viewCtrl.dismiss(); 
        if (action == 'colla') this.appCtrl.getActiveNav().push(MyCollaborationPage, {});
        else this.appCtrl.getActiveNav().push(MyBookmarksPage);
        //else this.appCtrl.getRootNav().push(MyBookmarksPage);
    }

}
