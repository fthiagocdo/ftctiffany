import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { PreloaderProvider } from '../../providers/preloader/preloader';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthService } from '../../providers/auth/auth-service';
import { Utils } from '../../providers/utils/utils';
import { AddEditRecipePage } from '../add-edit-recipe/add-edit-recipe';

@IonicPage()
@Component({
  selector: 'page-my-recipes',
  templateUrl: 'my-recipes.html',
})
export class MyRecipesPage {
  private currentUser: any;
  private recipes: any;
  private myRecipes: number[] = [];
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
  }

  ionViewWillEnter() {
    this.LOADER.displayPreloader();
    this.renderRecipes();
  }

  renderRecipes() {
    let _class = this;
    this.recipes = new Array();

    this.DB.getMyRecipes(this.currentUser.uid)
      .then(success => {
        if(success.length == 0) {
          this.isListEmpty = true;
          _class.LOADER.hidePreloader();
        } else {
          success.forEach(item => {
            _class.DB.getRecipe(item)
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

  goToAddEditRecipe(item) {
    this.LOADER.displayPreloader();
    this.NAVCTRL.push(AddEditRecipePage, {
      recipe: item
    });
  }

}
