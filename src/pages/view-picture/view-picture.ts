import { Component } from '@angular/core';
import {  NavParams } from 'ionic-angular';

//import { CameraService } from '../../providers/camera-service';
import { RestService } from '../../providers/rest-service';
/*import { AuthService } from "../../providers/auth-service";
import { UserPage } from "../user/user";
import { EditPicturePage } from "../editpicture/editpicture";*/
import { Collaboration } from "../collaboration";


@Component({
    selector: 'view-picture',
    templateUrl: 'view-picture.html'
})
export class ViewPicturePage {
    collaboration: any; //Collaboration = new Collaboration("");
    user: any = {};
    username: string = '';
    email: string = '';  
    bio: string = '';
    profileImg: string = '';
    website: string = '';
    fullname: string = '';
    error: string = '';
    constructor(private navParams : NavParams, 
        private rest : RestService
       )
    {
        var collId = navParams.data.id;
        this.loadCollaboration(collId);
    }
    loadCollaboration(collId) {
        
        this.rest.loadCollibration(collId).subscribe(
            data => {
                console.log(JSON.stringify(data));
                this.collaboration = data.json();
                try {
                   //this.profileImg =  this.collaboration.spiels[0].image_url;
                   var img = new Image();
                   this.profileImg =  "https://spiela.co.uk/media/cache/collab_wide/uploads/post/"+this.collaboration.spiels[0].image;
                   img.src = this.profileImg;
                   if (img.height != 0) { } 
                   else this.profileImg =  this.collaboration.spiels[0].image_url;
                }
                catch(e) { return; }
                }, err => { this.error = err; }
        );
    }
}