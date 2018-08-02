import { App, NavController,   NavParams, Events,  ToastController,  LoadingController, } from 'ionic-angular';
import { Component } from '@angular/core';
import { CameraService } from '../../providers/camera-service';
import { RestService } from '../../providers/rest-service';
import { AuthService } from "../../providers/auth-service";
import { UserPage } from "../user/user";
 
@Component({
    selector: 'edit-picture',
    templateUrl: 'editpicture.html'
})
export class EditPicturePage {
    profileImg : string = '';
    user_supporting : any;
    user_likes : any;
    user_collaborations : any;
    user: any = {};
    constructor(private navParams: NavParams,
    private camService: CameraService,
    private toastCtrl: ToastController,
    private rest: RestService,
    private loadingCtrl: LoadingController,
    private auth: AuthService,
    private appCtrl : App, 
    ) { this.loadPicture(); }
    loadPicture()
    {   
        this.profileImg = ( this.navParams.data.profile.userImage ) ?  this.navParams.data.profile.user_image : '';
        this.presentActionSheet();
    }
    public presentActionSheet() {
        this.camService.showSheet((err, data) => { 
            if (err) {
                console.log(err);
                this.presentToast('Error while pick photo.');
                return;
            }

            let loading = this.loadingCtrl.create({ content: 'Please wait...' });
            loading.present();

            this.rest.uploadAvata(data, (err, result) => {  
                loading.dismiss();
                
                if (err) {  
                    this.presentToast('Error while uploading image.');
                    console.log(err);
                    return;
                }
                this.rest.loadUserProfile(this.navParams.data.profile.id).subscribe();
                this.rest.loadUser(this.navParams.data.profile.id).subscribe(
                    data => {
                        this.user = data.user;
                        this.auth.userProfile = this.user;
                        this.profileImg = this.user.user_image;
                        this.rest.loadUserProfile(this.navParams.data.profile.id).subscribe(data => { 
                            this.appCtrl.getActiveNav().push(UserPage,  { savedPicture : this.profileImg }); });
                    }, err => console.log(err)
                );

                this.presentToast('Image uploaded successfully.')
               
                /*
                this.rest.loadUserProfile(null).subscribe( data => {
                        this.rest.loadUser(this.navParams.data.profile.id).subscribe(
                            data => {
                                this.user = data.user;
                                this.auth.userProfile = this.user;
                                this.rest.loadUser(this.user);
                                
                                this.profileImg = this.user.user_image;
                                this.appCtrl.getActiveNav().push(UserPage,  { savedPicture : this.profileImg });
                            }, err => console.log(err)
                        );
                        this.presentToast('Image uploaded successful.')
                   } );//the profile, when null, creates the avatar
               */

               
            });
        });
    }
    public showURL()
    {
    }
    private presentToast(text) {
        this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        }).present();
    }
 
}