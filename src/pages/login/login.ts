import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { FeaturedRecipesPage } from '../featured-recipes/featured-recipes';
import { AddRecipePage } from '../add-recipe/add-recipe';
import { AuthService } from '../../providers/auth/auth-service';
import { Utils } from '../../providers/utils/utils';
import { GooglePlus } from '@ionic-native/google-plus';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  currentUser: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public angularFireAuth: AngularFireAuth, 
    public googleplus: GooglePlus, public platform: Platform, public auth : AuthService, 
    public loadingCtrl: LoadingController, public utils: Utils) {
      this.auth.activeUser.subscribe((_user)=>{
        this.currentUser = _user;
      });
  }

  ionViewDidLoad() {
    let loading = this.navParams.get('loading');
    if(loading != null){
      loading.dismiss();
    }else{
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      setTimeout(() => {
        loading.dismiss()
       }, 5000);
    }
  }

  loginGoogle() {
    if(this.platform.is('cordova')){
      this.nativeGoogleLogin();
    }else{
      this.webGoogleLogin();
    }
  }

  webGoogleLogin() {
    let currentUser = this.currentUser;
    let utils = this.utils;
    let navCtrl = this.navCtrl;
    let auth = this.auth;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    const provider = new firebase.auth.GoogleAuthProvider();
    this.angularFireAuth.auth.signInWithPopup(provider)
      .then(function (credential) {
        currentUser.uid = credential.user.uid;
        currentUser.email = credential.user.email;
        currentUser.name = credential.user.displayName;
        currentUser.photo = credential.user.photoURL;
        
        auth.doLogin(currentUser);
        navCtrl.setRoot(FeaturedRecipesPage, {'loading': loading}); 
    }, function (err) {
      loading.dismiss();
      utils.showMessage(err, 'error');
    });
  }

  nativeGoogleLogin() {
    let currentUser = this.currentUser;
    let utils = this.utils;
    let navCtrl = this.navCtrl;
    let auth = this.auth;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
     
    this.googleplus.login({
      'webClientId': '249520959531-h580q4omeu08opge66ivvpkm4kscuiq7.apps.googleusercontent.com'
    })
      .then( res => {
        const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
        firebase.auth().signInWithCredential(googleCredential)
          .then( userCredential => {
            currentUser.uid = userCredential.uid;
            currentUser.email = userCredential.email;
            currentUser.name = userCredential.displayName;
            currentUser.photo = userCredential.photoURL;
                  
            auth.doLogin(currentUser);
            navCtrl.setRoot(FeaturedRecipesPage, {'loading': loading}); 
      });
    }, err => {
      loading.dismiss();
      utils.showMessage(err, 'error');
    });
  }

  goToHome() {
    /*let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    
    this.navCtrl.setRoot(FeaturedRecipesPage, {'loading': loading});*/
    this.navCtrl.setRoot(AddRecipePage);
  }
}
