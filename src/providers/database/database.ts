import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Utils } from '../utils/utils';
import * as _ from 'lodash';

@Injectable()
export class DatabaseProvider {
   
   constructor(
      private UTILS: Utils,
   ) { }

   getRecipes() : Promise<any> {
      return new Promise((resolve, reject) => {
         firebase.firestore().collection('recipes').get()
            .then( success => {
               let recipes : any = [];

               success.forEach((item) => {
                  recipes.push(this.getFieldsRecipe(item));
               });

               resolve(recipes);
         }, err => {
            reject(err);
            console.log("Promise error: ", err);
            console.dir(err);
         });
      });
   }

   getRecipe(recipeId) : Promise<any> {
      return new Promise((resolve, reject) => {
         firebase.firestore().collection('recipes').doc(recipeId).get()
            .then( success => {
               if (success.exists) {
                  resolve(this.getFieldsRecipe(success));
               } else {
                  resolve({});
               }
         }, err => {
            reject(err);
            console.log("Promise error: ", err);
            console.dir(err);
         });
      });
   }

   addRecipe(recipe, userUid) : Promise<any> {
      return new Promise((resolve, reject) => {
         recipe.timestamp = firebase.firestore.FieldValue.serverTimestamp();
         recipe.recipeDurationInMinutes = this.UTILS.getFieldTimeInMinutes(recipe.recipeDuration.split(' '));
         recipe.favoriteCount = 0;
         
         firebase.firestore().collection('recipes')
            .add(recipe)
               .then(success => {
                  let recipeId = success.id;
                  resolve(recipeId);
                  this.addMyRecipes(recipeId, userUid)
                     .then(success => {
                        this.createIndex(recipe.name, recipeId);
                        recipe.ingredients.forEach(ingredient => {
                           this.createIndex(ingredient, recipeId);
                        });
                        recipe.categories.forEach(category => {
                           this.createIndex(category, recipeId);
                        });
                        resolve(recipeId);
                     }, err => {
                        reject(err);
                        console.log("Promise error: ", err);
                        console.dir(err);
                     });
               }, err => {
                  reject(err);
                  console.log("Promise error: ", err);
                  console.dir(err);
               });
      });
   }

   updateRecipe(recipe, oldRecipe) : Promise<any> {
      return new Promise((resolve, reject) => {
         recipe.timestamp = firebase.firestore.FieldValue.serverTimestamp();
         recipe.recipeDurationInMinutes = this.UTILS.getFieldTimeInMinutes(recipe.recipeDuration.split(' '));

         let promises = [];
         promises.push(this.removeIndex(oldRecipe.name, oldRecipe.id));
         oldRecipe.ingredients.forEach(ingredient => {
            promises.push(this.removeIndex(ingredient, oldRecipe.id));
         });
         oldRecipe.categories.forEach(category => {
            promises.push(this.removeIndex(category, oldRecipe.id));
         });

         Promise.all(promises)
            .then(success => {
               firebase.firestore().collection('recipes').doc(recipe.id)
                  .update(recipe)
                     .then(success => {
                        this.createIndex(recipe.name, recipe.id);
                        recipe.ingredients.forEach(ingredient => {
                           this.createIndex(ingredient, recipe.id);
                        });
                        recipe.categories.forEach(category => {
                           this.createIndex(category, recipe.id);
                        });
                        resolve(true);
                     }, err => {
                        reject(err);
                        console.log("Promise error: ", err);
                        console.dir(err);
                     });
            }, err => {
               reject(err);
               console.log("Promise error: ", err);
               console.dir(err);
            });
      });
   }

   searchRecipesByIndex(index) : Promise<any[]> {
      return new Promise((resolve, reject) => {
         let promises = [];
         let listKeys = index.replace(/\n/g, ' ').split(' ');
         listKeys.forEach(key => {
            promises.push(this.searchRecipesByKey(key));
         });

         Promise.all(promises)
            .then(success => {
               let result = _.intersectionBy(...success, 'recipeId');
               
               promises = [];
               result.forEach((item) => {
                  promises.push(this.getRecipe(item.recipeId));
               });

               let recipes = [];
               Promise.all(promises)
                  .then(success => {
                     success.forEach(item => {
                        recipes.push(item);
                     });

                     resolve(recipes);
                  }, err => {
                     reject(err);
                     console.log("Promise error: ", err);
                     console.dir(err);
                  });
               
            }, err => {
               reject(err);
               console.log("Promise error: ", err);
               console.dir(err);
            });
      });
   }

