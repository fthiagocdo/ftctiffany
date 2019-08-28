import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class PreloaderProvider {

   private loading : any;

   constructor(public loadingCtrl : LoadingController) { }

   displayPreloader() : void {
      if(this.loading == null){
         this.loading = this.loadingCtrl.create({
            content: 'Por favor, aguarde...'
         });
   
         this.loading.present();
      }
   }

   hidePreloader() : void {
      if(this.loading != null){
         this.loading.dismiss();
         this.loading = null;
      }
   }

}