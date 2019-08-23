import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { FeaturedRecipesPage } from '../featured-recipes/featured-recipes';
import { AuthService } from '../../providers/auth/auth-service';
import { Utils } from '../../providers/utils/utils';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { PreloaderProvider } from '../../providers/preloader/preloader';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private currentUser: any;

  constructor(
    private NAVCTRL: NavController,  
    private ANGFIREAUTH: AngularFireAuth, 
    private GOOGLEPLUS: GooglePlus, 
    private FACEBOOK: Facebook,
    private PLATFORM: Platform,
    private AUTH : AuthService, 
    private UTILS: Utils, 
    private LOADER: PreloaderProvider) {
      this.AUTH.activeUser.subscribe((_user)=>{
        this.currentUser = _user;
      });
  }

  ionViewDidLoad() {
    this.LOADER.hidePreloader();
   }

  loginGoogle() {
    this.LOADER.displayPreloader();

    if(this.PLATFORM.is('cordova')){
      this.nativeGoogleLogin();
    }else{
      this.webGoogleLogin();
    }
  }

  webGoogleLogin() {
    let _class = this;

    const provider = new firebase.auth.GoogleAuthProvider();
    this.ANGFIREAUTH.auth.signInWithPopup(provider)
      .then(function (credential) {
        _class.currentUser.uid = credential.user.uid;
        _class.currentUser.email = credential.user.email;
        _class.currentUser.name = credential.user.displayName;
        _class.currentUser.photo = credential.user.photoURL;
        
        _class.AUTH.doLogin(_class.currentUser);
        _class.NAVCTRL.setRoot(FeaturedRecipesPage); 
    }, function (err) {
      this.LOADER.hidePreloader();
      this.utils.showMessage(err.message, 'error');
    });
  }

  nativeGoogleLogin() {
    let _class = this;

    this.GOOGLEPLUS.login({
      'webClientId': '249520959531-h580q4omeu08opge66ivvpkm4kscuiq7.apps.googleusercontent.com'
    })
      .then( res => {
        const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
        firebase.auth().signInWithCredential(googleCredential)
          .then( userCredential => {
            _class.currentUser.uid = userCredential.uid;
            _class.currentUser.email = userCredential.email;
            _class.currentUser.name = userCredential.displayName;
            _class.currentUser.photo = userCredential.photoURL;
                  
            _class.AUTH.doLogin(_class.currentUser);
            _class.NAVCTRL.setRoot(FeaturedRecipesPage); 
      });
    }, err => {
      this.LOADER.hidePreloader();
      this.UTILS.showMessage(err.message, 'error');
    });
  }

  loginFacebook() {
    this.LOADER.displayPreloader();
    let _class = this;
    
    this.FACEBOOK.login(['email'])
      .then( res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(res.authResponse.accessToken);
        firebase.auth().signInWithCredential(facebookCredential)
          .then( user => { 
            _class.currentUser.uid = user.uid;
            _class.currentUser.email = user.email;
            _class.currentUser.name = user.displayName;
            _class.currentUser.photo = user.photoURL+'?height=256&width=256';

            _class.AUTH.doLogin(_class.currentUser);
            _class.NAVCTRL.setRoot(FeaturedRecipesPage);
      }, err => {
        this.LOADER.hidePreloader();
        this.UTILS.showMessage(err.message, 'error');
      });
    }, err => {
      this.LOADER.hidePreloader();
      this.UTILS.showMessage(err.message, 'error');
    });
  }
}
