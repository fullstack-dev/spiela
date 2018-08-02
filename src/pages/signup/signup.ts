import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { PolicyPage } from '../home/policy';
import { TermsPage } from '../home/terms';
import { CommunityPage } from '../home/community';
import { AuthService } from '../../providers/auth-service';

import  firebase  from 'firebase';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  public loginPage: any;
  public username: string;
  public email: string;
  public password1: string;
  public password2: string;
  public accept = { checked: false };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authService: AuthService
  ) {
    this.loginPage = LoginPage
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
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
  // Alert popup
  showAlertSuccess(message) {
    let alert = this.alertCtrl.create({
      title: 'Successful Signup',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
  // Policy page modal
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
  // Validate email
  validateEmail(email: string) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  // Signup
  onSignupSubmit() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();
    // check if passwords match
    if (this.password1 !== this.password2) {
      loader.dismiss();
      this.showAlert('Passwords must be the same!');
      return
    }
    // check if username has white space
    if (this.username !== undefined && this.username.indexOf(' ') >= 0) {
      loader.dismiss();
      this.showAlert('Username can not contain white space!');
      return
    }
    // if any field is empty
    if (this.username === '' || this.username === undefined || this.password1 === '' || this.password1 === undefined || this.password2 === '' || this.password2 === undefined) {
      loader.dismiss();
      this.showAlert('Please all fields are required!');
      return
    }
    // Check email address
    if (!this.validateEmail(this.email)) {
      this.showAlert("Email address is invalid!");
      loader.dismiss();
      return
    }
    let loginCredentails = {
      _username: this.username,
      _password: this.password1,
      _email: this.email,
      _accept: this.accept
    }
    if (this.accept.checked == false) {
      this.showAlert('You have not accepted the terms');
      loader.dismiss();
      return;
    }
    this.authService.signup(loginCredentails).subscribe(
      data => {
        console.log('data', data);
        if (data.success) {
          if (!firebase.apps.length) {
          firebase.initializeApp({
            apiKey: "AIzaSyBJCqeQIYdD4brQTqcxrLkoxBcndbd18hs",
            authDomain: "cobalt-abacus-125119.firebaseapp.com",
            databaseURL: "https://cobalt-abacus-125119.firebaseio.com",
            projectId: "cobalt-abacus-125119",
            storageBucket: "cobalt-abacus-125119.appspot.com",
            messagingSenderId: "172797515074"
          }); }
          firebase.auth().createUserWithEmailAndPassword(loginCredentails._email, loginCredentails._password).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
          });
              
          

          loader.dismiss();
          this.showAlertSuccess('Welcome to Spiela! The social collaborative network. Go to your e-mail inbox (or junk folder) to verify your account and then you can log in.');
          this.navCtrl.push(LoginPage);
        } else {
          loader.dismiss();
          data.error = (data.error != '') ? data.error+". " : ''; 
          this.showAlert("Something went wrong! " + data.error + "Please try again.");
        }
      },
      (err) => {
        loader.dismiss();
        this.showAlert(err)
      }
    );
  }

}
