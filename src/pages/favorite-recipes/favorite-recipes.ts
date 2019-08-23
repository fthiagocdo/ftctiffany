import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { PreloaderProvider } from '../../providers/preloader/preloader';
import { DatabaseProvider } from '../../providers/database/database';
import { ShowRecipePage } from '../show-recipe/show-recipe';
import { AuthService } from '../../providers/auth/auth-service';
import { Utils } from '../../providers/utils/utils';

@IonicPage()
@Component({
  selector: 'page-favorite-recipes',
  templateUrl: 'favorite-recipes.html',
})
export class FavoriteRecipesPage {
  private currentUser: any;
  private recipes: any[] = [];
  private favoriteRecipes: any[] = [];
  private recipeId: number;
  private isListEmpty: boolean = false;

  constructor(
    private NAVCTRL: NavController,
    private LOADER: PreloaderProvider,
    private DB: DatabaseProvider,
    private AUTH: AuthService,
    private UTILS: Utils) {
      this.AUTH.activeUser.subscribe((_user)=>{
        this.currentUser = _user;
      });
      
      this.renderRecipes();
  }

  ionViewWillEnter() {
    let _class = this;
    this.LOADER.displayPreloader();

    let newFavorites: string[] = [];
    this.DB.getFavoriteRecipes(this.currentUser.uid)
      .then(success => {
        newFavorites = success;
        if(newFavorites.length != _class.recipes.length){
          _class.recipes.splice(_class.removedItemIndex(this.recipeId), 1);
        }

        if(success.length == 0){
          this.isListEmpty = true;
        }

        _class.LOADER.hidePreloader();
      }, err => {
        console.log(err);
        _class.UTILS.showMessage("Não foi possível completar a requisição. Por favor, tente novamente mais tarde...", 'error');
        _class.LOADER.hidePreloader();
      });
  }

  renderRecipes() {
    let _class = this;
    this.recipes = new Array();

    this.DB.getFavoriteRecipes(this.currentUser.uid)
      .then(success => {
        if(success.length == 0) {
          this.isListEmpty = true;
          _class.LOADER.hidePreloader();
        } else {
          _class.favoriteRecipes = success;
          success.forEach(item => {
            _class.DB.getRecipe(item.recipeId)
              .then(success => {
                _class.recipes.push(success);
                _class.LOADER.hidePreloader();
              }, err => {
                console.log(err);
                _class.UTILS.showMessage("Não foi possível completar a requisição. Por favor, tente novamente mais tarde...", 'error');
                _class.LOADER.hidePreloader();
              });
          });
        }
      }, err => {
        console.log(err);
        _class.UTILS.showMessage("Não foi possível completar a requisição. Por favor, tente novamente mais tarde...", 'error');
        _class.LOADER.hidePreloader();
      });
  }

  deleteFromFavorites(recipeId) {
    if(this.UTILS.isUserLogged(this.currentUser, this.NAVCTRL)){
      let _class = this
      this.LOADER.displayPreloader();

      this.DB.deleteFromFavorites(this.currentUser.uid, this.getFavoriteRecipeId(recipeId))
        .then(success => {
          _class.renderRecipes();
        }, err => {
          console.log(err);
          _class.UTILS.showMessage("Não foi possível completar a requisição. Por favor, tente novamente mais tarde...", 'error');
          _class.LOADER.hidePreloader();
        });
    }
  }

  goToRecipe(item) {
    this.LOADER.displayPreloader();
    this.NAVCTRL.push(ShowRecipePage, {
      recipe: item,
      favoriteRecipeId: this.getFavoriteRecipeId(item.id)
    });
  }

  getFavoriteRecipeId(recipeId) : string {
    let favoriteRecipe = this.favoriteRecipes.find(favoriteRecipe => recipeId == favoriteRecipe.recipeId);

    if(favoriteRecipe != null) {
      return favoriteRecipe.id;
    } else {
      return null;
    }
  }

  removedItemIndex(recipeId) : number {
    let count = 0;
    let index = -1;

    this.recipes.forEach(item => {
      if(item.id == recipeId){
        index = count;
      }else{
        count++;
      }
    });

    return index;
  }

}
