import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, AlertController} from 'ionic-angular';
import {AuthService} from "../../providers/auth-service";
import {AuthHttp} from "angular2-jwt";

/*
  Generated class for the Report page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-report',
    templateUrl: 'report-modal.html'
})
export class ReportPage {
    params: any;
    private id: number;
    public type: string;
    name = '';
    description = '';
    email = '';

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController = null,
                public http: AuthHttp, public auth: AuthService, private alertCtrl: AlertController) {
        this.params = navParams.get('params');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad report-modal');
        console.log("the parameter are ", this.params.id);
    }

    sendReport() {
        this.id = this.params.id;
        this.type = this.params.type;


        if (this.name == '') {
            let alert = this.alertCtrl.create({
                title: 'Required Name',
                subTitle: 'Can you please enter your name',
                buttons: ['Dismiss']
            });
            alert.present();
            return false;
        }
        if (this.email == '') {
            let alert = this.alertCtrl.create({
                title: 'Required Email',
                subTitle: 'Can you please enter your email',
                buttons: ['Dismiss']
            });
            alert.present();
            return false;
        }
        if (this.description == '') {
            let alert = this.alertCtrl.create({
                title: 'Required Report',
                subTitle: 'Can you please enter report',
                buttons: ['Dismiss']
            });
            alert.present();
        }

        this.http.post(this.auth.API_URL + 'report', {
            id: this.id, type: this.type, name: this.name,
            email: this.email, description: this.description
        }).subscribe(
            data => {
                let res = data.json();
                if (res.success == true) {
                    let alert = this.alertCtrl.create({
                        title: 'Success',
                        subTitle: 'Your request has been submitted successfully',
                        buttons: ['Dismiss']
                    });
                    alert.present();
                    this.viewCtrl.dismiss();
                }
            }, err => {
                let alert = this.alertCtrl.create({
                    title: 'Error',
                    subTitle: 'Something wrong!',
                    buttons: ['Dismiss']
                });
                alert.present();
            }
        );
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