   private searchRecipesByKey(key) : Promise<any[]> {
      return new Promise((resolve, reject) => {
         let promiseWithoutS = firebase.firestore().collection('indexes').doc(key.toUpperCase()).collection('recipes').get();
         let promiseWithS = firebase.firestore().collection('indexes').doc((key+'s').toUpperCase()).collection('recipes').get();
         
         Promise.all([promiseWithoutS, promiseWithS])
            .then(success => {
               let success0 = [];
               success[0].forEach((item) => {
                  success0.push(item.data());
               });
               let success1 = [];
               success[1].forEach((item) => {
                  success1.push(item.data());
               });

               resolve( _.unionBy(success0, success1, 'recipeId'));
            }, err => {
               reject(err);
               console.log("Promise error: ", err);
               console.dir(err);
            });
      });
   }

   searchRecipesByDuration(durationInMinutes) : Promise<any[]> {
      return new Promise((resolve, reject) => {
         firebase.firestore().collection('recipes')
            .where('recipeDurationInMinutes', '<=', this.UTILS.getFieldTimeInMinutes(durationInMinutes.split(' ')))
            .get()
               .then(success => {
                  let recipes : any = [];

                  success.forEach((item) => {
                     recipes.push(this.getFieldsRecipe(item));
                  });

                  resolve(recipes);
               }, err => {
                  reject(err);
                  console.log("Promise error: ", err);
                  console.dir(err);
               });
      });
   }

   searchRecipesByPre() : Promise<any[]> {
      return new Promise((resolve, reject) => {
         firebase.firestore().collection('recipes')
            .where('pre', '==', true)
            .get()
               .then(success => {
                  let recipes : any = [];

                  success.forEach((item) => {
                     recipes.push(this.getFieldsRecipe(item));
                  });

                  resolve(recipes);
               }, err => {
                  reject(err);
                  console.log("Promise error: ", err);
                  console.dir(err);
               });
      });
   }

   private getFieldsRecipe(item) : {} {
      return {
         id: item.id,
         photo: item.data().photo == null ? '/assets/imgs/recipe.jpg' : item.data().photo,
         name: item.data().name,
         description: item.data().description ? item.data().description : null,
         pre: item.data().pre,
         recipeDuration: item.data().recipeDuration,
         recipeInstructions: item.data().recipeInstructions,
         ingredients: this.UTILS.buildListIngredients(item.data().ingredients),
         portions: item.data().portions,
         categories: this.UTILS.buildListCategories(item.data().categories),
         favoriteCount: item.data().favoriteCount,
      };
   }

   createIndex(string, recipeId) {
      let stringList = string.split(' ');
      stringList.forEach(key => {
         if(this.isValidIndex(key)) {
            firebase.firestore().collection('indexes').doc(key.toUpperCase()).collection('recipes').doc(recipeId)
               .set({
                  recipeId: recipeId,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp()
               });
            firebase.firestore().collection('indexes').doc((key+'s').toUpperCase()).collection('recipes').doc(recipeId)
               .set({
                  recipeId: recipeId,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp()
               });
         }
      });
   }

   removeIndex(string, recipeId) {
      let stringList = string.split(' ');
      stringList.forEach(key => {
         if(this.isValidIndex(key)) {
            firebase.firestore().collection('indexes').doc(key.toUpperCase()).collection('recipes').doc(recipeId).delete();
            firebase.firestore().collection('indexes').doc(key+'s').collection('recipes').doc(recipeId).delete();
         }
      });
   }

   private isValidIndex(index) {
      if(!this.UTILS.isEmpty(index) &&
         index.length > 2 &&
         index.indexOf('/') < 0) {
            return true;
      }

      return false;
   }

