import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthService } from '../../providers/auth/auth-service';
import { Utils } from '../../providers/utils/utils';
import { ShowRecipePage } from '../show-recipe/show-recipe';

@IonicPage()
@Component({
  selector: 'page-search-recipe-results',
  templateUrl: 'search-recipe-results.html',
})
export class SearchRecipeResultsPage {
  private currentUser: any;
  private recipes: any;
  private favoriteRecipes: any[] = [];
  private isListEmpty: boolean = false;

  constructor(
    private NAVCTRL: NavController,
    private NAVPARAMS: NavParams,
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
    this.recipes = this.NAVPARAMS.get('recipeSearchResults');

    if(this.recipes.length == 0) {
      this.isListEmpty = true;
    } else {
      this.isListEmpty = false;
    }

    this.LOADER.hidePreloader();

    /*if(!this.UTILS.isEmpty(_class.currentUser.uid)){
      this.DB.getFavoriteRecipes(this.currentUser.uid)
        .then(success => {
          _class.favoriteRecipes = success;
          _class.LOADER.hidePreloader();
        }, err => {
          console.log(err);
          _class.UTILS.showMessage("Não foi possível completar a requisição. Por favor, tente novamente mais tarde...", 'error');
          _class.LOADER.hidePreloader();
        });
    } else {
      this.LOADER.hidePreloader();
    } */   
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

