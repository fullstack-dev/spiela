import { Http } from '@angular/http';
import {
    AlertController,
    Loading,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    App,
    ToastController,
    PopoverController
} from 'ionic-angular';

import { Component } from '@angular/core';
import { AuthService } from "../../providers/auth-service";
import { CollaborationPage } from "../collaboration/collaboration";
import { RestService } from '../../providers/rest-service';
import { CameraService } from '../../providers/camera-service';
import { ReportPage } from '../shared-report-modal/report-modal';
import { MyCollaborationPage } from "../my-collaboration/my-collaboration";
import { Storage } from "@ionic/storage";
import { LoginPage } from '../login/login';
import { ProfileMenuComponent } from "../../components/profile-menu/profile-menu";
import { EditPicturePage } from "../editpicture/editpicture";
import { EditProfilePage } from "../editprofile/editprofile";
import { IntroPage } from '../intro/intro';
import { MyBookmarksPage } from "../../pages/my-bookmarks/my-bookmarks";
import { Support } from "../../providers/support";
import { PushNoti } from '../../providers/pushnoti';

@Component({
    selector: 'page-user',
    templateUrl: 'user.html'
})
export class UserPage {

    imageData: any;
    profileImg = '../assets/img/profile-image.png';
    user_supporting: any = 0;
    user_likes: any = 0;
    user_collaborations: any = 0;
    token: string = '';
    loading: Loading;
    activeTab: string = 'activity';
    user: any = {};
    profile = {
        activity: [],
        user: {}
    };
    myProfile = false;
    private error = '';
    blocked: any[] = [];
    supporting: any[] = [];
    supportingT: string = '';
    supporters: any[] = [];
    supportersT: string = '';
    userSaved: number = 0;
    supportEnabled: boolean = true;
    myownUserId: number;
    //userTokens: AngularFireList<any>;
    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private modalCtrl: ModalController,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        private auth: AuthService,
        private rest: RestService,
        private camService: CameraService,
        private storage: Storage,
        private app: App,
        private popoverCtrl: PopoverController,
        private supportService: Support,
        private pushnoti: PushNoti,
    ) { }
    
    ionViewWillEnter() {
        this.myownUserId = this.supportService.getUserID();
        
        

        if (this.navParams.data.savedData) {  
            this.userSaved = 1;
        }
        else { this.userSaved = 0; this.navParams.data.savedData = 0; }
        this.navParams.data.savedData = 0;
        if (this.navParams.data.userProfile) {  
           
            this.loadUser(this.navParams.data.userProfile);
            return;
        }  

        else if (this.navParams.data.userId) {  
            this.rest.loadUser(this.navParams.data.userId).subscribe(
                data => this.loadUser(data.user),
                err => console.log(err)
            );

            return;
        }
        else {   
            this.myProfile = true;
            this.loadUser(this.auth.userProfile);
             
        }
        // this.loadUser(null);
        
    }
    editProfile(user)
    {
        this.app.getActiveNav().push(EditProfilePage, { profile: user});
    }

    editPicture(user)
    {  
        if (user.username != this.auth.userProfile.username) return;
        this.app.getActiveNav().push(EditPicturePage, { profile: user });
        //this.navCtrl.push(EditPicturePage, { });
        
    }

    onChange() {
        this.rest.addUserType(this.user.personType)
            .subscribe();
    }
    presentPopover(ev) {
        //let collId = this.collId;
        //let username = this.username
        let popover = this.popoverCtrl.create(ProfileMenuComponent, {
            /*collaboration: collId,
            delCol: this.collaboration.user.username == username,
            hideCol: this.collaboration.user.username != username,
            reportCol: this.collaboration.user.username != username*/
        });
        popover.present({ ev });
        popover.onDidDismiss((action, id) => {
            /*switch (action) {
                case 'delCol':
                    this.deleteCol(collId);
                    break;
                case 'reportCol':
                    this.reportAPost(collId);
                    break;
                case 'hideCol':
                    this.hideCol(collId);
                    break;
                default:
                    console.log('unhandled action', action);
                    break;
            }*/
        });
    }
    gotoBookmarks(user)
    {
        this.app.getActiveNav().push(MyBookmarksPage, { user: user });
    }
    loadUser(userProfile) {
        // Set userProfile & Get UserDetail
       
        let supported = this.supportService.getSupporting(userProfile.id);
        if (supported.length != 0)
        {
            if (supported.indexOf(userProfile.id) >= 0)
            {  this.supportEnabled = false; }
        }

       
        
        if (userProfile) {
           
            this.user = userProfile;
            this.loadUserHiddenContent();//**** NOT SURE IF IT GOES HERE OR OUTSIDE userprofile
            this.loadUserDetails(this.user.id);
        } else {
            this.user = this.auth.userProfile;
           
           
            this.loadUserDetails(null);
        }
        
        // Set User info to profile page
        this.setUserProfile(this.user);
        if (isNaN(this.user.id) && this.myProfile)
        {
            this.user.id = this.supportService.getUserID();
        }
        //if (this.myProfile)
        {  
            this.loadSupporters(this.user.id);
            this.loadSupporting(this.user.id);
        }
        
    }

    setUserProfile(user) {
        // Set Avatar Image
        /*let picFil = user.user_image_thumb;
        if (typeof(picFil) != 'undefined') { picFil = picFil.substr(picFil.lastIndexOf('/') + 1); }
        else picFil = '';
        if (picFil.length == 0) { this.profileImg = "assets/img/profile-image.png"; }
        else this.profileImg = user.user_image_thumb;*/
        this.loadUserDetails(this.user.id);
        
        // Set SUPPORTING, LIKES AND COLLABORATIONS
        this.user_supporting = user.supporting;
        this.user_likes = user.likes;
        this.user_collaborations = user.collaborations;
        
    }
    getWebURL()
    {
        var s = this.user.website;
        var prefix = 'http://';
        if (!s.match(/^[a-zA-Z]+:\/\//)) { s = 'http://' + s; }
        return s;
    }
    getProfilePic(user)
    {
        let picFil = '';
        try 
        {
            picFil = user.userImage;
             
            if (picFil === null)
            {
                picFil = "assets/img/profile-image.png";
                return picFil;
            }
        } 
        catch(e)
        {
            alert('ERROR: ' + JSON.stringify(e));
            picFil = "assets/img/profile-image.png";
            return picFil;
        }
        let profileImg = '';
        if (typeof(picFil) != 'undefined') { picFil = picFil.substr(picFil.lastIndexOf('/') + 1); }
        else picFil = '';
        
        if (picFil.length == 0) { profileImg = "assets/img/profile-image.png"; }
        else profileImg = "http://spiela.co.uk/media/cache/avatar/uploads/"+ user.userImage;

        var img = new Image();
        img.src = profileImg;
            if (img.height != 0) 
            { 
            } 
            else { profileImg = "http://spiela.co.uk/media/cache/resolve/avatar/uploads/"+ user.userImage; }
        return profileImg;
    }
    loadUserDetails(userId) {
        const form = new FormData();
        form.append("data", "someValue or file");

        this.rest.loadUserProfile(userId).subscribe(data => {
            this.profile = data;
            this.user = this.profile.user;
            
            this.profileImg = this.auth.chooseProfilePic(this.user);
            
            var img = new Image();
           
            img.src = this.profileImg;
             
            if (img.height != 0) 
            { 
                this.profileImg = img.src;
            } 
            else 
            { 
                this.profileImg = this.getProfilePic(this.user);
            }


            if (this.navParams.data.savedPicture)
            {
               this.navParams.data.savedPicture = false;
            }
        }, err => {
            this.error = err;
            this.auth.reauth();
        });
    }

    loadUserHiddenContent() {   
        this.rest.getAllHidden().subscribe(
            data => this.blocked = data.json().data,
            err => this.error = err
        );
    }

    loadSupporters(userId) {
        this.rest.loadSupporters(userId).subscribe(data => {
            this.supporters = data.json().users;
            this.supportersT = data.json().title;
        }, err => this.error = err);
    }

    loadSupporting(userId) {
        this.rest.loadSupportings(userId).subscribe(data => {
            this.supporting = data.json().users;
            this.supportingT = data.json().title;
        }, err => this.error = err);
    }

    unblockItem(id) {
        this.rest.unblockItem(id).subscribe(
            data => this.loadUserHiddenContent(),
            err => {
                this.error = err;
                this.auth.reauth();
            }
        );
    }

    navigateColl(collId) {
        this.navCtrl.push(CollaborationPage, { collId });
    }

    navigateUser(userIdOrUsername) {  
        this.rest.loadUser(userIdOrUsername).subscribe(data => {
            var userProfile = data.user;
            
            this.navCtrl.push(UserPage, { userProfile });
        }, err => {
            this.error = err;
        });
    }

    support(id) {
        this.supportEnabled = false;
       //return;
        this.rest.supportItem(id).subscribe(res => {
            if (res.success == true) {
                this.supportService.loadSupporting(this.supportService.getUserID());
                this.alertCtrl.create({
                    title: 'Success',
                    subTitle: 'You Are Now Supporting This Person',
                    buttons: ['Dismiss']
                }).present();
            }
        }, err => this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Something wrong!',
            buttons: ['Dismiss']
        }).present());
    }

    navigateTomyCol() {
        this.navCtrl.setRoot(MyCollaborationPage, {});
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
                this.rest.loadUser(this.user.id).subscribe(
                    data => {
                        this.user = data.user;
                        this.auth.userProfile = this.user;
                        this.setUserProfile(this.user);
                    }, err => console.log(err)
                );

                this.presentToast('Image uploaded successful.')
            });
        });
    }

    private presentToast(text) {
        this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        }).present();
    }

    reportAPost(user_id) {
        let params = { type: 'user', id: user_id };
        this.modalCtrl
            .create(ReportPage, { params })
            .present();
    }

    blockUser(user_id) {
        if (this.supportService.getUserID() == user_id)
        {
            this.alertCtrl.create({
                title: 'ERROR',
                message: 'You cannot block yourself',
                buttons: [
                    {
                        text: 'Dismiss',
                        role: 'cancel',
                    } ] }
            ).present();
        }
        else 
        {
            this.alertCtrl.create({
                title: 'Confirm blocking',
                message: 'Are you sure you want to block this user?',
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            this.rest.blockUser(user_id).subscribe(data => {
                                let res = data.json();
                                if (res.success == true) {
                                    this.alertCtrl.create({
                                        title: 'Success',
                                        subTitle: 'Your request has been submitted successfully',
                                        buttons: ['Dismiss']
                                    }).present();
                                }
                            }, err => {
                                console.log(err);
                                this.alertCtrl.create({
                                    title: 'Error',
                                    subTitle: 'Something wrong!',
                                    buttons: ['Dismiss']
                                }).present();
                            });
                        }
                    }
                ]
            }).present();
       }
    }
    // logout
    logout() {
        this.supportService.resetUserId();
        this.navParams.data = '';
        this.auth.userProfile = '';
        this.pushnoti.resetFinalToken();
        let loader = this.loadingCtrl.create({
            content: "Logging out...",
        });
        loader.present();
        this.storage.remove('id_token').then(() => {
            localStorage.removeItem('token');
            setTimeout(() => {
                loader.dismiss();
            }, 1000);
            this.app.getRootNav().setRoot(LoginPage);
        });
    }
    gotoIntro()
    {
        //WARNING: use setRoot instead of PUSH, or other links won't work later
        this.app.getRootNav().setRoot(IntroPage);
    }
}
