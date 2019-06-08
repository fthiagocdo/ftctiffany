import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, ModalController } from 'ionic-angular';
import { ImageProvider } from '../../providers/image/image';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { DatabaseProvider } from '../../providers/database/database';
import * as firebase from 'firebase';
import 'rxjs/Rx';

@IonicPage()
@Component({
  selector: 'page-add-recipe',
  templateUrl: 'add-recipe.html',
})
export class AddRecipePage {
   private auth     : any;
   public movies    : any;
   private email    : string = 'ftcdevsolutions@gmail.com';
   private pass     : string = '34D&WDco%T';


   constructor( public navCtrl       : NavController,
                private platform     : Platform,
                private modalCtrl    : ModalController,
                private _IMG         : ImageProvider,
                private _LOADER      : PreloaderProvider,
                private _DB          : DatabaseProvider)
   {
   }


   ionViewDidEnter()
   {
      this._LOADER.displayPreloader();
      this.platform.ready()
      .then(() =>
      {
         /*firebase.auth().signInWithEmailAndPassword(this.email, this.pass)
         .then((credentials) =>
         {*/
            this.loadAndParseMovies();
         /*})
         .catch((err : Error) =>
         {
            console.log(err.message);
         });*/
      });
   }


   loadAndParseMovies()
   {
      this.movies = this._DB.renderMovies();
      this._LOADER.hidePreloader();
   }


   addRecord()
   {
      let modal = this.modalCtrl.create('Modals');
      modal.onDidDismiss((data) =>
      {
         if(data)
         {
            this.loadAndParseMovies();
         }
      });
      modal.present();
   }


   editMovie(movie)
   {
      let params = { movie: movie, isEdited: true },
          modal  = this.modalCtrl.create('Modals', params);

      modal.onDidDismiss((data) =>
      {
         if(data)
         {
            this.loadAndParseMovies();
         }
      });
      modal.present();
   }



   deleteMovie(movie)
   {
      this._DB.deleteMovie(movie.id)
      .then((data) =>
      {
         this.loadAndParseMovies();
      });
   }


}