   uploadImage(imageString) : Promise<any> {
      let image: string  = 'recipe-' + new Date().getTime() + '.jpg',
          storageRef: any,
          parseUpload: any;

      return new Promise((resolve, reject) => {
         storageRef = firebase.storage().ref('recipes/' + image);
         parseUpload = storageRef.putString(imageString, 'data_url');

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

   getFavoriteRecipes(userUid) : Promise<any[]> {
      return new Promise((resolve, reject) => {
         firebase.firestore().collection('users').doc(userUid).collection('favoriteRecipes').orderBy('timestamp', 'desc').get()
            .then(success => {
               let favoriteRecipes : any[] = [];

               success.forEach((item) => {
                  favoriteRecipes.push({
                     id: item.id,
                     recipeId: item.data().recipeId
                  });
               });
               resolve(favoriteRecipes);
            }, err => {
               reject(err);
               console.log("Promise error: ", err);
               console.dir(err);
            });
      });
   }

   deleteFromFavorites(userUid, favoriteId) : Promise<any> {
      return new Promise((resolve, reject) => {
         /*let favoriteCount = recipe.favoriteCount;
         recipe.favoriteCount -= 1;*/
         //let updateRecipePromise = firebase.firestore().collection('recipes').doc(recipe.id).update(recipe);
         let deleteFromFavoritePromise = this.deleteFromFavoriteRecipes(userUid, favoriteId);
         //let deleteFromIndexFavoritePromise = this.deleteFromIndexFavorites(recipe.id, favoriteCount);

         Promise.all([deleteFromFavoritePromise])
            .then(success => {
               resolve(true);
            }, err => {
               reject(false);
               console.log("Promise error: ", err);
               console.dir(err);
            });
      });
   }

   private deleteFromFavoriteRecipes(userUid, favoriteId) : Promise<any> {
      return new Promise((resolve, reject) => {
         firebase.firestore().collection('users').doc(userUid).collection('favoriteRecipes').doc(favoriteId).delete()
            .then(success => {
               resolve(true);
            }, err => {
               reject(false);
               console.log("Promise error: ", err);
               console.dir(err);
            });
      });
   }

   private deleteFromIndexFavorites(recipeId, favoriteCount) : Promise<any> {
      return new Promise((resolve, reject) => {
         firebase.firestore().collection('favorites').doc(favoriteCount.toString()).collection(recipeId).doc(recipeId)
            .delete()
               .then(success => {
                  favoriteCount -= 1;
                  firebase.firestore().collection('favorites').doc(favoriteCount.toString()).collection(recipeId).doc(recipeId)
                     .set({
                        recipeId: recipeId,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                        }).then(success => {
                           resolve(true);
                        }, err => {
                           reject(false);
                           console.log("Promise error: ", err);
                           console.dir(err);
                        });
               }, err => {
                  reject(false);
                  console.log("Promise error: ", err);
                  console.dir(err);
               });
      });
   }

   addToFavorites(userUid, recipeId) : Promise<any> {
      return new Promise((resolve, reject) => {
         //recipe.favoriteCount += 1;
         //let updateRecipePromise = firebase.firestore().collection('recipes').doc(recipe.id).update(recipe);
         let addToFavoritePromise = this.addToFavoriteRecipes(userUid, recipeId);
         //let addToIndexFavoritePromise = this.addToIndexFavorites(recipe.id, recipe.favoriteCount);

         Promise.all([addToFavoritePromise])
            .then(success => {
               resolve(success[1]);
            }, err => {
               reject('');
               console.log("Promise error: ", err);
               console.dir(err);
            });
      });
   }

   private addToFavoriteRecipes(userUid, recipeId) : Promise<any> {
      return new Promise((resolve, reject) => {
         firebase.firestore().collection('users').doc(userUid).collection('favoriteRecipes')
            .add({
               recipeId: recipeId,
               timestamp: firebase.firestore.FieldValue.serverTimestamp()
               }).then(success => {
                  resolve(success.id);
               }, err => {
                  reject(false);
                  console.log("Promise error: ", err);
                  console.dir(err);
               });
      });
   }

   private addToIndexFavorites(recipeId, favoriteCount) : Promise<any> {
      return new Promise((resolve, reject) => {
         firebase.firestore().collection('favorites').doc(favoriteCount.toString()).collection(recipeId).doc(recipeId)
            .set({
               recipeId: recipeId,
               timestamp: firebase.firestore.FieldValue.serverTimestamp()
               }).then(success => {
                  if(favoriteCount > 0){
                     favoriteCount -= 1;
                  }
                  firebase.firestore().collection('favorites').doc(favoriteCount.toString()).collection(recipeId).doc(recipeId)
                     .delete()
                        .then(success => {
                           resolve(true);
                        }, err => {
                           reject(false);
                           console.log("Promise error: ", err);
                           console.dir(err);
                        });
               }, err => {
                  reject(false);
                  console.log("Promise error: ", err);
                  console.dir(err);
               });
      });
   }

   getMyRecipes(userUid) : Promise<string[]> {
      return new Promise((resolve, reject) => {
         firebase.firestore().collection('users').doc(userUid).collection('myRecipes').orderBy('timestamp', 'desc').get()
            .then(success => {
               let myRecipes : string[] = [];

               success.forEach((item) => {
                  myRecipes.push(item.data().recipeId);
               });
               resolve(myRecipes);
            }, err => {
               reject(err);
               console.log("Promise error: ", err);
               console.dir(err);
            });
      });
   }

   addMyRecipes(recipeId, userUid) : Promise<any> {
      return new Promise((resolve, reject) => {
         firebase.firestore().collection('users').doc(userUid).collection('myRecipes')
            .add({
               recipeId: recipeId,
               timestamp: firebase.firestore.FieldValue.serverTimestamp()
               }).then(success => {
                  resolve(true);
               }, err => {
                  reject(false);
                  console.log("Promise error: ", err);
                  console.dir(err);
               });
      });
   }

   getCategories() : Promise<any> {
      return new Promise((resolve, reject) => {
         firebase.firestore().collection('categories').orderBy('name', 'asc').get()
            .then( success => {
               let categories : any = [];

               success.forEach((item) => {
                  categories.push({
                     name: item.data().name,
                     code: item.data().code
                  });
               });

               resolve(categories);
         }, err => {
            reject(err);
            console.log("Promise error: ", err);
            console.dir(err);
         });
      });
   }

}