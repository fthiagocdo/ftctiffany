import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { Utils } from '../../providers/utils/utils';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthService } from '../../providers/auth/auth-service';
import { EditFieldPage } from '../edit-field/edit-field';
import { SearchRecipeResultsPage } from '../search-recipe-results/search-recipe-results';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-search-recipe',
  templateUrl: 'search-recipe.html',
})
export class SearchRecipePage {
  private currentUser: any;
  private moreFilters: boolean = true;
  private moreFiltersLabel = '';
  private moreFiltersIcon = '';
  private name: string  = '';
  private pre: boolean = false;
  private recipeDuration: string  = '';
  private ingredientsString: string  = '';
  private categoriesString: string = '';
  private ingredientsList: string[]  = [];
  private categoriesList: string[] = [];

  constructor(
    private LOADER: PreloaderProvider,
    private UTILS: Utils,
    private DB: DatabaseProvider,
    private AUTH: AuthService,
    private MODALCTRL: ModalController,
    private NAVCTRL: NavController) {
      this.AUTH.activeUser.subscribe((_user)=>{
        this.currentUser = _user;
      });

      this.loadData();
  }

  loadData() {
    this.showMoreFilters();
    this.LOADER.hidePreloader();
  }

  showMoreFilters() {
    this.moreFilters = !this.moreFilters;
    if(this.moreFilters) {
      this.moreFiltersLabel = 'Menos filtros';
      this.moreFiltersIcon = 'remove';
    } else {
      this.moreFiltersLabel = 'Mais filtros';
      this.moreFiltersIcon = 'add';
      this.pre = false;
      this.recipeDuration = '';
      this.categoriesString = '';
      this.categoriesList = [];
    }
  }
  
  openModal(fieldName) {
    let editModal = this.MODALCTRL.create(EditFieldPage, {
      fieldName: fieldName,
      fieldValue: this.getValueField(fieldName),
      requiredField: false
    });
    editModal.present();

    editModal.onDidDismiss(data => { 
      this.setValueField(fieldName, data);
    });
  }

  getValueField(fieldName) : any {
    if(fieldName.trim().toUpperCase() == 'nome'.trim().toUpperCase()) {
      return this.name;
    } else if(fieldName.trim().toUpperCase() == 'tempo máximo de preparo'.trim().toUpperCase()) {
      return this.recipeDuration == null ? '' : this.recipeDuration;
    } else if(fieldName.trim().toUpperCase() == 'ingredientes'.trim().toUpperCase()) {
      return this.ingredientsList;
    } else if(fieldName.trim().toUpperCase() == 'categorias'.trim().toUpperCase()) {
      return this.categoriesList;
    }
  }

  setValueField(fieldName, value) {
    if(fieldName.trim().toUpperCase() == 'nome'.trim().toUpperCase() && value != null) {
      this.name = value;
    } else if(fieldName.trim().toUpperCase() == 'tempo máximo de preparo'.trim().toUpperCase()  && value != null) {
      this.recipeDuration = value;
    } else if(fieldName.trim().toUpperCase() == 'ingredientes'.trim().toUpperCase()  && value != null) {
      this.ingredientsList = value;
      this.ingredientsString = this.UTILS.buildStringIngredients(value);
    } else if(fieldName.trim().toUpperCase() == 'categorias'.trim().toUpperCase()  && value != null){
      this.categoriesList = value;
      this.categoriesString = this.UTILS.buildStringCategories(value);
    }
  }

  search() {
    this.LOADER.displayPreloader();
    let _class = this;
    let promises = [];

    if(this.ingredientsList.length > 0) {
      this.ingredientsList.forEach(ingredient => {
        promises.push(this.DB.searchRecipesByIndex(ingredient));  
      });
    }

    if(!this.UTILS.isEmpty(this.recipeDuration)) {
      promises.push(this.DB.searchRecipesByDuration(this.recipeDuration));
    }

    if(this.pre) {
      promises.push(this.DB.searchRecipesByPre());
    }

    if(this.categoriesList.length > 0) {
      this.categoriesList.forEach(key => {
        if(!this.UTILS.isEmpty(key)) {
          promises.push(this.DB.searchRecipesByIndex(key));
        }  
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

}
