import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { PreloaderProvider } from '../../providers/preloader/preloader';
import { DatabaseProvider } from '../../providers/database/database';
import { ShowRecipePage } from '../show-recipe/show-recipe';
import { AuthService } from '../../providers/auth/auth-service';
import { Utils } from '../../providers/utils/utils';

@IonicPage()
@Component({
  selector: 'page-featured-recipes',
  templateUrl: 'featured-recipes.html',
})
export class FeaturedRecipesPage {
  private currentUser: any;
  private recipes: any;
  private favoriteRecipes: any[] = [];

  constructor(
    private NAVCTRL: NavController,
    private LOADER: PreloaderProvider,
    private DB: DatabaseProvider,
    private AUTH: AuthService,
    private UTILS: Utils) {
      this.AUTH.activeUser.subscribe((_user)=>{
        this.currentUser = _user;
      });
  }

  ionViewWillEnter() {
    this.LOADER.displayPreloader();
    this.renderRecipes();
  }

  renderRecipes() {
    let _class = this;

    this.DB.getRecipes()
      .then(success => { 
        _class.recipes = success;
        if(!_class.UTILS.isEmpty(_class.currentUser.uid)){
          _class.DB.getFavoriteRecipes(_class.currentUser.uid)
            .then(success => {
              _class.favoriteRecipes = success;
              _class.LOADER.hidePreloader();
            }, err => {
              console.log(err);
              _class.UTILS.showMessage("Não foi possível completar a requisição. Por favor, tente novamente mais tarde...", 'error');
              _class.LOADER.hidePreloader();
            });
        } else {
          _class.LOADER.hidePreloader();
        }    
      }, err => {
        console.log(err);
        _class.UTILS.showMessage("Não foi possível completar a requisição. Por favor, tente novamente mais tarde...", 'error');
        _class.LOADER.hidePreloader();
      });
  }

  addToFavorites(recipeId) {
    if(this.UTILS.isUserLogged(this.currentUser, this.NAVCTRL)){
      let _class = this;
      this.LOADER.displayPreloader();

      this.DB.addToFavorites(this.currentUser.uid, recipeId)
        .then(success => {
          _class.renderRecipes();
        }, err => {
          console.log(err);
          _class.UTILS.showMessage("Não foi possível completar a requisição. Por favor, tente novamente mais tarde...", 'error');
          _class.LOADER.hidePreloader();
        });
    }
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

  getFavoriteRecipeId(recipeId) : string {
    let favoriteRecipe = this.favoriteRecipes.find(favoriteRecipe => recipeId == favoriteRecipe.recipeId);

    if(favoriteRecipe != null) {
      return favoriteRecipe.id;
    } else {
      return null;
    }
  }

  goToRecipe(item) {
    this.LOADER.displayPreloader();
    this.NAVCTRL.push(ShowRecipePage, {
      recipe: item,
      favoriteRecipeId: this.getFavoriteRecipeId(item.id)
    });
  }

}
