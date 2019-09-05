import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Utils } from '../../providers/utils/utils';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { DatabaseProvider } from '../../providers/database/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  private name: string = "";
  private email: string = "";
  private password: string = "";
  private confirmPassword: string = "";

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
      this.signup(this.name, this.email, this.password);
    }
  }

  validateData() {
    let valid = true;
    if(this.name == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Nome' deve ser preenchido.", 'error');
    }else if(this.email == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Email' deve ser preenchido.", 'error');
    }else if(this.password == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Senha' deve ser preenchido.", 'error');
    }else if(this.confirmPassword == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Confirmar Senha' deve ser preenchido.", 'error');
    }else if(this.password.length < 8){
      valid = false;
      this.UTILS.showMessage("A senha deve ter, no mínimo, 8 caracteres.", 'error');
    }else if(this.password != this.confirmPassword) {
      valid = false;
      this.UTILS.showMessage("Senha e Confirmar senha não correspondem.", 'error');
    }

    return valid;
  }

  signup(name, email, password) {
    this.LOADER.displayPreloader();
    let _class = this;
    
    //signs up the user in firebase
    this.ANGFIREAUTH.auth.createUserWithEmailAndPassword(email, password)
      .then(credential => {
        //Signs up in the api
        _class.DB.addUser(email, name, "/assets/imgs/user.png", credential.uid)
          .then(success => {
            firebase.auth().currentUser.sendEmailVerification()
              .then(success => {
                _class.UTILS.showMessage('Enviamos um email de validação para o endereço cadastrado. Por favor, acesse sua caixa de emails e clique no link para validação.', 'info');
                _class.VIEWCTRL.dismiss({ success: true });
              }, err => {
                console.log(err);
                _class.UTILS.showMessage(err.message, 'error');
                _class.LOADER.hidePreloader();
              }); 
          }, err => {
            console.log(err);
            _class.UTILS.showMessage('Não foi possível completar a requisição. Por favor, tente novamente mais tarde...', 'error');
            _class.LOADER.hidePreloader();
          });
    }, err => {
      console.log(err);
      _class.UTILS.showMessage(err.message, 'error');
      _class.LOADER.hidePreloader();
    }); 
  }

}
