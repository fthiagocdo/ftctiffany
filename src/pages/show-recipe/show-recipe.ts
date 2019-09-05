import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { Utils } from '../../providers/utils/utils';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthService } from '../../providers/auth/auth-service';

@IonicPage()
@Component({
  selector: 'page-show-recipe',
  templateUrl: 'show-recipe.html',
})
export class ShowRecipePage {
  private recipe: any;
  private currentUser: any;
  private id: string;
  private userUid: string;
  private photo: string;
  private name: string;
  private category: string;
  private pre: boolean = false;
  private recipeDuration: string;
  private recipeInstructions: string;
  private ingredients: string[] = new Array();
  private categories: string[] = new Array();
  private portions: string = '';
  private favoriteRecipes: any[] = [];
  private favoriteRecipeId: string;

  constructor(
    private NAVPARAMS: NavParams,
    private LOADER: PreloaderProvider,
    private UTILS: Utils,
    private DB: DatabaseProvider,
    private AUTH: AuthService,
    private NAVCTRL: NavController) {
      this.AUTH.activeUser.subscribe((_user)=>{
        this.currentUser = _user;
      });

      this.loadData();
  }

  loadData() {
    this.recipe = this.NAVPARAMS.get('recipe');
    
    this.id = this.recipe.id;
    this.userUid = this.recipe.userId;
    this.photo = this.recipe.photo;
    this.name = this.recipe.name;
    this.pre = this.recipe.pre;
    this.recipeDuration = this.recipe.recipeDuration;
    this.recipeInstructions = this.recipe.recipeInstructions.replace(/\n/g, '<br />');
    this.ingredients = this.recipe.ingredients;
    this.portions = this.recipe.portions;
    this.categories = this.recipe.categories;

    if(this.currentUser.isLogged) {
      this.getFavoriteRecipes();
    } else {
      this.LOADER.hidePreloader();
    }
  }

  getFavoriteRecipes() {
    let _class = this;
    this.DB.getFavoriteRecipes(this.currentUser.uid)
      .then(success => {
        _class.favoriteRecipes = success;
        _class.favoriteRecipeId = _class.getFavoriteRecipeId(_class.recipe.id);
        _class.LOADER.hidePreloader();
      }, err => {
        console.log(err);
        _class.UTILS.showMessage("Não foi possível completar a requisição. Por favor, tente novamente mais tarde...", 'error');
        _class.LOADER.hidePreloader();
      });
  }

  addToFavorites() {
    if(this.UTILS.isUserLogged(this.currentUser, this.NAVCTRL)){
      let _class = this;
      this.LOADER.displayPreloader();

      //insert recipe.id and returns a favoriteRecipeId
      this.DB.addToFavorites(this.currentUser.uid, this.recipe.id)
        .then(success => {
          _class.favoriteRecipeId = success;
          _class.LOADER.hidePreloader();
        }, err => {
          console.log(err);
          _class.UTILS.showMessage("Não foi possível completar a requisição. Por favor, tente novamente mais tarde...", 'error');
          _class.LOADER.hidePreloader();
        });
    }
  }

  deleteFromFavorites() {
    if(this.UTILS.isUserLogged(this.currentUser, this.NAVCTRL)){
      let _class = this;
      this.LOADER.displayPreloader();

      //search for the favoriteRecipeId
      this.DB.deleteFromFavorites(this.currentUser.uid, this.favoriteRecipeId)
        .then(success => {
          _class.favoriteRecipeId = null;
          _class.LOADER.hidePreloader();
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

}
