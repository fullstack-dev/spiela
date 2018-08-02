import { App, NavController, NavParams, Events,  ToastController,  LoadingController, } from 'ionic-angular';
import { Component } from '@angular/core';
import { CameraService } from '../../providers/camera-service';
import { RestService } from '../../providers/rest-service';
import { AuthService } from "../../providers/auth-service";
import { UserPage } from "../user/user";
import { EditPicturePage } from "../editpicture/editpicture";

import { AlertController } from 'ionic-angular';

@Component({
    selector: 'edit-profile',
    templateUrl: 'editprofile.html'
})
export class EditProfilePage {
    user: any = {};
    username: string = '';
    email: string = '';  
    bio: string = '';
    profileImg: string = '';
    website: string = '';
    fullname: string = '';
    constructor(private navParams : NavParams, 
        private app : App, 
        private auth : AuthService, 
        private rest : RestService,    
        private alertCtrl: AlertController,)
    {
       
        this.user = ( this.navParams.data.profile) ?  this.navParams.data.profile : {};
        try 
        {
            let r = this.user;  
        }
        catch(e) { return; }
        this.profileImg = this.auth.chooseProfilePic(this.user);
        this.username = this.user.username;
        this.email = this.user.email;
        this.bio = this.user.bio;
        this.fullname = this.user.full_name;
        this.website = this.user.website;
        
    }
    saveProfile()
    {
        this.user.bio = this.bio;
        this.user.email = this.email;
        this.user.website = this.website;
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
        var s = new RegExp(re);
        if ( ! s.test(this.user.email)) 
        {
            let alertr = this.alertCtrl.create({
                title: 'Invalid E-Mail',
                message: 'Make sure your E-Mail address has the proper format.',
                buttons: [
                    {
                        /*text: 'Cancel',
                        role: 'cancel',*/
                  },
                    {
                    }
                ]
            });
            alertr.present();
            return;
        }
        this.user.website = this.user.website.toLowerCase();
        /*var validURL = '^(ftp|http|https):\/\/[^ "]+\.([a-zA-Z]{2,})$';
        var r = new RegExp(validURL);
        if (this.user.website.trim() != '' && ! r.test(this.user.website) ) 
        {
            let alertr = this.alertCtrl.create({
                title: 'Invalid URL',
                message: 'Make sure your URL has the proper format before trying to save your changes (you can start with http://, https://, or ftp://).',
                buttons: [
                    {
                       
                  },
                    {
                    }
                ]
            });
            alertr.present();
            return;
        }*/
        this.user.full_name = this.fullname;
        this.rest.editUserProfile(this.user).subscribe( data => {  this.app.getActiveNav().push(UserPage, { savedData : 1}); });
    }
    editPicture()
    {  
        this.app.getRootNav().push(EditPicturePage, { profile: this.user });
    }
    onChange()
    {
        this.rest.addUserType(this.user.personType).subscribe();
    }
}