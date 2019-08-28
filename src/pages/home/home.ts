import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { PreloaderProvider } from '../../providers/preloader/preloader';
import { DatabaseProvider } from '../../providers/database/database';
import { ShowRecipePage } from '../show-recipe/show-recipe';
import { AuthService } from '../../providers/auth/auth-service';
import { Utils } from '../../providers/utils/utils';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
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

  goToRecipe(item) {
    this.LOADER.displayPreloader();
    this.NAVCTRL.push(ShowRecipePage, {
      recipe: item
    });
  }

}
