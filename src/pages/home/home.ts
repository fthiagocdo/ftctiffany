import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { PreloaderProvider } from '../../providers/preloader/preloader';
import { DatabaseProvider } from '../../providers/database/database';
import { ShowRecipePage } from '../show-recipe/show-recipe';
import { AuthService } from '../../providers/auth/auth-service';
import { Utils } from '../../providers/utils/utils';
import { SearchRecipeResultsPage } from '../search-recipe-results/search-recipe-results';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  private currentUser: any;
  private recipes: any;
  private favoriteRecipes: any[] = [];
  private searchRecipeKeys: string;

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

  ionViewDidLoad() {
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

  search() {
    this.LOADER.displayPreloader();
    let _class = this;
    let promises = [];

    if(this.searchRecipeKeys.length > 0) {
      this.searchRecipeKeys.split(' ').forEach(ingredient => {
        promises.push(this.DB.searchRecipesByIndex(ingredient));  
      });
    }
    
    if(promises.length > 0) {
      Promise.all(promises)
        .then(success => {
          let result = _.intersectionBy(...success, 'id');
          _class.NAVCTRL.push(SearchRecipeResultsPage, {
            recipeSearchResults: result
          });
        }, err => {
          console.log(err);
          _class.UTILS.showMessage('Não foi possível completar a requisição. Por favor, tente novamente mais tarde...', 'error');
          _class.LOADER.hidePreloader();
        });
    } else {
      _class.UTILS.showMessage('Informe pelo menos um filtro para realizar a consulta.', 'error');
      _class.LOADER.hidePreloader();
    }
  }

  goToRecipe(item) {
    this.LOADER.displayPreloader();
    this.NAVCTRL.push(ShowRecipePage, {
      recipe: item
    });
  }

}
