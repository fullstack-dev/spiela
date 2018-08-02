import { Component } from '@angular/core';
import { ModalController, NavController, PopoverController } from 'ionic-angular';
import { ExplorerPage } from "../explorer/explorer";
import { TermsPage } from './terms';
import { PolicyPage } from './policy';
import { CommunityPage } from './community';
import { FeedbackPage } from '../feedback/feedback';
import { AuthService } from "../../providers/auth-service";
import { StartCollaborationPage } from "../start-collaboration/start-collaboration";
import { BulletinBoardPage } from "../bulletin-board/bulletin-board";
import { AboutPagePage } from "../about-page/about-page";
import { Facebook } from '@ionic-native/facebook';
import { RestService } from "../../providers/rest-service";


import { Support } from "../../providers/support";
import { Block } from "../../providers/block";

import { TooltipsModule } from 'ionic-tooltips';

 

//import { TutorialsComponent } from "../../components/tutorials/tutorials";

//import { Push, PushObject, PushOptions } from '@ionic-native/push';

//import { AngularFireDatabase } from 'angularfire2/database'

//import  firebase  from 'firebase';

/*
const options: PushOptions = {
    android: {
        senderID: '172797515074'
    },
    ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
    },
    windows: {},
    browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
    }
 };
*/
declare const facebookConnectPlugin: any;


@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    authType: string = "login";
    _accept = { checked: false };

    countNotifications: number;
    private error: string;
    private runningTimeOut: object = null;

    constructor(
        private fb: Facebook,
        private navCtrl: NavController,
        private auth: AuthService,
        private modalCtrl: ModalController,
        private rest: RestService,
     
        private supportService: Support,
        private blockService: Block,
        //private popoverCtrl:  PopoverController
        //private afDatabase: AngularFireDatabase
      //  private push: Push,
         
       
    ) {
        this.countNotifications = 0;
        /*firebase.initializeApp({
            apiKey: "AIzaSyBJCqeQIYdD4brQTqcxrLkoxBcndbd18hs",
            authDomain: "cobalt-abacus-125119.firebaseapp.com",
            databaseURL: "https://cobalt-abacus-125119.firebaseio.com",
            projectId: "cobalt-abacus-125119",
            storageBucket: "cobalt-abacus-125119.appspot.com",
            messagingSenderId: "172797515074"
          });
          firebase.auth().signInWithEmailAndPassword('rpcarnell@hotmail.com', 'diode66').catch(function(error) {
            // Handle Errors here.
               var errorCode = error.code;
               if (errorCode)
               {
                    firebase.auth().createUserWithEmailAndPassword('rpcarnell@hotmail.com', 'diode66').catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ...
                    });
               }
               var errorMessage = error.message;
               alert(errorMessage);
          });*/
           
    }

    ionViewWillEnter() {  
      
        if (!this.auth.authenticated())
            return;
         
            /*this.rest.unblockItem(54).subscribe();
            this.rest.unblockItem(55).subscribe();
            this.rest.unblockItem(56).subscribe();*/
        
        this.rest.loadUserProfile('').subscribe(data => {
            
                if (data.user)
                {
                    this.supportService.storeUsername(data.user.username);
                    this.auth.loadUser(data.user.username); 
                    this.auth.reauth();
                     
                    
                    let blocked = this.blockService.getBlocked(data.user.id);
                    if (blocked.length == 0)
                    {
                        this.blockService.loadBlocked(1);
                    }
                    let supported = this.supportService.getSupporting(data.user.id);
                   

                   
                    if (supported.length == 0)
                    {  
                        this.supportService.loadSupporting(data.user.id);
                    }
                }

            }, err => {
                this.error = err;
                this.auth.reauth();
            });
        if (this.runningTimeOut == null) { this.checkNotiLoop(); }
        else
        {
            this.rest.checkSeenBulletins().subscribe(
                count => this.countNotifications = count,
                err => console.log(err)
            );  
        }
    }
    checkNotiLoop()
    {   
        this.runningTimeOut= setTimeout(() => {   
            this.rest.checkSeenBulletins().subscribe( 
            count => this.countNotifications = count,
            err => console.log(err)
            );  
        this.checkNotiLoop();
        }, 2000);
    }
    navigate() { 
        
        this.navCtrl.setRoot(ExplorerPage, {});
    }

    login(credentials) {

        this.auth.login(credentials);
    }

    navigateToAbout() {
        this.navCtrl.push(AboutPagePage);
    }

    feedback() {
        this.navCtrl.setRoot(FeedbackPage, {});
    }

    bulletinboard() {  
        this.navCtrl.setRoot(BulletinBoardPage, {});
    }

    startacollab() {
        this.navCtrl.push(StartCollaborationPage, {});
    }

    navigateToCollaborations(key) {
        let data = { key };
        this.navCtrl.push(ExplorerPage, data);
    }

    showModal(name) {
        let modal = null;
        if (name == 'terms') {
            modal = this.modalCtrl.create(TermsPage);
        } else if (name == 'policy') {
            modal = this.modalCtrl.create(PolicyPage);
        } else if (name == 'community') {
            modal = this.modalCtrl.create(CommunityPage);
        }
        modal.present();
    }


    // This is the success callback from the login method
    fbLoginSuccess(response) {
        if (!response.authResponse) {
            this.fbLoginError("Cannot find the authResponse");
            return;
        }

        let authResponse = response.authResponse;
        this.getFacebookProfileInfo(authResponse);
    };

    // This is the fail callback from the login method
    fbLoginError(error) {
        console.log('fbLoginError', error);
    };

    // This method is to get the user profile info from the facebook api
    getFacebookProfileInfo(authResponse) {
        return this.fb.api(`/me?fields=email,name&access_token=${authResponse.accessToken}`, null);
        // return info.promise;
    };

    fblogin() {
        this.fb.login(['public_profile', 'user_friends', 'email']).then(res => {
            if (res.status === 'connected') {
                this.rest.fbLogin(res.authResponse.accessToken).subscribe(
                    data => this.auth.authSuccess(data.json().token),
                    error => console.log("Error = " + error)
                );

                this.getFacebookProfileInfo(res.authResponse)
                    .then(profileInfo => console.log(profileInfo))
                    .catch(error => console.log(`FB Profile info fail ${error}`));
            }
        }).catch(e => console.log('Error logging into Facebook', e));
    }

    facebookSignIn() {
        facebookConnectPlugin.getLoginStatus(function (success) {
            if (success.status === 'connected') {
                console.log('getLoginStatus', success.status);
            } else {
                console.log('getLoginStatus', success.status);
                facebookConnectPlugin.login(['email', 'public_profile'], this.fbLoginSuccess, this.fbLoginError);
            }
        });
    };
}
