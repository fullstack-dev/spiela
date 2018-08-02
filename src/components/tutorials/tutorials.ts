import {Component, Input, ApplicationRef} from '@angular/core';
import { App, ViewController, NavController} from "ionic-angular";

import { TabsPage } from "../../pages/tabs/tabs";
/**
 * Generated class for the ContextMenuComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
    selector: 'tutorials',
    templateUrl: 'tutorials.html'
})
export class TutorialsComponent {
    buttons: any = {};

    constructor(private viewCtrl: ViewController,  private navCtrl: NavController, private appCtrl: App) {
       // this.buttons = viewCtrl.getNavParams().data;
       // console.log(this.buttons, 'buttos');
        
    }

    close(action) {
        this.viewCtrl.dismiss(); 
       
    }

}
