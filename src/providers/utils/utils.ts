import { AlertController } from "ionic-angular";
import { Injectable } from "@angular/core";

@Injectable()
export class Utils {
    constructor(public alertCtrl: AlertController) { }

    showMessage(message, messageType?) {
        if(message != null){
          if(messageType == 'error'){
            let alert = this.alertCtrl.create(  {
              title: 'Error:',
              message: message,
              buttons: [{
                text: 'Ok',
                cssClass: 'ftc-error-color'
              }],
              cssClass: 'ftc-error-color'
            });
            alert.present();
          }else{
            let alert = this.alertCtrl.create({
              title: 'Message:',
              message: message,
              buttons: [{
                text: 'Ok',
                cssClass: 'ftc-info-color'
              }],
              cssClass: 'ftc-info-color'
            });
            alert.present();
          }
        }
    }

    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    isEmpty(value){
      if(value == null || value == 'null' || value == '' || value == ""){
        return true;
      }else{
        return false;
      }
    }
}