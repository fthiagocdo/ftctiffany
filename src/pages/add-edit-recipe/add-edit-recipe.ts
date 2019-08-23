import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController, NavController } from 'ionic-angular';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { Utils } from '../../providers/utils/utils';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthService } from '../../providers/auth/auth-service';
import { EditFieldPage } from '../edit-field/edit-field';
import { MyRecipesPage } from '../my-recipes/my-recipes';

@IonicPage()
@Component({
  selector: 'page-add-edit-recipe',
  templateUrl: 'add-edit-recipe.html',
})
export class AddEditRecipePage {
  private pageTitle: string = '';
  private currentUser: any;
  private recipe: any;
  private oldRecipe: any = [];
  private photo: string = '/assets/imgs/recipe.jpg';
  private name: string  = '';
  private description: string = '';
  private pre: boolean = false;
  private recipeDuration: string  = '';
  private recipeInstructions: string  = '';
  private ingredientsString: string  = '';
  private portions: string = '';
  private categoriesString: string = '';

  constructor(
    private NAVPARAMS: NavParams,
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
    this.recipe = this.NAVPARAMS.get('recipe');

    if(this.recipe != null){
      this.pageTitle = 'Editar receita';
      this.photo = this.recipe.photo;
      this.name = this.recipe.name;
      this.description = this.UTILS.isEmpty(this.recipe.description) ? '' : this.recipe.description;
      this.pre = this.recipe.pre;
      this.recipeDuration = this.recipe.recipeDuration;
      this.recipeInstructions = this.recipe.recipeInstructions;
      this.portions = this.UTILS.isEmpty(this.recipe.portions) ? '' : this.recipe.portions;
      this.ingredientsString  = this.UTILS.buildStringIngredients(this.recipe.ingredients);
      this.categoriesString = this.UTILS.buildStringCategories(this.recipe.categories);
      this.oldRecipe.id = this.recipe.id;
      this.oldRecipe.name = this.recipe.name;
      this.oldRecipe.ingredients = [];
      this.recipe.ingredients.forEach(ingredient => {
        this.oldRecipe.ingredients.push(ingredient);
      });
      this.oldRecipe.categories = [];
      this.recipe.categories.forEach(category => {
        this.oldRecipe.categories.push(category);
      });
    } else {
      this.pageTitle = 'Adicionar receita';
      this.recipe = {};
    }

    this.LOADER.hidePreloader();
  }
  
  openModal(fieldName) {
    let editModal = this.MODALCTRL.create(EditFieldPage, {
      fieldName: fieldName,
      fieldValue: this.getValueField(fieldName)
    }, {
      showBackdrop: true, 
      enableBackdropDismiss: true
    });
    editModal.present();

    editModal.onDidDismiss(data => { 
      this.setValueField(fieldName, data);
    });
  }

  getValueField(fieldName) : any {
    if(fieldName.trim().toUpperCase() == 'imagem'.trim().toUpperCase()) {
      return this.recipe.photo;
    } else if(fieldName.trim().toUpperCase() == 'nome'.trim().toUpperCase()) {
      return this.name;
    } else if(fieldName.trim().toUpperCase() == 'descrição'.trim().toUpperCase()) {
      return this.description;
    } else if(fieldName.trim().toUpperCase() == 'tempo de preparo'.trim().toUpperCase()) {
      return this.recipeDuration;
    } else if(fieldName.trim().toUpperCase() == 'instruções de preparo'.trim().toUpperCase()) {
      return this.recipeInstructions;
    } else if(fieldName.trim().toUpperCase() == 'ingredientes'.trim().toUpperCase()) {
      return this.recipe.ingredients;
    } else if(fieldName.trim().toUpperCase() == 'rendimento'.trim().toUpperCase()) {
      return this.recipe.portions;
    } else if(fieldName.trim().toUpperCase() == 'categorias'.trim().toUpperCase()) {
      return this.recipe.categories;
    }
  }

  setValueField(fieldName, value) {
    if(fieldName.trim().toUpperCase() == 'nome'.trim().toUpperCase() && value != null) {
      this.recipe.name = this.name = value;
    } else if(fieldName.trim().toUpperCase() == 'descrição'.trim().toUpperCase()) {
      this.recipe.description = this.description = value;
    } else if(fieldName.trim().toUpperCase() == 'tempo de preparo'.trim().toUpperCase()  && value != null) {
      this.recipe.recipeDuration = this.recipeDuration = value;
    } else if(fieldName.trim().toUpperCase() == 'instruções de preparo'.trim().toUpperCase()  && value != null) {
      this.recipe.recipeInstructions = this.recipeInstructions = value;
    } else if(fieldName.trim().toUpperCase() == 'ingredientes'.trim().toUpperCase()  && value != null) {
      this.recipe.ingredients = value;
      this.ingredientsString = this.UTILS.buildStringIngredients(value);
    } else if(fieldName.trim().toUpperCase() == 'categorias'.trim().toUpperCase()  && value != null){
      this.recipe.categories = value;
      this.categoriesString = this.UTILS.buildStringCategories(value);
    } else if(fieldName.trim().toUpperCase() == 'rendimento'.trim().toUpperCase()) {
      this.recipe.portions = this.portions = value;
    } else if(fieldName.trim().toUpperCase() == 'imagem'.trim().toUpperCase()  && value != null) {
      this.recipe.photo = this.photo = value;
    }
  }

  confirm() {
    this.LOADER.displayPreloader();
    this.recipe.pre = this.pre;
    let _class = this;
    let errorMessage = this.isRecipeValid(); 

    if(errorMessage == ''){
      if(this.recipe.id == null) {
        this.DB.addRecipe(this.recipe, this.currentUser.uid)
          .then(success => {
            _class.UTILS.showMessage('Receita adicionada com sucesso.', 'info');
            _class.NAVCTRL.setRoot(MyRecipesPage);
          }, err => {
            console.log(err);
            _class.UTILS.showMessage('Não foi possível completar a requisição. Por favor, tente novamente mais tarde...', 'error');
            _class.LOADER.hidePreloader();
          });
      } else {
        this.DB.updateRecipe(this.recipe, this.oldRecipe)
          .then(success => {
            _class.UTILS.showMessage('Receita alterada com sucesso.', 'info');
            _class.NAVCTRL.setRoot(MyRecipesPage);
          }, err => {
            console.log(err);
            _class.UTILS.showMessage('Não foi possível completar a requisição. Por favor, tente novamente mais tarde...', 'error');
            _class.LOADER.hidePreloader();
          });
      }
    } else {
      _class.UTILS.showMessage(errorMessage, 'error');
      _class.LOADER.hidePreloader();
    }
  }

  isRecipeValid() : string {
    let errorMessage = '';

    if(this.UTILS.isEmpty(this.name)) {
      errorMessage = 'Por favor, preencha todos os campos *obrigatórios.';
    } else if(this.UTILS.isEmpty(this.recipeDuration)) {
      errorMessage = 'Por favor, preencha todos os campos *obrigatórios.';
    } else if(this.UTILS.isEmpty(this.recipeInstructions)) {
      errorMessage = 'Por favor, preencha todos os campos *obrigatórios.';
    } else if(this.UTILS.isEmpty(this.ingredientsString)) {
      errorMessage = 'Por favor, preencha todos os campos *obrigatórios.';
    } else if(this.UTILS.isEmpty(this.categoriesString)) {
      errorMessage = 'Por favor, preencha todos os campos *obrigatórios.';
    }

    return errorMessage;
  }

}