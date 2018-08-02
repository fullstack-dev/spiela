import {Component, Input} from '@angular/core';
import {ViewController} from "ionic-angular";

/**
 * Generated class for the ContextMenuComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
    selector: 'context-menu',
    templateUrl: 'context-menu.html'
})
export class ContextMenuComponent {
    buttons: any = {};

    constructor(private viewCtrl: ViewController) {
        this.buttons = viewCtrl.getNavParams().data;
        console.log(this.buttons, 'buttos');
    }

    close(action) {
        this.viewCtrl.dismiss(action);
    }

}
