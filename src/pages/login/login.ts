import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, App} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { PushNoti } from '../../providers/pushnoti';
import { Storage } from '@ionic/storage';
import { IntroPage } from '../intro/intro';
import { RestService } from "../../providers/rest-service";
import { Support } from "../../providers/support";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginCredentials = {
    _username: localStorage.getItem('saveUSername') || '',
    _password: ''
  };
  public signupPage;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    private pushnoti: PushNoti,
    private storage : Storage,
    private app :  App,
    private rest : RestService,
    private supportService : Support
  ) {
    this.signupPage = SignupPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  // Alert popup
  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  // Login
  onSubmitLogin() {
    this.pushnoti.resetFinalToken();
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();
    if (this.loginCredentials._username === undefined || this.loginCredentials._password === undefined || this.loginCredentials._username == '' || this.loginCredentials._password == '') {
      this.showAlert("Please all fields are required!");
      loader.dismiss();
      return
    } else {
      console.log(this.loginCredentials);
      this.authService.login(this.loginCredentials).subscribe((res) => {
        if (res) {
          this.authService.authSuccess(res.token);
          localStorage.setItem('saveUSername', this.loginCredentials._username);
          this.pushnoti.setPassword(this.loginCredentials._password);
          loader.dismiss();

          this.storage.ready()
          {
              this.storage.get('firstTimeApp').then((val) => { 
                  if (val != 1) 
                  {  
                      this.app.getRootNav().push(IntroPage);
                      this.storage.set('firstTimeApp', '1');
                  }
              else {
                //***************************************************  
                this.rest.loadUserProfile('').subscribe(data => {
                  if (data.user)
                  {
                      this.supportService.storeUsername(data.user.username);
                      this.authService.loadUser(data.user.username); 
                      this.authService.reauth();
                        
                  }
  
              }, err => {
              });
              //***********************************************  
                this.navCtrl.setRoot(TabsPage);  /* this.storage.clear();*/  }
              });
          }

          
        }
      }, (err) => {
        this.showAlert("Failed to login, wrong username or password!");
        loader.dismiss();
        return
      })
    }
  }

}
