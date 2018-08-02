import { Component } from '@angular/core';
import { AuthService } from "../../providers/auth-service";
import { NavController } from "ionic-angular";
import { HomePage } from "../home/home";
import { LoginPage } from '../login/login';
import { IntroPage } from '../intro/intro';
import { Storage } from "@ionic/storage";

/*
 Generated class for the Profile page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage {


    constructor(public auth: AuthService, 
                public navCtrl: NavController,
                private storage: Storage
            ) {
        if (!auth.authenticated()) {
            this.navCtrl.setRoot(HomePage, {});
        }
    }
    // logout
    logout() {
        // this.storage.remove('id_token').then(() => {
        //     localStorage.removeItem('id_token');
        //     this.navCtrl.setRoot(LoginPage);
        // });
        console.log('logout')
    }
    gotoIntro()
    {
       
    }
}
