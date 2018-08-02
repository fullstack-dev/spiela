import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
//import { HomePage } from "../home/home";
import { TabsPage } from "../tabs/tabs";
/**
 * Generated class for the IntroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  constructor(public navCtrl: NavController, public app : App) {
 
  }
 
  goToHome(){
     
    //this.navCtrl.getRootNav().push(HomePage, {});
    this.app.getRootNav().push(TabsPage, {});
  }

}
