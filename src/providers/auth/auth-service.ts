import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireAuth } from 'angularfire2/auth';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthService {
  activeUser = new BehaviorSubject({ 
    isLogged: false,
    uid: "",
    name: "",
    email: "",
    photo: "",
  });

  constructor(public angularFireAuth: AngularFireAuth, public googleplus: GooglePlus, public platform: Platform) { }

  doLogin(user) {
    this.activeUser.next({ 
      isLogged: true,
      uid: user.uid,
      name: user.name,
      email: user.email,
      photo: user.photo,
    });
  }

  doLogout() {
    this.activeUser.next({ 
      isLogged: false,
      uid: "",
      name: "",
      email: "",
      photo: "",
     });

    this.angularFireAuth.auth.signOut();
    if(this.platform.is('cordova')){
      this.googleplus.logout();
    }
  }

}
