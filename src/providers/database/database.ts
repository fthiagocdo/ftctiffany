import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import * as firebase from 'firebase';

@Injectable()
export class DatabaseProvider {

   constructor() { }

   renderMovies() : Observable<any> {
      return new Observable(observer => {
         let films : any = [];
         firebase.database().ref('films').orderByKey().once('value', (items : any) => {
            items.forEach((item) => {
               films.push({
	              id        : item.key,
	              actors    : item.val().actors,
	              date      : item.val().date,
	              duration  : item.val().duration,
	              genres    : item.val().genres,
	              image     : item.val().image,
	              rating    : item.val().rating,
	              summary   : item.val().summary,
	              title     : item.val().title
	           });
            });

            observer.next(films);
            observer.complete();
         }, (error) => {
            console.log("Observer error: ", error);
            console.dir(error);
            observer.error(error)
         });
      });
   }

   deleteMovie(id) : Promise<any> {
      return new Promise((resolve) => {
         let ref = firebase.database().ref('films').child(id);
         ref.remove();
         resolve(true);
      });
   }

   addToDatabase(movieObj) : Promise<any> {
      return new Promise((resolve) => {
         let addRef = firebase.database().ref('films');
         addRef.push(movieObj);
         resolve(true);
      });
   }

   updateDatabase(id, moviesObj) : Promise<any> {
      return new Promise((resolve) => {
         var updateRef = firebase.database().ref('films').child(id);
	      updateRef.update(moviesObj);
         resolve(true);
      });
   }

   uploadImage(imageString) : Promise<any> {
      let image: string  = 'movie-' + new Date().getTime() + '.jpg',
          storageRef: any,
          parseUpload: any;

      return new Promise((resolve, reject) => {
         storageRef       = firebase.storage().ref('posters/' + image);
         parseUpload      = storageRef.putString(imageString, 'data_url');

         parseUpload.on('state_changed', (_snapshot) => {
            // We could log the progress here IF necessary
            // console.log('snapshot progess ' + _snapshot);
         }, (_err) => {
            reject(_err);
         }, (success) => {
            resolve(parseUpload.snapshot);
         });
      });
   }

}