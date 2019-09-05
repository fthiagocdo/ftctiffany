import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Utils } from '../../providers/utils/utils';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { DatabaseProvider } from '../../providers/database/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-login-mail',
  templateUrl: 'login-mail.html',
})
export class LoginMailPage {
  private email: string = "";
  private password: string = "";
  private isResendEmailValidation: boolean = false;

  constructor(
    public NAVCTRL: NavController, 
    public NAVPARAMS: NavParams, 
    public RENDERER: Renderer, 
    public VIEWCTRL: ViewController,
    public UTILS: Utils,
    private LOADER: PreloaderProvider,
    private DB: DatabaseProvider,
    private ANGFIREAUTH: AngularFireAuth) {
    this.RENDERER.setElementClass(VIEWCTRL.pageRef().nativeElement, 'my-popup', true);
  }

  confirm() {
    if(this.validateData()){
      this.login(this.email, this.password);
    }
  }

  validateData() {
    let valid = true;
    if(this.email == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Email' deve ser preenchido.", 'error');
    }else if(this.password == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Senha' deve ser preenchido.", 'error');
    }

    return valid;
  }

  login(email, password) {
    this.LOADER.displayPreloader();
    let _class = this;
    
    //Signs in firebase
    this.ANGFIREAUTH.auth.signInWithEmailAndPassword(email, password)
      .then(credential => {
        if(credential.emailVerified){
          //Retrieves the user in the api
          _class.DB.getUser(credential.uid)
            .then(success => {
              _class.VIEWCTRL.dismiss({ user: success });
            }, err => {
              console.log(err);
              _class.UTILS.showMessage('Não foi possível completar a requisição. Por favor, tente novamente mais tarde...', 'error');
              _class.LOADER.hidePreloader();
            });
        }else{
          _class.isResendEmailValidation = true;
          _class.LOADER.hidePreloader();
        }
    }, err => {
      console.log(err);
      _class.UTILS.showMessage(err.message, 'error');
      _class.LOADER.hidePreloader();
    });
  }

  resendEmailValidation() {
    this.LOADER.displayPreloader();
    let _class = this;

    firebase.auth().currentUser.sendEmailVerification()
      .then(success => {
        _class.VIEWCTRL.dismiss();
        _class.UTILS.showMessage('Enviamos um email de validação para o endereço cadastrado. Por favor, acesse sua caixa de emails e clique no link para validação.', 'info');
        _class.LOADER.hidePreloader();
      }, err => {
        console.log(err);
        _class.UTILS.showMessage(err.message, 'error');
        _class.LOADER.hidePreloader();
      }); 
  }

}
