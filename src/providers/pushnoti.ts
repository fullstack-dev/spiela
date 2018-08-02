import { Injectable } from '@angular/core';
import  firebase  from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { FCM } from '@ionic-native/fcm';

@Injectable()
export class PushNoti 
{
    _password: string = '';
    finalToken: string = '';
    storageTime: number = 0;
    constructor(
        private afDatabase: AngularFireDatabase,
        private fcmx: FCM
   ) {  }
   setPassword(password)
    {
        this._password = password; 
    }
   initFirebase()
   {
        firebase.initializeApp({
            apiKey: "AIzaSyBJCqeQIYdD4brQTqcxrLkoxBcndbd18hs",
            authDomain: "cobalt-abacus-125119.firebaseapp.com",
            databaseURL: "https://cobalt-abacus-125119.firebaseio.com",
            projectId: "cobalt-abacus-125119",
            storageBucket: "cobalt-abacus-125119.appspot.com",
            messagingSenderId: "172797515074"
        });
   }
   loadUser(userProfile)
   {
        if (!firebase.apps.length) { this.initFirebase(); }
        
        let userIDprofileEmail = userProfile.email;
        this.loadFirebaseToken(userProfile.username);
        let userIDpassword = this._password;
        if (userIDpassword.length != 0)
        {
            firebase.auth().signInWithEmailAndPassword(userProfile.email, this._password).catch(function(error) {
                var errorCode = error.code;
                if (errorCode && userIDpassword.length != 0)
                {//create it automatically
                    firebase.auth().createUserWithEmailAndPassword(userIDprofileEmail, userIDpassword).catch(function(error) 
                    {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                    });
                }
                var errorMessage = error.message;
                console.log(error.message);
            });
        }
   }
   resetFinalToken()
   {
      this.finalToken = '';
   }
   getFinalToken()
   {
      if ( (Math.floor(Date.now() / 1000) - this.storageTime) > 3600) 
      { 
          this.resetFinalToken(); 
          return ''; 
      }
      else return this.finalToken;
   }
   loadFirebaseToken(username)
    {
        username = username.toLowerCase();//firebase databases are case sensitive
        var items_1 = this.afDatabase.list('/userTokens', 
        ref => { let q = ref.orderByChild('username').equalTo(username); return q; } );//valueChanges();
        const listObservable = items_1.snapshotChanges();
        this.storageTime = Math.floor(Date.now() / 1000);
        listObservable.subscribe(items => {
           try{
                const data =  items[0].payload.val();
                if (typeof(data.token) != 'undefined')  
                { 
                    this.fcmx.getToken().then(token=>{ //get the new token
                        console.log("The Token is: " + token);
                         this.finalToken = token;
                         let bla = { username: username, token: token };
                         items_1.update(items[0].key, bla);//update the token
                      });
                    
                    
                }
            }
            catch(e){
                var items2 = this.afDatabase.list('/userTokens');

                this.fcmx.getToken().then(token=>{
                    console.log("The Token is: " + token);
                    let bla = { username: username, token: token };
                    items2.push(bla)
                  });

              
                
            }
            //return items; 
        });
       /* */
    }
}