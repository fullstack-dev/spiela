import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {TabsPage} from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../providers/auth-service';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
 import { PushNoti } from '../providers/pushnoti';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage:any;

    constructor(platform: Platform, 
                private auth: AuthService,
                statusBar: StatusBar,
                splashScreen: SplashScreen,
                private pushnoti: PushNoti,
             ) {
       platform.resume.subscribe(() => {
            console.log("We are resuming");
            this.pushnoti.resetFinalToken();
            if (! this.auth.authenticated())
            {
                console.log("We are re-authenticating");
                this.auth.reauth();
            }
        }); 
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            setTimeout(() => {
                splashScreen.hide();
            }, 100);
            console.log(this.auth.authenticated());
            if (this.auth.authenticated() === false) {
                this.rootPage = LoginPage;
            } else {
 
                this.rootPage = TabsPage;
            }
        });
    }
}
