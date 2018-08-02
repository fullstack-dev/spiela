import { Injectable } from '@angular/core';
import { JwtHelper, tokenNotExpired } from "angular2-jwt"; 
import 'rxjs/add/operator/map';
import { AlertController } from "ionic-angular";
import { Headers, Http, URLSearchParams } from "@angular/http";
import { Storage } from "@ionic/storage";
import config from "../app/config.json";
import { RestService } from '../providers/rest-service';
import { error } from 'util';
import { PushNoti } from '../providers/pushnoti';

/*
import  firebase  from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';

import { FCM } from '@ionic-native/fcm';*/

/*
 Generated class for the AuthService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class AuthService  {
    API_URL: string = config.API_URL;
    LOGIN_URL: string = config.LOGIN_URL;
    SIGNUP_URL: string = config.SIGNUP_URL;//"https://spiela.co.uk/sign-up/app";
    CDN_URL: string = config.CDN_URL;
    // API_URL: string = "http://magento2.hosting.vallsoft.com/api/";
    // LOGIN_URL: string = "http://magento2.hosting.vallsoft.com/api/login_check";
    // SIGNUP_URL: string = "http://magento2.hosting.vallsoft.com/sign-up/app";
    // CDN_URL: string = "//magento2.hosting.vallsoft.com/";

    idToken: string;
    user: string;
    user_id: number;
    userProfile: any = {};
    contentHeader: Headers = new Headers({ "Content-Type": "application/x-www-form-urlencoded" });
    error: string;
    jwtHelper: JwtHelper = new JwtHelper();
    _password: string = '';

    constructor(
        private storage: Storage,
        private http: Http,
        public alertCtrl: AlertController,
        private rest: RestService,
        private pushnoti: PushNoti,
     
        /*private afDatabase: AngularFireDatabase,
        private fcmx: FCM*/
    ) {
        storage.get('id_token').then(token => {
             this.idToken = token;
        });

        storage.get('profile').then(profile => {
            //console.log('user', profile);
            this.user = profile;

            this.loadUser(this.user);
        }).catch(error => {
            console.log(error);
        });
    }
     
    loadUser(userIdOrUsername) {  
        this.rest.loadUser(userIdOrUsername).subscribe(data => {
        
            this.userProfile = data.user;
            this.user = this.userProfile.username;
            if (this.pushnoti.getFinalToken() == '')
            {
                this.pushnoti.loadUser(this.userProfile);
            }
            this.user_id = this.userProfile.id;
        }, err => {
            console.log(err);
        });
    }
    getUserId()
    {
        return this.user_id;
    }
    authenticated() {
        // console.log('authenticated', tokenNotExpired(null, this.idToken));
        // console.log(tokenNotExpired(), tokenNotExpired('id_token') )
        return tokenNotExpired();
    }
    login(credentials) {
        //console.log('credentials', credentials);
        let params = new URLSearchParams();
        params.set('_password', credentials._password);
        params.set('_username', credentials._username);
        return this.http.post(this.LOGIN_URL, params.toString(), { headers: this.contentHeader })
            .map(res => res.json())
    }

    showAlert(message, cb) {
        let alert = this.alertCtrl.create({
            title: 'Registration',
            subTitle: message,
            buttons: [{
                text: 'OK',
                handler: () => {
                    cb();
                }
            }]
        });
        alert.present();
    }

    signup(credentials) {
        return  this.http.post(this.SIGNUP_URL, JSON.stringify(credentials), { headers: this.contentHeader })
            .map(res => res.json())
    }

    logout() {
        this.storage.remove('id_token').then(() => {
            this.user = null;
            localStorage.removeItem('token');
            //window.location.reload();
        });
        // sessionStorage.removeItem('id_token');

    }

    reauth() {
        this.authSuccess(this.idToken);
    }
    chooseProfilePic(user)
    {
        let picFil = user.userImage;
        let profileImg = '';
        if (null == user.userImage) { return "assets/img/profile-image.png"; }
        if (typeof(picFil) != 'undefined') { picFil = picFil.substr(picFil.lastIndexOf('/') + 1); }
        else picFil = '';
        if (picFil.length == 0) { profileImg = "assets/img/profile-image.png"; }
        else profileImg = "http://spiela.co.uk/media/cache/avatar/uploads/"+ user.userImage;
        return profileImg;
        //return this.auth.chooseProfilePic(user);
    }/*
    chooseProfilePic(user) <--- old version, relies on thumb image
    {   
        let picFil = user.user_image_thumb;
        let profileImg = '';
        if (typeof(picFil) != 'undefined') { picFil = picFil.substr(picFil.lastIndexOf('/') + 1); }
        else picFil = '';
        if (picFil.length == 0) { profileImg = "assets/img/profile-image.png"; }
        else profileImg = user.user_image_thumb;
        return profileImg;
    }*/
    authSuccess(token) {
        //console.log(token);
        if (!token) {
            return;
        }
        this.error = null;
        this.user = this.jwtHelper.decodeToken(token).username;
        let user = this.user;
         
        //console.log(user);
        let storage = this.storage;
        storage.set('id_token', token).then(() =>
            storage.set('profile', user).then(() => {
                //window.location.reload()
                
                localStorage.setItem('token', token);
                this.loadUser(user);
                //console.log(user);
            })
        );
    }

}
