import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Utils } from '../../providers/utils/utils';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-recover-password',
  templateUrl: 'recover-password.html',
})
export class RecoverPasswordPage {
  private email: string = "";

  constructor(
    public NAVCTRL: NavController, 
    public NAVPARAMS: NavParams, 
    public RENDERER: Renderer, 
    public VIEWCTRL: ViewController,
    public UTILS: Utils,
    private LOADER: PreloaderProvider,
    private ANGFIREAUTH: AngularFireAuth) {
    this.RENDERER.setElementClass(VIEWCTRL.pageRef().nativeElement, 'my-popup', true);
  }

  recoverPassword() {
    if(this.validateData()){
      this.sendRecoverPasswordEmail(this.email);
    }
  }

  validateData() {
    let valid = true;
    if(this.email == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Email' deve ser preenchido.", 'error');
    }

    return valid;
  }

  sendRecoverPasswordEmail(email) {
    this.LOADER.displayPreloader();
    let _class = this;
    
    //Signs in firebase
    this.ANGFIREAUTH.auth.sendPasswordResetEmail(email)
      .then(success => {
        _class.VIEWCTRL.dismiss({ success: true });
        this.UTILS.showMessage("Por favor, verifique sua caixa de emails e clique no link para escolher uma nova senha.");
        _class.LOADER.hidePreloader();
    }, err => {
      console.log(err);
      _class.UTILS.showMessage(err.message, 'error');
      _class.LOADER.hidePreloader();
    });
  }

}

