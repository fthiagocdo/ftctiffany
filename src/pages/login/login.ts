import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, ModalController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthService } from '../../providers/auth/auth-service';
import { Utils } from '../../providers/utils/utils';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { LoginMailPage } from '../login-mail/login-mail';
import { SignupPage } from '../signup/signup';
import { RecoverPasswordPage } from '../recover-password/recover-password';
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private currentUser: any;
  private isLoginMail: boolean = false;

  constructor(
    private NAVCTRL: NavController,  
    private ANGFIREAUTH: AngularFireAuth, 
    private GOOGLEPLUS: GooglePlus, 
    private FACEBOOK: Facebook,
    private PLATFORM: Platform,
    private AUTH : AuthService, 
    private UTILS: Utils, 
    private LOADER: PreloaderProvider,
    private MODALCTRL: ModalController,
    private DB: DatabaseProvider) {
      this.AUTH.activeUser.subscribe((_user)=>{
        this.currentUser = _user;
      });
  }

  ionViewDidLoad() {
    this.LOADER.hidePreloader();
   }

  loginGoogle() {
    this.isLoginMail = false;
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
        _class.NAVCTRL.setRoot(HomePage); 
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
            _class.NAVCTRL.setRoot(HomePage); 
      });
    }, err => {
      this.LOADER.hidePreloader();
      this.UTILS.showMessage(err.message, 'error');
    });
  }

  loginFacebook() {
    this.isLoginMail = false;
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
            _class.NAVCTRL.setRoot(HomePage);
      }, err => {
        this.LOADER.hidePreloader();
        this.UTILS.showMessage(err.message, 'error');
      });
    }, err => {
      this.LOADER.hidePreloader();
      this.UTILS.showMessage(err.message, 'error');
    });
  }

  openModalLogin() {
    let modalLogin = this.MODALCTRL.create(LoginMailPage, {
      showBackdrop: true, 
      enableBackdropDismiss: true
    });
    modalLogin.present();

    modalLogin.onDidDismiss(data => { 
      if(data && data.user) {
        this.currentUser.uid = data.user.uid;
        this.currentUser.email = data.user.email;
        this.currentUser.name = data.user.name;
        this.currentUser.photo = data.user.photo;

        this.AUTH.doLogin(this.currentUser);
        this.NAVCTRL.setRoot(HomePage);
      }
    });
  }

  openModalSignup() {
    let modalSignup = this.MODALCTRL.create(SignupPage, {
      showBackdrop: true, 
      enableBackdropDismiss: true
    });
    modalSignup.present();
  }

  openModalRecoverPassword() {
    let modalRecoverPassword = this.MODALCTRL.create(RecoverPasswordPage, {
      showBackdrop: true, 
      enableBackdropDismiss: true
    });
    modalRecoverPassword.present();
  }
}
